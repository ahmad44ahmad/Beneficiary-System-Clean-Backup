import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using credentials found in execute_schema.js
const config = {
    host: "db.ruesovrbhcjphmfdcpsa.supabase.co",
    database: "postgres",
    user: "postgres",
    password: "aDgzkaH9Pq5QUdt4",
    port: 5432,
    ssl: { rejectUnauthorized: false }
};

async function run() {
    const client = new Client(config);
    try {
        console.log("🔌 Connecting to Postgres...");
        await client.connect();
        console.log("✅ Connected to Postgres");

        const sqlPath = path.join(__dirname, '..', 'fix_all_views.sql');
        console.log(`📖 Reading SQL from: ${sqlPath}`);
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log("🚀 Executing fix_all_views.sql...");
        await client.query(sql);
        console.log("✅ Views fixed successfully.");

    } catch (err) {
        console.error("❌ Error executing schema:", err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
