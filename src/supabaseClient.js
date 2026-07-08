import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qthnlfidflbvxaflgdpn.supabase.co";
const supabaseKey = "sb_publishable_y2geU-OQRJ79cwcEB6jL8g_zNwYedca";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: window.localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
