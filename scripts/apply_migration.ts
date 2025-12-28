
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Client } = pg;

const client = new Client({
    connectionString: process.env.VITE_SUPABASE_URL ?
        // Try to construct a postgres connection string if not explicitly provided
        // NOTE: This usually requires a different format often found only in server-side envs.
        // If the user only has the REST URL, this might fail.
        // Let's assume there is a DATABASE_URL because usually seed scripts need it, 
        // BUT seed_quality.ts uses supabase-js (REST), which works with just URL+KEY.
        // The user might NOT have the postgres connection string in .env
        process.env.DATABASE_URL : undefined
});

async function runMigration() {
    if (!process.env.DATABASE_URL) {
        console.error("❌ DATABASE_URL is missing in .env. Cannot run raw SQL migrations.");
        console.log("⚠️ Please execute '002_catering_quality.sql' manually in your Supabase SQL Editor.");
        process.exit(1);
    }

    try {
        await client.connect();

        const sqlPath = path.join(__dirname, '../002_catering_quality.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Running migration: 002_catering_quality.sql');
        await client.query(sql);
        console.log('✅ Migration applied successfully!');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigration();
