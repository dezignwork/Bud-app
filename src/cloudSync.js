import { supabase } from "./supabaseClient";

const TABLE = "bud_state";
const DEVICE_KEY = "bud.device.v1";

// A random per-device id, generated once and kept in localStorage — there's
// no login, so this is the only thing tying a device to its cloud backup.
export function getDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return null;
  }
}

export async function pullCloudState() {
  if (!supabase) return null;
  const id = getDeviceId();
  if (!id) return null;
  try {
    const { data, error } = await supabase.from(TABLE).select("state").eq("device_id", id).maybeSingle();
    if (error || !data) return null;
    return data.state;
  } catch {
    return null;
  }
}

// Fire-and-forget: a failed sync just means the local copy stays the source
// of truth until the next successful attempt.
export function pushCloudState(state) {
  if (!supabase) return;
  const id = getDeviceId();
  if (!id) return;
  supabase
    .from(TABLE)
    .upsert({ device_id: id, state, updated_at: new Date().toISOString() })
    .then(({ error }) => {
      if (error) console.warn("Bud cloud sync failed:", error.message);
    });
}
