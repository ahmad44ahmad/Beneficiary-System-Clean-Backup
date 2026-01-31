import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    host: "db.ruesovrbhcjphmfdcpsa.supabase.co",
    database: "postgres",
    user: "postgres",
    password: "aDgzkaH9Pq5QUdt4",
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

async function runMigration(client, filePath, name) {
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

async function run() {
    const client = new Client(config);
    try {
        console.log("🔧 Basira Database Migration Tool");
        console.log("==================================");
        console.log("🔌 Connecting to Postgres...");
        await client.connect();
        console.log("✅ Connected to Postgres");

        const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
        const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

        console.log(`\n📦 Found ${files.length} migration files`);

        for (const file of files) {
            await runMigration(client, path.join(migrationsDir, file), file);
        }

        // Verify data
        console.log('\n📊 Verifying Data...');

        try {
            const { rows: beneficiaries } = await client.query('SELECT COUNT(*) as count FROM beneficiaries');
            console.log(`   ✓ Beneficiaries: ${beneficiaries[0].count}`);
        } catch (e) {
            console.log(`   ✗ Beneficiaries table not found`);
        }

        try {
            const { rows: staff } = await client.query('SELECT COUNT(*) as count FROM staff');
            console.log(`   ✓ Staff: ${staff[0].count}`);
        } catch (e) {
            console.log(`   ✗ Staff table not found`);
        }

        try {
            const { rows: risks } = await client.query('SELECT COUNT(*) as count FROM grc_risks');
            console.log(`   ✓ GRC Risks: ${risks[0].count}`);
        } catch (e) {
            console.log(`   ✗ GRC Risks table not found`);
        }

        try {
            const { rows: ncrs } = await client.query('SELECT COUNT(*) as count FROM grc_ncrs');
            console.log(`   ✓ GRC NCRs: ${ncrs[0].count}`);
        } catch (e) {
            console.log(`   ✗ GRC NCRs table not found`);
        }

        try {
            const { rows: compliance } = await client.query('SELECT COUNT(*) as count FROM grc_compliance');
            console.log(`   ✓ GRC Compliance: ${compliance[0].count}`);
        } catch (e) {
            console.log(`   ✗ GRC Compliance table not found`);
        }

        console.log('\n✨ Migration Complete!');

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
