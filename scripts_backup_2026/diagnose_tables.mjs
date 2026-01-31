
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('🔍 Diagnosing tables...');

    // Method 1: information_schema
    const { data: tables, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');

    if (error) {
        console.error('❌ Error listing tables:', error);
    } else {
        console.log('📂 Tables found:', tables.map(t => t.table_name).join(', '));
    }

    // Check specific tables
    const tablesToCheck = ['grc_compliance_requirements'];
    for (const table of tablesToCheck) {
        const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        console.log(`Table '${table}' count:`, error ? error.message : count);
    }
}

diagnose();
