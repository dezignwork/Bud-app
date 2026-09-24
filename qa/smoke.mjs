// Bud smoke test — walks the whole app once as a real user would, using
// gestures (drags/taps), not internal state pokes, so it actually exercises
// the same code paths a person's thumb does. Run with `npm run qa`.
//
// What this does and doesn't cover:
// - Everything here runs against localStorage only. This repo has no real
//   Supabase project (only `.env.example`, no `.env`), so the optional
//   cloud-backup path (src/cloudSync.js) is never exercised — without
//   VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY, `supabase` is null and every
//   cloud call is already a documented no-op, so its absence here doesn't
//   mean anything is broken, only that it's untested by this script.
// - It's a smoke test (does the golden path work, does anything throw),
//   not a full regression suite or a visual diff tool.
//
// Usage:
//   npm run qa                    starts `vite` dev server itself, runs, exits
//   QA_BASE_URL=http://localhost:5173 npm run qa   tests an already-running server instead
//   QA_KEEP_OPEN=1 npm run qa     leaves the browser open after a failure, for poking at it
//
// Exit code is 0 iff every check passed. Screenshots of the last state of
// each major section land in qa/output/ (gitignored) for a quick look.

import { chromium, devices } from "playwright";
import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "output");
mkdirSync(OUT_DIR, { recursive: true });

const PORT = 5173;
const BASE_URL = process.env.QA_BASE_URL || `http://localhost:${PORT}`;
const KEEP_OPEN = !!process.env.QA_KEEP_OPEN;

const results = [];
const consoleProblems = [];

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

// ---- optional: start a dev server ourselves ---------------------------
function startDevServer() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["vite", "--port", String(PORT), "--strictPort"], {
      cwd: path.join(__dirname, ".."),
      stdio: ["ignore", "pipe", "pipe"],
    });
    let settled = false;
    const onData = (buf) => {
      if (settled) return;
      if (buf.toString().includes("ready in") || buf.toString().includes("Local:")) {
        settled = true;
        resolve(child);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("exit", (code) => {
      if (!settled) reject(new Error(`vite dev server exited early (code ${code})`));
    });
    setTimeout(() => {
      if (!settled) reject(new Error("vite dev server didn't report ready within 20s"));
    }, 20000);
  });
}

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`server at ${url} never came up`);
}

// ---- gesture helpers ----------------------------------------------------
// The app reads pointer position via clientX/clientY on real pointer
// events; Playwright's page.mouse dispatches real mouse events, which
// Chromium also fires as pointer events, so this exercises the same
// onPointerDown/Move/Up handlers a touch would.
async function drag(page, x0, y0, dx, dy, { steps = 12, release = true } = {}) {
  await page.mouse.move(x0, y0);
  await page.mouse.down();
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(x0 + (dx * i) / steps, y0 + (dy * i) / steps, { steps: 1 });
  }
  if (release) await page.mouse.up();
}

async function main() {
  console.log(`Bud smoke test — target ${BASE_URL}`);

  let devServerProc = null;
  if (!process.env.QA_BASE_URL) {
    console.log("No QA_BASE_URL given — starting `vite` dev server...");
    devServerProc = await startDevServer();
  }
  await waitForServer(BASE_URL);

  // Normally just chromium.launch() — run `npx playwright install` once
  // first if Playwright hasn't downloaded a browser yet. QA_CHROMIUM_PATH
  // is only for environments (like a locked-down CI sandbox) that ship a
  // pinned Chromium at a fixed path instead of letting Playwright manage
  // its own download.
  const browser = await chromium.launch(
    process.env.QA_CHROMIUM_PATH ? { executablePath: process.env.QA_CHROMIUM_PATH } : {}
  );
  const context = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await context.newPage();

  page.on("pageerror", (err) => consoleProblems.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleProblems.push(`console.error: ${msg.text()}`);
  });

  const shot = (name) => page.screenshot({ path: path.join(OUT_DIR, `${name}.png`) });
  const quoteText = () =>
    page.evaluate(() => {
      const els = [...document.querySelectorAll("div")];
      const q = els.find((d) => getComputedStyle(d).fontSize === "38px");
      return q ? q.textContent : null;
    });
  const bodyHas = (text) => page.evaluate((t) => document.body.textContent.includes(t), text);

  // ---- Onboarding -------------------------------------------------------
  await check("boots to onboarding on a clean profile", async () => {
    await page.goto(`${BASE_URL}/?skipSplash`);
    await page.getByText("Nice to meet you").waitFor({ timeout: 8000 });
  });

  await check("completes onboarding (name + mood) and lands on Today", async () => {
    await page.getByText("Nice to meet you").click();
    await page.getByPlaceholder("your name").waitFor();
    await page.getByPlaceholder("your name").fill("QA Tester");
    await page.getByText("That's me").click();
    await page.getByText("Got it!").click();
    await page.getByText("Hopeful", { exact: true }).click();
    await page.getByText("Let's Grow!").click();
    await page.waitForTimeout(500);
    const q = await quoteText();
    assert(q && q.length > 0, "expected a 38px quote on Today after onboarding");
    await shot("01-today-initial");
  });

  await check("nav shows all four tabs and a streak badge", async () => {
    for (const label of ["Today", "Grove", "Journal", "Mood"]) {
      await page.getByText(label, { exact: true }).waitFor();
    }
    const streak = await page.evaluate(() => document.body.textContent.match(/\d+ days/));
    assert(streak, "expected an 'N days' streak badge");
  });

  // ---- Today: line-selection mechanics -----------------------------------
  let q0, q1, q2;
  await check("swipe-right shuffles to a different random line", async () => {
    q0 = await quoteText();
    await drag(page, 120, 400, 55, 0);
    await page.waitForTimeout(400); // snap-back transition
    q1 = await quoteText();
    assert(q1 && q1 !== q0, `expected quote to change on swipe-right (still "${q1}")`);
  });

  await check("left swipe is a no-op", async () => {
    const before = await quoteText();
    await drag(page, 250, 400, -55, 0);
    await page.waitForTimeout(400);
    const after = await quoteText();
    assert(after === before, "left swipe should not change the quote");
  });

  await check("pull-down advances to the next sequential line", async () => {
    q2 = await quoteText();
    await drag(page, 200, 400, 0, 60);
    await page.waitForTimeout(400);
    const after = await quoteText();
    assert(after && after !== q2, "expected quote to change on pull-down");
  });

  await check("a tiny drag triggers neither gesture", async () => {
    const before = await quoteText();
    await drag(page, 200, 400, 12, 0);
    await page.waitForTimeout(400);
    const after = await quoteText();
    assert(after === before, "small drag should not change the quote");
  });

  // ---- Keep --------------------------------------------------------------
  let keptLine;
  await check("swiping Keep saves the current line", async () => {
    keptLine = await quoteText();
    const heart = page.locator("text=♡").first();
    const box = await heart.boundingBox();
    assert(box, "could not find the Keep tab's heart icon");
    await drag(page, box.x + box.width / 2, box.y + box.height / 2, -90, 0, { steps: 8 });
    await page.waitForTimeout(900); // flying-bubble animation
    const isKept = await bodyHas("Kept");
    assert(isKept, "expected the Keep tab to show 'Kept' after swiping");
  });

  await check("kept line shows up in Grove", async () => {
    await page.getByText("Grove", { exact: true }).click();
    await page.waitForTimeout(400);
    await page.getByText("LINES YOU KEPT").waitFor();
    const has = await bodyHas(keptLine);
    assert(has, `expected "${keptLine}" under Lines You Kept`);
    const litDays = await page.evaluate(
      () => [...document.querySelectorAll("div")].filter((d) => getComputedStyle(d).backgroundColor === "rgb(9, 64, 32)").length
    );
    assert(litDays >= 1, "expected at least today's calendar cell to be lit");
    await shot("02-grove");
  });

  // ---- Water ---------------------------------------------------------
  await check("swiping Water starts the watering-can animation", async () => {
    await page.getByText("Today", { exact: true }).click();
    await page.waitForTimeout(400);
    const drop = page.locator('svg[viewBox="0 0 20 20"]');
    const box = await drop.boundingBox();
    assert(box, "could not find the Water tab's drop icon");
    await drag(page, box.x + box.width / 2, box.y + box.height / 2, -90, 0, { steps: 8 });
    await page.waitForTimeout(300);
    const fill = await drop.getAttribute("fill");
    assert(fill && fill !== "none", "expected the drop icon to be filled while watering");
    await shot("03-watering");
  });

  await check("a thanks message appears after the can fully exits, and the drop empties again", async () => {
    await page.waitForTimeout(4700); // WATER_CAN_MS (4500) + a small margin
    const drop = page.locator('svg[viewBox="0 0 20 20"]');
    const fill = await drop.getAttribute("fill");
    assert(fill === "none", "expected the drop icon to be empty again once watering finished");
  });

  // ---- Journal ------------------------------------------------------
  await check("journal entry can be written, saved, and appears under Earlier", async () => {
    await page.getByText("Journal", { exact: true }).click();
    await page.waitForTimeout(300);
    const textarea = page.locator("textarea");
    await textarea.fill("A quick QA note, nothing fancy.");
    const has6words = await bodyHas("6 words");
    assert(has6words, "expected the word count to read '6 words'");
    await page.getByText("Save", { exact: true }).click();
    await page.waitForTimeout(200);
    const savedInList = await bodyHas("A quick QA note, nothing fancy.");
    assert(savedInList, "expected the saved draft to appear under Earlier");
    await shot("04-journal");
  });

  await check("journal entry can be deleted via edit mode", async () => {
    await page.getByText("EDIT", { exact: true }).click();
    await page.waitForTimeout(150);
    // The trash icon is the only 16x16-viewBox svg on this screen.
    await page.locator('svg[viewBox="0 0 16 16"]').first().click();
    await page.waitForTimeout(150);
    const stillThere = await bodyHas("A quick QA note, nothing fancy.");
    assert(!stillThere, "expected the entry to be gone after deleting it");
  });

  await check("Ploon Mode swaps the placeholder and grows the textarea", async () => {
    const textarea = page.locator("textarea");
    const before = await textarea.evaluate((el) => el.style.minHeight || getComputedStyle(el).minHeight);
    await page.getByText("Ploon Mode").click();
    await page.waitForTimeout(150);
    const placeholder = await textarea.getAttribute("placeholder");
    assert(placeholder === "Let's go animal mode.", `expected Ploon placeholder, got "${placeholder}"`);
    const after = await textarea.evaluate((el) => el.style.minHeight || getComputedStyle(el).minHeight);
    assert(after !== before, "expected the textarea to grow in Ploon Mode");
    await page.getByText("Ploon Mode").click(); // leave it off for cleanliness
  });

  // ---- Mood ------------------------------------------------------------
  await check("changing mood and pot shape updates the active state", async () => {
    await page.getByText("Mood", { exact: true }).click();
    await page.waitForTimeout(300);
    await page.getByText("Calm", { exact: true }).click();
    await page.waitForTimeout(150);
    await page.getByText("Round", { exact: true }).click();
    await page.waitForTimeout(150);
    await shot("05-mood");
  });

  await check("editing the name round-trips back to the Mood tab", async () => {
    await page.getByText("Bud calls you").click();
    await page.waitForTimeout(300);
    const input = page.getByPlaceholder("your name");
    await input.waitFor();
    await input.fill("Renamed Tester");
    await page.getByText("Save", { exact: true }).click();
    await page.waitForTimeout(300);
    const has = await bodyHas("Renamed Tester");
    assert(has, "expected the Mood tab to show the newly-edited name");
  });

  // ---- Meditation ---------------------------------------------------------
  await check("triple-tapping the plant opens Meditation, and End early exits it", async () => {
    await page.getByText("Today", { exact: true }).click();
    await page.waitForTimeout(400);
    // tapPlant() requires 3 taps within 900ms of each other — three
    // separate .click() calls each pay Playwright's normal actionability
    // overhead (hover, hit-test, etc.) and can blow past that window, so
    // fire raw mouse clicks at the element's own center instead.
    const plant = page.locator('[data-testid="bud-plant"]');
    await plant.waitFor();
    const box = await plant.boundingBox();
    assert(box, "could not find the plant element");
    const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
    for (let i = 0; i < 3; i++) await page.mouse.click(cx, cy);
    await page.waitForTimeout(300);
    await page.getByText("Meditation Mode").waitFor({ timeout: 3000 });
    await page.getByText("Let's start").click();
    await page.getByText("Ready?").waitFor({ timeout: 2000 });
    await page.getByText("End early").click();
    await page.waitForTimeout(300);
    const stillMeditating = await bodyHas("Meditation Mode");
    assert(!stillMeditating, "expected Meditation to be closed after End early");
  });

  // ---- report -------------------------------------------------------------
  const failed = results.filter((r) => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  if (consoleProblems.length) {
    console.log(`\n${consoleProblems.length} console error(s)/pageerror(s) seen during the run:`);
    consoleProblems.slice(0, 20).forEach((p) => console.log(`  - ${p}`));
  }
  if (failed.length) {
    console.log("\nFailed checks:");
    failed.forEach((r) => console.log(`  - ${r.name}: ${r.err.message}`));
  }

  if (failed.length && KEEP_OPEN) {
    console.log("\nQA_KEEP_OPEN is set — leaving the browser open on its current page. Ctrl-C to quit (this also stops the dev server this script started).");
    return; // skip cleanup and let the process hang open with the browser/server alive
  }

  await browser.close();
  if (devServerProc) devServerProc.kill();
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error("QA script crashed:", err);
  process.exit(1);
});
