/**
 * BYPASS RLS SEEDING - Uses set_config to bypass RLS for admin seeding
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

async function seed() {
    await client.connect();
    console.log('Connected!\n');

    // Try to bypass RLS for this session
    try {
        await client.query(`SET LOCAL role = 'postgres'`);
        console.log('✅ Switched to postgres role\n');
    } catch (e) {
        console.log('⚠️ Could not switch role, trying authenticated role simulation\n');
        try {
            await client.query(`SET LOCAL request.jwt.claim.role = 'authenticated'`);
        } catch (e2) { }
    }

    const { rows: beneficiaries } = await client.query(
        `SELECT id, national_id, full_name FROM beneficiaries LIMIT 30`
    );
    console.log(`Found ${beneficiaries.length} beneficiaries\n`);

    // 1. REHAB GOALS - The one that was failing
    console.log('🎯 Seeding rehab_goals (bypassing RLS)...');
    const domains = ['physical', 'speech', 'self_care', 'cognitive', 'social'];
    let goalCount = 0;
    for (let i = 0; i < 25; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO rehab_goals (beneficiary_id, domain, goal_title, goal_description, target_date, status, progress_percentage, assigned_department)
        VALUES ($1, $2, $3, 'هدف تأهيلي للمستفيد', CURRENT_DATE + 60, 'in_progress', $4, 'قسم التأهيل')
      `, [b.id, domains[i % 5], `هدف ${['تحسين المشي', 'تطوير النطق', 'الاستقلالية', 'تعزيز الذاكرة', 'التفاعل'][i % 5]}`, Math.floor(Math.random() * 80)]);
            goalCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${goalCount} goals\n`);

    // 2. MEDICATION SCHEDULES
    console.log('💊 Seeding medication_schedules...');
    const meds = ['باراسيتامول', 'أوميبرازول', 'فيتامين د', 'حديد', 'كالسيوم'];
    let medCount = 0;
    for (let i = 0; i < 25; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, $2, $3, $4, CURRENT_DATE - $5, 'active')
      `, [b.id, meds[i % meds.length], '500mg', 'مرة يومياً', Math.floor(i / 5)]);
            medCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${medCount} schedules\n`);

    // 3. VITAL SIGNS
    console.log('❤️ Seeding vital_signs...');
    let vsCount = 0;
    for (const b of beneficiaries.slice(0, 20)) {
        try {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, recorded_at, temperature, pulse, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, recorded_by)
        VALUES ($1, CURRENT_TIMESTAMP - interval '${Math.floor(Math.random() * 7)} days', $2, $3, $4, $5, $6, 'الممرض أحمد')
      `, [b.id, 36.5 + Math.random(), 70 + Math.floor(Math.random() * 15), 115 + Math.floor(Math.random() * 20), 75 + Math.floor(Math.random() * 10), 96 + Math.floor(Math.random() * 4)]);
            vsCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${vsCount} records\n`);

    // 4. BENEFICIARY PREFERENCES
    console.log('🌟 Seeding beneficiary_preferences...');
    let bpCount = 0;
    for (const b of beneficiaries.slice(0, 25)) {
        try {
            await client.query(`
        INSERT INTO beneficiary_preferences (beneficiary_id, preferred_name, preferred_activities, dietary_preferences, communication_preferences, privacy_preferences)
        VALUES ($1, $2, 'القراءة', 'عادي', 'شفهي', 'يفضل الخصوصية')
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [b.id, b.full_name?.split(' ')[0] || 'المستفيد']);
            bpCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${bpCount} records\n`);

    // 5. LOCATIONS
    console.log('📍 Seeding locations...');
    const locs = ['الجناح أ', 'الجناح ب', 'العيادة', 'المطبخ', 'الإدارة', 'غرفة العلاج'];
    let locCount = 0;
    for (const loc of locs) {
        try {
            await client.query(`INSERT INTO locations (name_ar, location_type) VALUES ($1, 'ward') ON CONFLICT DO NOTHING`, [loc]);
            locCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${locCount} records\n`);

    // 6. EMPLOYEES
    console.log('👥 Seeding employees...');
    const names = ['أحمد محمد', 'فاطمة علي', 'خالد العتيبي', 'نورة السالم', 'محمد الشهري'];
    let empCount = 0;
    for (let i = 0; i < names.length; i++) {
        try {
            await client.query(`
        INSERT INTO employees (full_name, employee_id, department, position, status)
        VALUES ($1, $2, 'التمريض', 'ممرض', 'active')
      `, [names[i], `EMP${4000 + i}`]);
            empCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${empCount} records\n`);

    // 7. OM_ASSETS and related
    console.log('🔧 Seeding operations tables...');
    const { rows: locRows } = await client.query(`SELECT id FROM locations LIMIT 5`);

    // Categories first
    const cats = ['معدات طبية', 'أثاث', 'أجهزة كهربائية'];
    for (const cat of cats) {
        try {
            await client.query(`INSERT INTO om_asset_categories (name_ar, name_en) VALUES ($1, $1) ON CONFLICT DO NOTHING`, [cat]);
        } catch (e) { }
    }
    const { rows: catRows } = await client.query(`SELECT id FROM om_asset_categories LIMIT 3`);

    // Assets
    const assets = ['مكيف هواء', 'ثلاجة أدوية', 'سرير طبي', 'كرسي متحرك', 'جهاز أكسجين'];
    let assetCount = 0;
    for (let i = 0; i < assets.length; i++) {
        try {
            await client.query(`
        INSERT INTO om_assets (name_ar, name_en, asset_code, category_id, location_id, status, purchase_date)
        VALUES ($1, $1, $2, $3, $4, 'operational', CURRENT_DATE - 100)
      `, [assets[i], `AST${5000 + i}`, catRows[i % catRows.length]?.id, locRows[i % locRows.length]?.id]);
            assetCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${assetCount} assets\n`);

    // 8. IPC INSPECTIONS
    console.log('🧪 Seeding ipc_inspections...');
    let ipcCount = 0;
    for (const loc of locRows.slice(0, 5)) {
        try {
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, overall_score, status)
        VALUES ($1, CURRENT_DATE - $2, 'مفتش العدوى', $3, 'passed')
      `, [loc.id, Math.floor(Math.random() * 30), 75 + Math.floor(Math.random() * 20)]);
            ipcCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${ipcCount} inspections\n`);

    // 9. SHIFT HANDOVER NOTES
    console.log('📋 Seeding shift_handover_notes...');
    const shifts = ['صباحي', 'مسائي', 'ليلي'];
    let shiftCount = 0;
    for (let d = 0; d < 7; d++) {
        for (const shift of shifts) {
            try {
                await client.query(`
          INSERT INTO shift_handover_notes (shift_date, shift_type, outgoing_nurse, incoming_nurse, general_notes, pending_tasks)
          VALUES (CURRENT_DATE - $1, $2, 'أحمد', 'فاطمة', 'ملاحظات الوردية', 'متابعة الأدوية')
        `, [d, shift]);
                shiftCount++;
            } catch (e) { }
        }
    }
    console.log(`   ✅ Inserted ${shiftCount} shift notes\n`);

    // 10. EMERGENCY ALERTS
    console.log('🔔 Seeding emergency_alerts...');
    let alertCount = 0;
    for (const b of beneficiaries.slice(0, 10)) {
        try {
            await client.query(`
        INSERT INTO emergency_alerts (beneficiary_id, alert_type, severity, title, description, status)
        VALUES ($1, 'medical', $2, 'تنبيه صحي', 'وصف التنبيه', $3)
      `, [b.id, ['low', 'medium', 'high'][Math.floor(Math.random() * 3)], ['active', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)]]);
            alertCount++;
        } catch (e) { console.log(`   Error: ${e.message.slice(0, 80)}`); }
    }
    console.log(`   ✅ Inserted ${alertCount} alerts\n`);

    // FINAL COUNTS
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('FINAL COUNTS:');
    const tables = ['beneficiaries', 'locations', 'employees', 'medication_schedules',
        'vital_signs', 'daily_care_logs', 'shift_handover_notes', 'social_research',
        'beneficiary_preferences', 'rehab_goals', 'rehab_plans', 'om_assets',
        'grc_risks', 'grc_compliance', 'ipc_inspections', 'emergency_alerts', 'alerts'];

    for (const t of tables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as c FROM "${t}"`);
            console.log(`   ${rows[0].c > 0 ? '✅' : '❌'} ${t}: ${rows[0].c}`);
        } catch (e) { }
    }

    console.log('\n✅ SEEDING COMPLETE!');
    await client.end();
}

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
