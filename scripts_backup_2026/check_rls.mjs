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

async function checkRLS() {
    await client.connect();

    console.log('Checking RLS policies on key tables...\n');

    const tables = [
        'beneficiaries', 'medication_schedules', 'vital_signs',
        'locations', 'employees', 'shift_handover_notes'
    ];

    for (const t of tables) {
        const { rows } = await client.query(`
      SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
      FROM pg_policies 
      WHERE tablename = $1
    `, [t]);

        console.log(`=== ${t} ===`);
        if (rows.length === 0) {
            console.log('  No RLS policies');
        } else {
            rows.forEach(r => {
                console.log(`  ${r.policyname} (${r.cmd}) - ${r.permissive}`);
            });
        }

        // Check if RLS is enabled
        const { rows: rlsCheck } = await client.query(`
      SELECT relrowsecurity, relforcerowsecurity 
      FROM pg_class WHERE relname = $1
    `, [t]);

        if (rlsCheck.length > 0) {
            console.log(`  RLS enabled: ${rlsCheck[0].relrowsecurity}, Force: ${rlsCheck[0].relforcerowsecurity}`);
        }
        console.log('');
    }

    await client.end();
}

checkRLS().catch(console.error);
