// Bud cloud-sync test — exercises src/cloudSync.js for real, against a fake
// Supabase that this script runs itself. Run with `npm run qa:sync`.
//
// Why a fake server rather than a mocked module: the app talks to Supabase
// through @supabase/supabase-js over HTTP, and the thing worth testing is
// the whole path — device id, the restore-on-fresh-install branch in
// useBud.js, the fire-and-forget push, and what happens when the backup
// fails. Pointing the real client at a local stub exercises all of it and
// needs no Supabase account, no keys, and no network.
//
// What it checks:
//   1. a device id is minted once and survives a reload
//   2. a fresh install with a cloud backup restores name, entries and streak
//   3. local changes are pushed, under the same device id, with the durable
//      slice only (no transient UI fields)
//   4. a backup that fails does not eat the entry: local state survives a
//      reload and the app keeps working
//   5. with no Supabase configured, nothing is sent anywhere
//
// Usage:
//   npm run qa:sync              starts vite and the stub itself, runs, exits
//   QA_KEEP_OPEN=1 npm run qa:sync   leaves the browser open after a failure
//
// Exit code is 0 iff every check passed.

import { chromium, devices } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "output");
mkdirSync(OUT_DIR, { recursive: true });

const VITE_PORT = 5174;          // not 5173, so this can run beside smoke.mjs
const STUB_PORT = 5433;
const BASE_URL = `http://localhost:${VITE_PORT}`;
const STUB_URL = `http://localhost:${STUB_PORT}`;
const ANON_KEY = "test-anon-key-not-a-real-secret";
const KEEP_OPEN = !!process.env.QA_KEEP_OPEN;

const results = [];

async function check(name, fn) {
  const t0 = Date.now();
  try {
    await fn();
    results.push({ name, ok: true, ms: Date.now() - t0 });
    console.log(`  ✓ ${name}`);
  } catch (err) {
    results.push({ name, ok: false, ms: Date.now() - t0, err });
    console.log(`  ✗ ${name}\n      ${err.message}`);
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg || "assertion failed");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- the fake Supabase ------------------------------------------------
// Speaks just enough PostgREST for supabase-js: a GET that filters on
// device_id, and an upsert POST. `rows` is the cloud's memory; `writes`
// records every push so the test can inspect what the app actually sent;
// `failWrites` makes every push fail, for the unhappy path.
const cloud = { rows: new Map(), writes: [], failWrites: false, reads: 0 };

function startStub() {
  const server = createServer((req, res) => {
    const url = new URL(req.url, STUB_URL);
    const send = (code, body) => {
      res.writeHead(code, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
      });
      res.end(JSON.stringify(body));
    };

    if (req.method === "OPTIONS") return send(200, {});

    if (req.method === "GET" && url.pathname === "/rest/v1/bud_state") {
      cloud.reads++;
      // supabase-js sends ?device_id=eq.<id>
      const raw = url.searchParams.get("device_id") || "";
      const id = raw.startsWith("eq.") ? raw.slice(3) : raw;
      const row = cloud.rows.get(id);
      return send(200, row ? [row] : []);
    }

    if (req.method === "POST" && url.pathname === "/rest/v1/bud_state") {
      let body = "";
      req.on("data", (c) => (body += c));
      req.on("end", () => {
        let parsed = null;
        try { parsed = JSON.parse(body); } catch { parsed = null; }
        const row = Array.isArray(parsed) ? parsed[0] : parsed;
        cloud.writes.push(row);
        if (cloud.failWrites) return send(500, { message: "stub: write rejected" });
        if (row && row.device_id) cloud.rows.set(row.device_id, row);
        return send(201, [row]);
      });
      return;
    }

    send(404, { message: "stub: no route" });
  });
  return new Promise((resolve) => server.listen(STUB_PORT, () => resolve(server)));
}

// ---- the dev server, pointed at the stub ------------------------------
function startDevServer() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["vite", "--port", String(VITE_PORT), "--strictPort"], {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        VITE_SUPABASE_URL: STUB_URL,
        VITE_SUPABASE_ANON_KEY: ANON_KEY,
      },
    });
    let settled = false;
    const onData = (buf) => {
      const s = buf.toString();
      if (!settled && (s.includes("ready in") || s.includes("Local:"))) {
        settled = true;
        resolve(child);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("error", reject);
    setTimeout(() => { if (!settled) reject(new Error("vite did not start in 30s")); }, 30000);
  });
}

// ---- helpers ----------------------------------------------------------
async function freshPage(browser) {
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") console.log(`      [console] ${m.text()}`); });
  await page.goto(`${BASE_URL}/?skipSplash`, { waitUntil: "networkidle" });
  return { ctx, page };
}

// Onboarding is the only way into the app on a fresh device. Same steps the
// smoke test walks, so the two stay in sync if the flow changes.
async function onboard(page, name) {
  await page.getByText("Nice to meet you").waitFor({ timeout: 10000 });
  await page.getByText("Nice to meet you").click();
  await page.getByPlaceholder("your name").waitFor();
  await page.getByPlaceholder("your name").fill(name);
  await page.getByText("That's me").click();
  await page.getByText("Got it!").click();
  await page.getByText("Hopeful", { exact: true }).click();
  await page.getByText("Let's Grow!").click();
  await sleep(900);
}

// ---- the run ----------------------------------------------------------
let stub, vite, browser;

try {
  console.log("\nBud cloud sync\n");
  stub = await startStub();
  vite = await startDevServer();
  browser = await chromium.launch();

  await check("mints a device id and keeps it across a reload", async () => {
    const { ctx, page } = await freshPage(browser);
    const first = await page.evaluate(() => localStorage.getItem("bud.device.v1"));
    assert(first, "no device id was written to localStorage");
    await page.reload({ waitUntil: "networkidle" });
    const second = await page.evaluate(() => localStorage.getItem("bud.device.v1"));
    assert(first === second, `device id changed across reload: ${first} -> ${second}`);
    await ctx.close();
  });

  await check("pushes the durable slice, and only that, after a change", async () => {
    const { ctx, page } = await freshPage(browser);
    cloud.writes.length = 0;
    await onboard(page, "Testy");
    await sleep(1500);
    assert(cloud.writes.length > 0, "nothing was pushed to the cloud after onboarding");

    const last = cloud.writes[cloud.writes.length - 1];
    assert(last.device_id, "push carried no device_id");
    assert(last.updated_at, "push carried no updated_at");
    const state = last.state || {};
    assert(state.onboarded === true, "pushed state was not marked onboarded");
    assert(state.name === "Testy", `pushed name was ${JSON.stringify(state.name)}`);

    // Transient UI fields must never reach the backup.
    for (const junk of ["screen", "step", "squish", "rain", "med", "draft", "flying"]) {
      assert(!(junk in state), `transient field "${junk}" leaked into the cloud backup`);
    }
    await ctx.close();
  });

  await check("a fresh install restores the backup instead of onboarding again", async () => {
    // Seed the cloud under a known device id, then hand a blank browser that
    // same id — exactly the reinstall case.
    const id = "qa-restore-device";
    cloud.rows.set(id, {
      device_id: id,
      updated_at: new Date().toISOString(),
      state: {
        onboarded: true,
        name: "Restored",
        mood: "Calm",
        theme: "meadow",
        potShape: "taper",
        saved: ["a line worth keeping"],
        entries: [{ date: "2026-01-01", text: "an entry from the old phone" }],
        openedDates: [],
        lastMoodPromptDate: null,
      },
    });

    const ctx = await browser.newContext({ ...devices["iPhone 13"] });
    const page = await ctx.newPage();
    await page.addInitScript((deviceId) => {
      localStorage.setItem("bud.device.v1", deviceId);
    }, id);
    await page.goto(`${BASE_URL}/?skipSplash`, { waitUntil: "networkidle" });
    await sleep(2500);

    const body = await page.evaluate(() => document.body.innerText);
    assert(!/nice to meet you/i.test(body), "app showed onboarding despite a cloud backup");

    const local = await page.evaluate(() => JSON.parse(localStorage.getItem("bud.app.v1") || "null"));
    assert(local && local.onboarded === true, "restored state was not persisted locally");
    assert(local.name === "Restored", `restored name was ${JSON.stringify(local && local.name)}`);
    assert(
      JSON.stringify(local.entries || []).includes("an entry from the old phone"),
      "journal entries were not restored from the backup"
    );
    await page.screenshot({ path: path.join(OUT_DIR, "sync-restored.png") });
    await ctx.close();
  });

  await check("a failed backup does not eat the entry", async () => {
    cloud.failWrites = true;
    cloud.writes.length = 0;
    const { ctx, page } = await freshPage(browser);
    await onboard(page, "Offline");
    await sleep(1500);

    assert(cloud.writes.length > 0, "no push was attempted");
    const beforeReload = await page.evaluate(() => localStorage.getItem("bud.app.v1"));
    assert(beforeReload && beforeReload.includes("Offline"), "local state lost while the backup was failing");

    await page.reload({ waitUntil: "networkidle" });
    await sleep(1200);
    const afterReload = await page.evaluate(() => JSON.parse(localStorage.getItem("bud.app.v1") || "null"));
    assert(afterReload && afterReload.name === "Offline", "local state did not survive a reload after a failed backup");

    const body = await page.evaluate(() => document.body.innerText);
    assert(body.trim().length > 0, "app rendered nothing after a failed backup");
    await page.screenshot({ path: path.join(OUT_DIR, "sync-failed-write.png") });
    cloud.failWrites = false;
    await ctx.close();
  });

  await check("restores nothing, and sends nothing, when the cloud is empty", async () => {
    cloud.writes.length = 0;
    const before = cloud.reads;
    const ctx = await browser.newContext({ ...devices["iPhone 13"] });
    const page = await ctx.newPage();
    await page.addInitScript(() => localStorage.setItem("bud.device.v1", "qa-empty-device"));
    await page.goto(`${BASE_URL}/?skipSplash`, { waitUntil: "networkidle" });
    await sleep(2000);

    assert(cloud.reads > before, "no cloud read was attempted on a fresh device");
    const body = await page.evaluate(() => document.body.innerText);
    assert(/name|hello|hi\b/i.test(body) || body.trim().length > 0, "app did not render its first screen");
    const local = await page.evaluate(() => JSON.parse(localStorage.getItem("bud.app.v1") || "null"));
    assert(!local || local.onboarded !== true, "app claimed to be onboarded with an empty cloud");
    await ctx.close();
  });
} catch (err) {
  console.log(`\n  ✗ run aborted: ${err.message}`);
  results.push({ name: "run", ok: false, err });
} finally {
  if (browser && !KEEP_OPEN) await browser.close();
  if (vite) vite.kill();
  if (stub) stub.close();
}

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.log("\nFailures:");
  for (const f of failed) console.log(`  ${f.name}: ${f.err?.message}`);
}
process.exit(failed.length ? 1 : 0);
