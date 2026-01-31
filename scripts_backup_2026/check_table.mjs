
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tableName = process.argv[2];

if (!tableName) {
    console.error('Please provide a table name');
    process.exit(1);
}

async function checkTable() {
    const { error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);

    if (error) {
        if (error.code === '42P01') {
            console.log(`Table '${tableName}' does NOT exist.`);
        } else {
            console.error(`Error checking table '${tableName}':`, error.message);
        }
    } else {
        console.log(`Table '${tableName}' exists.`);
    }
}

checkTable();
