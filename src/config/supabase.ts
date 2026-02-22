import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    });
} else if (import.meta.env.VITE_APP_MODE !== 'demo') {
    console.error(
        '[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. ' +
        'Copy .env.example to .env and configure your Supabase credentials.'
    );
}

export const supabase = supabaseInstance;
