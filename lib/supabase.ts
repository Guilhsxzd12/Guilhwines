import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bfvkhxshqdonbgnnlxxy.supabase.co";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_pUdgToHwbtvPV7wo_95Bpw_D2xs1cm2";

export function getSupabase() {
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
}
