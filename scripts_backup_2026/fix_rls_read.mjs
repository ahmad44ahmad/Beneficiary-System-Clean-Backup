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

async function fixRLSForReading() {
    await client.connect();

    console.log('Adding permissive SELECT policies for anon role...\n');

    const tables = [
        'beneficiaries', 'medication_schedules', 'vital_signs',
        'locations', 'employees', 'shift_handover_notes',
        'beneficiary_preferences', 'rehab_goals', 'om_assets',
        'om_asset_categories', 'om_maintenance_requests',
        'ipc_inspections', 'grc_standards', 'grc_risks', 'grc_compliance',
        'daily_care_logs', 'social_research', 'rehab_plans'
    ];

    for (const t of tables) {
        try {
            // Drop existing policy if it exists
            await client.query(`
        DROP POLICY IF EXISTS anon_read_all ON ${t}
      `);

            // Create permissive SELECT policy for anon
            await client.query(`
        CREATE POLICY anon_read_all ON ${t}
        FOR SELECT
        TO anon, authenticated
        USING (true)
      `);

            console.log(`✓ ${t}: Added read policy for anon`);
        } catch (e) {
            console.log(`✗ ${t}: ${e.message.split('\n')[0]}`);
        }
    }

    console.log('\nDone! RLS policies updated.');

    await client.end();
}

fixRLSForReading().catch(console.error);
