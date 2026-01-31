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

async function checkConstraints() {
    await client.connect();

    // Get all constraints for rehab_goals
    const { rows } = await client.query(`
    SELECT conname, pg_get_constraintdef(oid) as definition 
    FROM pg_constraint 
    WHERE conrelid = 'rehab_goals'::regclass
  `);

    console.log('Constraints on rehab_goals:');
    rows.forEach(r => console.log(`  ${r.conname}: ${r.definition}`));

    await client.end();
}

checkConstraints().catch(console.error);
