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
const { rows } = await client.query(`SELECT DISTINCT gender FROM beneficiaries WHERE gender IS NOT NULL LIMIT 10`);
console.log('Gender values in DB:', rows.map(x => x.gender));
await client.end();
