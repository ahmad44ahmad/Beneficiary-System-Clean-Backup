import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);
    const { data, error } = await supabase.from('beneficiaries').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed:', error.message);
        if (error.code === '42P01') {
            console.log('Table "beneficiaries" does not exist. Connection successful but schema missing.');
        }
    } else {
        console.log('Connection successful! Beneficiaries count:', data);
    }
}

testConnection();
