const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: DATABASE_URL is missing in .env');
    console.log('Please add your Supabase Connection String to .env as DATABASE_URL=...');
    console.log('Format: postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function setup() {
    try {
        await client.connect();
        console.log('\x1b[32m%s\x1b[0m', '✅ Connected to Database');

        const sqlPath = path.join(__dirname, '../supabase/migrations/03_demo_full_schema_and_data.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('🚀 Executing Migration...');
        await client.query(sql);

        console.log('\x1b[32m%s\x1b[0m', '✅ Migration Complete! Demo Environment is Ready.');
        console.log('✨ 50 Beneficiaries Created');
        console.log('✨ 15 Staff Members Created');
        console.log('✨ Scenarios & Alerts Active');

    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Migration Failed:', err.message);
    } finally {
        await client.end();
    }
}

setup();
