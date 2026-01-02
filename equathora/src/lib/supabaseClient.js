import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    // Fail fast with a clear message when env vars are missing in production builds.
    throw new Error("Missing Supabase environment variables (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)");
}

export const supabase = createClient(supabaseUrl, supabaseKey);