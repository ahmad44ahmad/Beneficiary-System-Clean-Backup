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

await client.connect();
const { rows } = await client.query(`SELECT DISTINCT status FROM beneficiaries WHERE status IS NOT NULL LIMIT 10`);
console.log('Status values in DB:', rows.map(x => x.status));
await client.end();
