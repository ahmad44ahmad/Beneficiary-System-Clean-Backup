/**
 * Check daily_care_logs constraints
 */
import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function check() {
    await client.connect();

    // Check constraints
    const c = await client.query(`
    SELECT conname, pg_get_constraintdef(oid) as def
    FROM pg_constraint 
    WHERE conrelid = 'daily_care_logs'::regclass
  `);
    console.log('Constraints:');
    c.rows.forEach(r => console.log(`  ${r.conname}: ${r.def}`));

    await client.end();
}

check().catch(console.error);
