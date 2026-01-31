/**
 * Final Verification Script - Comprehensive database check
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

async function verify() {
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('          FINAL DATABASE VERIFICATION REPORT                    ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // 1. Check if all expected tables exist
    console.log('📋 TABLE EXISTENCE CHECK\n');
    const criticalTables = [
        'beneficiaries', 'daily_care_logs', 'medication_schedules', 'medication_administrations',
        'rehab_goals', 'goal_progress_logs', 'beneficiary_preferences',
        'om_assets', 'om_maintenance_requests', 'om_preventive_schedules',
        'grc_risks', 'grc_compliance', 'grc_ncrs', 'grc_standards',
        'ipc_inspections', 'ipc_incidents', 'locations', 'immunizations',
        'social_research', 'rehab_plans', 'medical_profiles',
        'daily_meals', 'dietary_plans', 'shift_handover_notes'
    ];

    const { rows: existingTables } = await client.query(`
    SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
  `);
    const tableSet = new Set(existingTables.map(t => t.table_name));

    let missingCount = 0;
    for (const table of criticalTables) {
        const exists = tableSet.has(table);
        console.log(`   ${exists ? '✅' : '❌'} ${table}`);
        if (!exists) missingCount++;
    }
    console.log(`\n   Result: ${criticalTables.length - missingCount}/${criticalTables.length} tables exist`);

    // 2. Check row counts
    console.log('\n📊 DATA COUNTS\n');
    const countTables = [
        'beneficiaries', 'daily_care_logs', 'medication_schedules', 'rehab_goals',
        'grc_risks', 'om_assets', 'om_preventive_schedules', 'ipc_inspections'
    ];

    for (const table of countTables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as count FROM public."${table}"`);
            console.log(`   ${table}: ${rows[0].count} records`);
        } catch (e) {
            console.log(`   ${table}: ERROR - ${e.message.substring(0, 40)}`);
        }
    }

    // 3. Check views
    console.log('\n👁️ VIEWS CHECK\n');
    const expectedViews = [
        'v_wellbeing_index', 'v_wellbeing_stats', 'v_early_warning_report',
        'evacuation_list', 'v_daily_health_summary'
    ];

    const { rows: views } = await client.query(`
    SELECT table_name FROM information_schema.views WHERE table_schema = 'public'
  `);
    const viewSet = new Set(views.map(v => v.table_name));

    for (const view of expectedViews) {
        const exists = viewSet.has(view);
        console.log(`   ${exists ? '✅' : '❌'} ${view}`);
    }

    // 4. Check RLS status
    console.log('\n🔐 RLS STATUS\n');
    const { rows: rlsTables } = await client.query(`
    SELECT tablename, COUNT(*) as policies
    FROM pg_policies
    WHERE schemaname = 'public'
    GROUP BY tablename
    ORDER BY policies DESC
    LIMIT 10
  `);

    console.log('   Top tables by policy count:');
    rlsTables.forEach(t => console.log(`   - ${t.tablename}: ${t.policies} policies`));

    // 5. Connection test summary
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('                      SUMMARY                                    ');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`   ✅ Database connected as: antigravity_admin`);
    console.log(`   ✅ Total tables in public schema: ${tableSet.size}`);
    console.log(`   ✅ Critical tables found: ${criticalTables.length - missingCount}/${criticalTables.length}`);
    console.log(`   ✅ Views available: ${viewSet.size}`);
    console.log(`   ✅ Tables with RLS: ${rlsTables.length}+`);

    if (missingCount === 0) {
        console.log('\n   🎉 ALL CRITICAL TABLES EXIST - DATABASE READY!');
    } else {
        console.log(`\n   ⚠️ ${missingCount} tables still missing`);
    }

    console.log('═══════════════════════════════════════════════════════════════\n');

    await client.end();
}

verify().catch(console.error);
