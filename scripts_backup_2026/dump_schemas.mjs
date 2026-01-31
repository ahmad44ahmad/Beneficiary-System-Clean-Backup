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

async function dumpSchemas() {
    await client.connect();

    const tables = [
        'employees', 'locations', 'medication_schedules', 'vital_signs',
        'beneficiary_preferences', 'rehab_goals', 'om_assets', 'om_asset_categories',
        'om_maintenance_requests', 'ipc_inspections', 'shift_handover_notes',
        'emergency_alerts', 'grc_standards', 'beneficiaries'
    ];

    let output = '';

    for (const t of tables) {
        const { rows } = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = $1 
      ORDER BY ordinal_position
    `, [t]);

        output += `\n=== ${t} ===\n`;
        rows.forEach(r => {
            output += `  ${r.column_name} (${r.data_type})\n`;
        });
    }

    fs.writeFileSync('schemas.txt', output);
    console.log('Schemas saved to schemas.txt');
    console.log(output);

    await client.end();
}

dumpSchemas().catch(console.error);
