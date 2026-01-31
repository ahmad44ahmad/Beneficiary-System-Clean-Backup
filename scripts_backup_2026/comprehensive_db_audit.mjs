/**
 * Comprehensive Database Audit Script
 * Analyzes app code vs database schema to identify mismatches
 */
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

// Tables expected by the app (from code analysis)
const EXPECTED_TABLES = [
    // supaService.ts
    'beneficiaries',
    'daily_meals',
    'dietary_plans',
    'om_maintenance_requests',
    'om_assets',
    'om_asset_categories',
    'om_preventive_schedules',
    'daily_care_logs',
    'fall_risk_assessments',
    'social_research',
    'medical_profiles',
    'medical_records',
    'rehab_plans',

    // empowermentService.ts
    'rehab_goals',
    'goal_progress_logs',
    'goal_templates',
    'beneficiary_preferences',

    // ipcService.ts
    'locations',
    'ipc_checklist_templates',
    'ipc_inspections',
    'ipc_incidents',
    'immunizations',

    // wellbeingService.ts - Views
    'v_wellbeing_index',
    'v_wellbeing_stats',
    'v_early_warning_report',

    // GRC module (from db_status.json)
    'grc_compliance',
    'grc_risks',
    'grc_ncrs',
    'grc_standards',
    'grc_compliance_requirements',
    'grc_risk_categories',
    'grc_bcp_scenarios',
    'grc_safety_incidents',

    // Catering module
    'catering_items',
    'catering_categories',
    'catering_units',
    'catering_daily_inventory',
    'catering_daily_reports',
    'catering_violations',
    'catering_raw_materials',
    'meals',

    // Medical module
    'medication_schedules',
    'medication_administrations',
    'medications',
    'vital_signs',
    'medical_alerts',

    // Daily follow-up
    'shift_handover_notes',

    // Other expected
    'staff',
    'employees',
    'alerts',
    'audit_logs',
    'emergency_alerts',
    'evacuate_list' // view
];

async function main() {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL\n');

    const audit = {
        timestamp: new Date().toISOString(),
        summary: {},
        tables: {},
        views: {},
        missing: [],
        found: [],
        extras: [],
        rlsPolicies: {},
        foreignKeys: {},
        indexes: {}
    };

    // 1. Get all existing tables
    console.log('📊 Fetching existing tables...');
    const tablesResult = await client.query(`
    SELECT table_name, table_type
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

    const existingTables = new Set(tablesResult.rows.map(r => r.table_name));
    const tableTypes = {};
    tablesResult.rows.forEach(r => tableTypes[r.table_name] = r.table_type);

    // 2. Check expected vs existing
    console.log('🔍 Checking expected tables...');
    for (const table of EXPECTED_TABLES) {
        if (existingTables.has(table)) {
            audit.found.push(table);
        } else {
            audit.missing.push(table);
        }
    }

    // Find unexpected tables
    for (const table of existingTables) {
        if (!EXPECTED_TABLES.includes(table)) {
            audit.extras.push(table);
        }
    }

    // 3. Get table details for important tables
    console.log('📋 Analyzing table schemas...');
    const keyTables = ['beneficiaries', 'daily_care_logs', 'grc_risks', 'medication_schedules', 'rehab_goals'];

    for (const table of keyTables) {
        if (existingTables.has(table)) {
            const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = $1
        ORDER BY ordinal_position
      `, [table]);

            audit.tables[table] = {
                exists: true,
                type: tableTypes[table],
                columns: columnsResult.rows.map(c => ({
                    name: c.column_name,
                    type: c.data_type,
                    nullable: c.is_nullable === 'YES',
                    default: c.column_default
                }))
            };

            // Get row count
            try {
                const countResult = await client.query(`SELECT COUNT(*) as count FROM public."${table}"`);
                audit.tables[table].rowCount = parseInt(countResult.rows[0].count);
            } catch (e) {
                audit.tables[table].rowCount = 'error';
            }
        } else {
            audit.tables[table] = { exists: false };
        }
    }

    // 4. Check RLS policies
    console.log('🔐 Checking RLS policies...');
    const rlsResult = await client.query(`
    SELECT tablename, policyname, permissive, roles, cmd, qual
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename
  `);

    rlsResult.rows.forEach(policy => {
        if (!audit.rlsPolicies[policy.tablename]) {
            audit.rlsPolicies[policy.tablename] = [];
        }
        audit.rlsPolicies[policy.tablename].push({
            name: policy.policyname,
            permissive: policy.permissive,
            roles: policy.roles,
            command: policy.cmd
        });
    });

    // 5. Check views
    console.log('👁️ Checking views...');
    const viewsResult = await client.query(`
    SELECT table_name 
    FROM information_schema.views 
    WHERE table_schema = 'public'
    ORDER BY table_name
  `);

    audit.views = viewsResult.rows.map(r => r.table_name);

    // 6. Summary
    audit.summary = {
        totalTablesInDb: tablesResult.rows.length,
        expectedTables: EXPECTED_TABLES.length,
        foundTables: audit.found.length,
        missingTables: audit.missing.length,
        extraTables: audit.extras.length,
        tablesWithRls: Object.keys(audit.rlsPolicies).length,
        viewsCount: audit.views.length
    };

    await client.end();

    // Write results
    fs.writeFileSync('database_audit.json', JSON.stringify(audit, null, 2));
    console.log('\n✅ Audit complete! Results saved to database_audit.json');

    // Print summary
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('                    AUDIT SUMMARY                       ');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`Total tables in DB:     ${audit.summary.totalTablesInDb}`);
    console.log(`Expected by app:        ${audit.summary.expectedTables}`);
    console.log(`Found (matching):       ${audit.summary.foundTables}`);
    console.log(`Missing (need create):  ${audit.summary.missingTables}`);
    console.log(`Extra (in DB only):     ${audit.summary.extraTables}`);
    console.log(`Tables with RLS:        ${audit.summary.tablesWithRls}`);
    console.log(`Views:                  ${audit.summary.viewsCount}`);
    console.log('═══════════════════════════════════════════════════════');

    if (audit.missing.length > 0) {
        console.log('\n⚠️ MISSING TABLES (App expects but DB lacks):');
        audit.missing.forEach(t => console.log(`   - ${t}`));
    }

    console.log('\n');
}

main().catch(console.error);
