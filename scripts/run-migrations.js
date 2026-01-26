const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Get DATABASE_URL from .env or construct from VITE vars
let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    // Try to construct from Supabase URL
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
        // Extract project ref from URL
        const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
        if (match) {
            const projectRef = match[1];
            // Use transaction pooler for migrations
            connectionString = `postgres://postgres.${projectRef}:${process.env.SUPABASE_DB_PASSWORD || 'YOUR_PASSWORD'}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;
        }
    }
}

console.log('🔧 Basira Database Migration Tool');
console.log('==================================');

if (!connectionString) {
    console.error('❌ No DATABASE_URL found. Please set it in .env');
    console.log('Format: postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres');
    process.exit(1);
}

const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function runMigration(filePath, name) {
    try {
        const sql = fs.readFileSync(filePath, 'utf8');
        console.log(`\n📄 Running: ${name}`);
        await client.query(sql);
        console.log(`✅ ${name} - Complete`);
        return true;
    } catch (err) {
        if (err.message.includes('already exists')) {
            console.log(`⏭️  ${name} - Skipped (already exists)`);
            return true;
        }
        console.error(`❌ ${name} - Failed:`, err.message);
        return false;
    }
}

async function main() {
    try {
        await client.connect();
        console.log('✅ Connected to Database');

        const migrationsDir = path.join(__dirname, '../supabase/migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        console.log(`\n📦 Found ${files.length} migration files`);

        for (const file of files) {
            await runMigration(path.join(migrationsDir, file), file);
        }

        // Verify data
        const { rows: beneficiaries } = await client.query('SELECT COUNT(*) FROM beneficiaries');
        const { rows: staff } = await client.query('SELECT COUNT(*) FROM staff');

        let risksCount = 0;
        try {
            const { rows: risks } = await client.query('SELECT COUNT(*) FROM grc_risks');
            risksCount = parseInt(risks[0].count);
        } catch (e) {
            console.log('⚠️  GRC tables not found');
        }

        console.log('\n📊 Data Summary:');
        console.log(`   Beneficiaries: ${beneficiaries[0].count}`);
        console.log(`   Staff: ${staff[0].count}`);
        console.log(`   GRC Risks: ${risksCount}`);

        console.log('\n✨ Migration Complete!');

    } catch (err) {
        console.error('❌ Connection Failed:', err.message);
    } finally {
        await client.end();
    }
}

main();
