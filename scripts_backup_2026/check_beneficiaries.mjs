
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkBeneficiaries() {
    console.log('Checking beneficiaries table structure...');

    // Check columns
    const { data: columns, error: colError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'beneficiaries')
        .eq('table_schema', 'public');

    if (colError) {
        console.error('Error fetching columns:', colError);
        return;
    }

    if (columns && columns.length > 0) {
        console.log('Verified Columns:', columns.map(c => c.column_name).join(', '));

        // Try to fetch one row
        const { data: rows, error: rowError } = await supabase.from('beneficiaries').select('*').limit(1);
        if (rows && rows.length > 0) {
            console.log('First row ID:', rows[0].id);
        } else {
            console.log('Table is empty');
        }
    } else {
        console.log('No columns found for table beneficiaries');
    }
}

checkBeneficiaries();
