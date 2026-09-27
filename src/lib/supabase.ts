import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Missing VITE_SUPABASE_URL. Configure the Supabase project URL before starting Verdantry.",
  );
}

if (!supabasePublishableKey) {
  throw new Error(
    "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Configure the Supabase publishable key before starting Verdantry.",
  );
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey,
);