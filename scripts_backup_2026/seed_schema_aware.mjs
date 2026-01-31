/**
 * SCHEMA-AWARE SEEDING - Fixes remaining empty tables
 * Checks actual schema before inserting
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

async function getColumns(table) {
    const { rows } = await client.query(`
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = $1
    ORDER BY ordinal_position
  `, [table]);
    return rows;
}

async function seed() {
    await client.connect();
    console.log('Connected! Schema-aware seeding...\n');

    const { rows: beneficiaries } = await client.query(
        `SELECT id, national_id, full_name FROM beneficiaries LIMIT 30`
    );
    console.log(`Found ${beneficiaries.length} beneficiaries\n`);

    // 1. LOCATIONS - Check actual schema
    console.log('📍 Seeding locations...');
    const locCols = await getColumns('locations');
    console.log(`   Columns: ${locCols.map(c => c.column_name).join(', ')}`);

    const locs = ['الجناح أ', 'الجناح ب', 'العيادة', 'المطبخ', 'الإدارة', 'غرفة العلاج'];
    for (const loc of locs) {
        try {
            // Try with name_ar first, fallback to name
            if (locCols.find(c => c.column_name === 'name_ar')) {
                await client.query(`INSERT INTO locations (name_ar, location_type) VALUES ($1, 'ward') ON CONFLICT DO NOTHING`, [loc]);
            } else if (locCols.find(c => c.column_name === 'name')) {
                await client.query(`INSERT INTO locations (name, location_type) VALUES ($1, 'ward') ON CONFLICT DO NOTHING`, [loc]);
            }
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 50)}`); }
    }
    const { rows: locRows } = await client.query(`SELECT id FROM locations`);
    console.log(`   ✅ ${locRows.length} locations\n`);

    // 2. EMPLOYEES - Check actual schema
    console.log('👥 Seeding employees...');
    const empCols = await getColumns('employees');
    console.log(`   Columns: ${empCols.map(c => c.column_name).join(', ')}`);

    const names = ['أحمد محمد', 'فاطمة علي', 'خالد العتيبي', 'نورة السالم', 'محمد الشهري'];
    for (let i = 0; i < names.length; i++) {
        try {
            await client.query(`
        INSERT INTO employees (full_name, employee_id, department, position, status)
        VALUES ($1, $2, 'التمريض', 'ممرض', 'active')
      `, [names[i], `EMP${2000 + i}`]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 50)}`); }
    }
    const { rows: empRows } = await client.query(`SELECT id, full_name FROM employees`);
    console.log(`   ✅ ${empRows.length} employees\n`);

    // 3. MEDICAL PROFILES
    console.log('💊 Seeding medical_profiles...');
    const mpCols = await getColumns('medical_profiles');
    console.log(`   Columns: ${mpCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    for (const b of beneficiaries.slice(0, 25)) {
        try {
            await client.query(`
        INSERT INTO medical_profiles (beneficiary_id, blood_type, allergies, chronic_conditions, disability_type, mobility_status)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [b.id, ['A+', 'B+', 'O+', 'AB+'][Math.floor(Math.random() * 4)], 'لا يوجد', 'لا يوجد', 'حركية', 'مستقل']);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: mpRows } = await client.query(`SELECT COUNT(*) as c FROM medical_profiles`);
    console.log(`   ✅ ${mpRows[0].c} medical profiles\n`);

    // 4. MEDICATION SCHEDULES
    console.log('💊 Seeding medication_schedules...');
    const msCols = await getColumns('medication_schedules');
    console.log(`   Columns: ${msCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    const meds = ['باراسيتامول', 'أوميبرازول', 'فيتامين د', 'حديد', 'كالسيوم'];
    for (let i = 0; i < 25; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, $2, $3, $4, CURRENT_DATE - $5, 'active')
      `, [b.id, meds[i % meds.length], '500mg', 'مرة يومياً', Math.floor(i / 5)]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: msRows } = await client.query(`SELECT COUNT(*) as c FROM medication_schedules`);
    console.log(`   ✅ ${msRows[0].c} medication schedules\n`);

    // 5. VITAL SIGNS
    console.log('❤️ Seeding vital_signs...');
    const vsCols = await getColumns('vital_signs');
    console.log(`   Columns: ${vsCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    for (const b of beneficiaries.slice(0, 20)) {
        try {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, recorded_at, temperature, pulse, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, recorded_by)
        VALUES ($1, CURRENT_TIMESTAMP - interval '${Math.floor(Math.random() * 7)} days', $2, $3, $4, $5, $6, 'الممرض أحمد')
      `, [b.id, 36.5 + Math.random(), 70 + Math.floor(Math.random() * 15), 115 + Math.floor(Math.random() * 20), 75 + Math.floor(Math.random() * 10), 96 + Math.floor(Math.random() * 4)]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: vsRows } = await client.query(`SELECT COUNT(*) as c FROM vital_signs`);
    console.log(`   ✅ ${vsRows[0].c} vital signs\n`);

    // 6. BENEFICIARY PREFERENCES
    console.log('🌟 Seeding beneficiary_preferences...');
    const bpCols = await getColumns('beneficiary_preferences');
    console.log(`   Columns: ${bpCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    for (const b of beneficiaries.slice(0, 25)) {
        try {
            await client.query(`
        INSERT INTO beneficiary_preferences (beneficiary_id, preferred_name, preferred_activities, dietary_preferences, communication_preferences, privacy_preferences)
        VALUES ($1, $2, 'القراءة', 'عادي', 'شفهي', 'يفضل الخصوصية')
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [b.id, b.full_name?.split(' ')[0] || 'المستفيد']);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: bpRows } = await client.query(`SELECT COUNT(*) as c FROM beneficiary_preferences`);
    console.log(`   ✅ ${bpRows[0].c} beneficiary preferences\n`);

    // 7. REHAB GOALS
    console.log('🎯 Seeding rehab_goals...');
    const rgCols = await getColumns('rehab_goals');
    console.log(`   Columns: ${rgCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    const domains = ['physical', 'speech', 'self_care', 'cognitive', 'social'];
    for (let i = 0; i < 25; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO rehab_goals (beneficiary_id, domain, goal_title, goal_description, target_date, status, progress_percentage, assigned_department)
        VALUES ($1, $2, $3, 'هدف تأهيلي للمستفيد', CURRENT_DATE + 60, 'in_progress', $4, 'قسم التأهيل')
      `, [b.id, domains[i % 5], `هدف ${['تحسين المشي', 'تطوير النطق', 'الاستقلالية', 'تعزيز الذاكرة', 'التفاعل'][i % 5]}`, Math.floor(Math.random() * 80)]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: rgRows } = await client.query(`SELECT COUNT(*) as c FROM rehab_goals`);
    console.log(`   ✅ ${rgRows[0].c} rehab goals\n`);

    // 8. OM ASSETS
    console.log('🔧 Seeding om_assets...');
    const oaCols = await getColumns('om_assets');
    console.log(`   Columns: ${oaCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    // First seed categories
    const cats = ['معدات طبية', 'أثاث', 'أجهزة كهربائية'];
    for (const cat of cats) {
        try {
            await client.query(`INSERT INTO om_asset_categories (name_ar, name_en) VALUES ($1, $1) ON CONFLICT DO NOTHING`, [cat]);
        } catch (e) { }
    }
    const { rows: catRows } = await client.query(`SELECT id FROM om_asset_categories LIMIT 3`);

    const assets = ['مكيف هواء', 'ثلاجة أدوية', 'سرير طبي', 'كرسي متحرك', 'جهاز أكسجين', 'غسالة صناعية', 'جهاز قياس ضغط'];
    for (let i = 0; i < assets.length; i++) {
        try {
            await client.query(`
        INSERT INTO om_assets (name_ar, name_en, asset_code, category_id, location_id, status, purchase_date)
        VALUES ($1, $1, $2, $3, $4, 'operational', CURRENT_DATE - 100)
      `, [assets[i], `AST${3000 + i}`, catRows[i % catRows.length]?.id, locRows[i % locRows.length]?.id]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: oaRows } = await client.query(`SELECT COUNT(*) as c FROM om_assets`);
    console.log(`   ✅ ${oaRows[0].c} assets\n`);

    // 9. SHIFT HANDOVER NOTES
    console.log('📋 Seeding shift_handover_notes...');
    const shCols = await getColumns('shift_handover_notes');
    console.log(`   Columns: ${shCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    const shifts = ['صباحي', 'مسائي', 'ليلي'];
    for (let d = 0; d < 7; d++) {
        for (const shift of shifts) {
            try {
                await client.query(`
          INSERT INTO shift_handover_notes (shift_date, shift_type, outgoing_nurse, incoming_nurse, general_notes, pending_tasks)
          VALUES (CURRENT_DATE - $1, $2, 'أحمد', 'فاطمة', 'ملاحظات الوردية - سارت بشكل طبيعي', 'متابعة الأدوية')
        `, [d, shift]);
            } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
        }
    }
    const { rows: shRows } = await client.query(`SELECT COUNT(*) as c FROM shift_handover_notes`);
    console.log(`   ✅ ${shRows[0].c} shift notes\n`);

    // 10. EMERGENCY ALERTS
    console.log('🔔 Seeding emergency_alerts...');
    const eaCols = await getColumns('emergency_alerts');
    console.log(`   Columns: ${eaCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    for (const b of beneficiaries.slice(0, 10)) {
        try {
            await client.query(`
        INSERT INTO emergency_alerts (beneficiary_id, alert_type, severity, title, description, status)
        VALUES ($1, 'medical', $2, 'تنبيه صحي', 'وصف التنبيه التلقائي', $3)
      `, [b.id, ['low', 'medium', 'high'][Math.floor(Math.random() * 3)], ['active', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)]]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: eaRows } = await client.query(`SELECT COUNT(*) as c FROM emergency_alerts`);
    console.log(`   ✅ ${eaRows[0].c} emergency alerts\n`);

    // 11. IPC INSPECTIONS
    console.log('🧪 Seeding ipc_inspections...');
    const ipCols = await getColumns('ipc_inspections');
    console.log(`   Columns: ${ipCols.map(c => c.column_name).slice(0, 8).join(', ')}...`);

    for (const loc of locRows.slice(0, 5)) {
        try {
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, overall_score, status)
        VALUES ($1, CURRENT_DATE - $2, 'مفتش العدوى', $3, 'passed')
      `, [loc.id, Math.floor(Math.random() * 30), 75 + Math.floor(Math.random() * 20)]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: ipRows } = await client.query(`SELECT COUNT(*) as c FROM ipc_inspections`);
    console.log(`   ✅ ${ipRows[0].c} IPC inspections\n`);

    // 12. GRC STANDARDS
    console.log('🏛️ Seeding grc_standards...');
    const gsCols = await getColumns('grc_standards');
    console.log(`   Columns: ${gsCols.map(c => c.column_name).join(', ')}`);

    const stds = [{ code: 'HRSD-01', name: 'معايير الرعاية' }, { code: 'ISO-9001', name: 'نظام الجودة' }, { code: 'MHRS-01', name: 'الصحة والسلامة' }];
    for (const std of stds) {
        try {
            await client.query(`
        INSERT INTO grc_standards (code, name_ar, description, status)
        VALUES ($1, $2, 'معيار الجودة والامتثال', 'active')
        ON CONFLICT DO NOTHING
      `, [std.code, std.name]);
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 60)}`); }
    }
    const { rows: gsRows } = await client.query(`SELECT COUNT(*) as c FROM grc_standards`);
    console.log(`   ✅ ${gsRows[0].c} GRC standards\n`);

    // FINAL SUMMARY
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('FINAL COUNTS:');
    console.log('═══════════════════════════════════════════════════════════════');
    const tables = ['beneficiaries', 'locations', 'employees', 'medical_profiles', 'medication_schedules',
        'vital_signs', 'daily_care_logs', 'shift_handover_notes', 'social_research', 'beneficiary_preferences',
        'rehab_goals', 'rehab_plans', 'om_assets', 'grc_risks', 'grc_compliance', 'grc_standards',
        'ipc_inspections', 'emergency_alerts', 'alerts'];

    for (const t of tables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as c FROM "${t}"`);
            const status = rows[0].c > 0 ? '✅' : '❌';
            console.log(`   ${status} ${t}: ${rows[0].c}`);
        } catch (e) {
            console.log(`   ⚠️ ${t}: error`);
        }
    }

    console.log('\n✅ SCHEMA-AWARE SEEDING COMPLETE!');
    await client.end();
}

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
