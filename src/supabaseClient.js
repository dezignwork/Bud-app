import { createClient } from "@supabase/supabase-js";

// Cloud backup is optional: without these env vars the app runs exactly as
// before, fully offline-capable on localStorage alone.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
