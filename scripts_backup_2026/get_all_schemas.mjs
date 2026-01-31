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

async function getAllSchemas() {
    await client.connect();

    const tables = [
        'employees', 'locations', 'medication_schedules', 'vital_signs',
        'beneficiary_preferences', 'rehab_goals', 'om_assets', 'om_asset_categories',
        'om_maintenance_requests', 'ipc_inspections', 'shift_handover_notes',
        'emergency_alerts', 'grc_standards'
    ];

    for (const t of tables) {
        const { rows } = await client.query(`
      SELECT column_name
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1 
      ORDER BY ordinal_position
    `, [t]);
        console.log(`\n=== ${t} ===`);
        rows.forEach(r => console.log(r.column_name));
    }

    await client.end();
}

getAllSchemas().catch(console.error);
