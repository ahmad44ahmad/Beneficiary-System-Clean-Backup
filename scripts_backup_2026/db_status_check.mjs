/**
 * Quick Database Check - Outputs full results to JSON
 */
import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function main() {
    await client.connect();

    const result = {};

    // Connection info
    const info = await client.query(`SELECT current_user, current_database()`);
    result.connection = {
        user: info.rows[0].current_user,
        database: info.rows[0].current_database,
        status: 'CONNECTED'
    };

    // All tables in public schema
    const tables = await client.query(`
    SELECT table_name, table_type
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);
    result.publicTables = tables.rows;

    // Auth tables
    const authTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    ORDER BY table_name
  `);
    result.authTables = authTables.rows;

    // Storage tables
    const storageTables = await client.query(`
    SELECT table_name
    FROM information_schema.tables 
    WHERE table_schema = 'storage' 
    ORDER BY table_name
  `);
    result.storageTables = storageTables.rows;

    // Row counts for key tables
    const keyCounts = {};
    const keyTableNames = ['beneficiaries', 'users', 'daily_follow_ups', 'health_records', 'incidents'];

    for (const tbl of keyTableNames) {
        try {
            const countRes = await client.query(`SELECT COUNT(*) as c FROM public."${tbl}"`);
            keyCounts[tbl] = parseInt(countRes.rows[0].c);
        } catch (e) {
            keyCounts[tbl] = 'not found';
        }
    }
    result.rowCounts = keyCounts;

    await client.end();

    // Write to file
    fs.writeFileSync('db_status.json', JSON.stringify(result, null, 2));
    console.log('Database status written to db_status.json');
}

main().catch(console.error);
