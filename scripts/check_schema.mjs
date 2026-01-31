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
const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'beneficiaries' ORDER BY ordinal_position
`);
console.log('Columns:', rows.map(x => x.column_name).join(', '));
await client.end();
