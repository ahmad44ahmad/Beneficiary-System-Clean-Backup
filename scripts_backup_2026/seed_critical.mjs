/**
 * SIMPLIFIED DATA SEEDING - Critical Tables Only
 * Seeds the most important tables with basic data
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
    console.log('Connected! Starting seeding...\n');

    const { rows: beneficiaries } = await client.query(
        `SELECT id, national_id, full_name FROM beneficiaries LIMIT 30`
    );
    console.log(`Found ${beneficiaries.length} beneficiaries\n`);

    // 1. LOCATIONS
    console.log('📍 Locations...');
    const locs = ['الجناح أ', 'الجناح ب', 'العيادة', 'المطبخ', 'الإدارة'];
    for (const loc of locs) {
        try {
            await client.query(`INSERT INTO locations (name_ar, name_en, location_type) VALUES ($1, $1, 'ward') ON CONFLICT DO NOTHING`, [loc]);
        } catch (e) { }
    }
    console.log('   Done');

    // 2. EMPLOYEES  
    console.log('👥 Employees...');
    const names = ['أحمد محمد', 'فاطمة علي', 'خالد العتيبي', 'نورة السالم', 'محمد الشهري'];
    for (let i = 0; i < names.length; i++) {
        try {
            await client.query(`
        INSERT INTO employees (full_name, employee_id, department, position, status)
        VALUES ($1, $2, 'التمريض', 'ممرض', 'active') ON CONFLICT DO NOTHING
      `, [names[i], `EMP${1000 + i}`]);
        } catch (e) { }
    }
    console.log('   Done');

    // 3. MEDICAL PROFILES
    console.log('💊 Medical Profiles...');
    for (const b of beneficiaries.slice(0, 20)) {
        try {
            await client.query(`
        INSERT INTO medical_profiles (beneficiary_id, blood_type, allergies, chronic_conditions, disability_type, mobility_status)
        VALUES ($1, 'A+', 'لا يوجد', 'لا يوجد', 'حركية', 'مستقل')
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [b.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 4. MEDICATION SCHEDULES
    console.log('💊 Medication Schedules...');
    const meds = ['باراسيتامول', 'أوميبرازول', 'فيتامين د', 'حديد'];
    for (let i = 0; i < 20; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, $2, '500mg', 'مرة يومياً', CURRENT_DATE, 'active')
      `, [b.id, meds[i % meds.length]]);
        } catch (e) { }
    }
    console.log('   Done');

    // 5. VITAL SIGNS
    console.log('❤️ Vital Signs...');
    for (const b of beneficiaries.slice(0, 15)) {
        try {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, recorded_at, temperature, pulse, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, recorded_by)
        VALUES ($1, CURRENT_TIMESTAMP, 36.8, 75, 120, 80, 98, 'الممرض أحمد')
      `, [b.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 6. SOCIAL RESEARCH
    console.log('🏠 Social Research...');
    for (const b of beneficiaries.slice(0, 15)) {
        try {
            await client.query(`
        INSERT INTO social_research (national_id, beneficiary_id, research_date, researcher_name, family_status, economic_status, housing_status, recommendations)
        VALUES ($1, $2, CURRENT_DATE, 'الأخصائية نورة', 'مستقرة', 'جيد', 'ملائم', 'متابعة دورية')
      `, [b.national_id, b.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 7. BENEFICIARY PREFERENCES (Dignity)
    console.log('🌟 Beneficiary Preferences (Dignity)...');
    for (const b of beneficiaries.slice(0, 20)) {
        try {
            await client.query(`
        INSERT INTO beneficiary_preferences (beneficiary_id, preferred_name, preferred_activities, dietary_preferences, communication_preferences, privacy_preferences)
        VALUES ($1, $2, 'القراءة والتلفزيون', 'عادي', 'شفهي', 'يفضل الخصوصية')
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [b.id, b.full_name?.split(' ')[0] || 'المستفيد']);
        } catch (e) { }
    }
    console.log('   Done');

    // 8. REHAB GOALS
    console.log('🎯 Rehab Goals...');
    const domains = ['physical', 'speech', 'self_care', 'cognitive', 'social'];
    for (let i = 0; i < 20; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO rehab_goals (beneficiary_id, domain, goal_title, goal_description, target_date, status, progress_percentage, assigned_department)
        VALUES ($1, $2, 'تحسين المشي', 'هدف تأهيلي', CURRENT_DATE + 60, 'in_progress', $3, 'قسم التأهيل')
      `, [b.id, domains[i % domains.length], Math.floor(Math.random() * 80)]);
        } catch (e) { }
    }
    console.log('   Done');

    // 9. REHAB PLANS
    console.log('📋 Rehab Plans...');
    for (const b of beneficiaries.slice(0, 12)) {
        try {
            await client.query(`
        INSERT INTO rehab_plans (national_id, beneficiary_id, plan_name, description, start_date, target_end_date, status, assigned_therapist)
        VALUES ($1, $2, 'خطة تأهيل شاملة', 'خطة علاجية متكاملة', CURRENT_DATE - 30, CURRENT_DATE + 60, 'active', 'أخصائي العلاج الطبيعي')
      `, [b.national_id, b.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 10. OM ASSET CATEGORIES
    console.log('🔧 Asset Categories...');
    const cats = ['معدات طبية', 'أثاث', 'أجهزة كهربائية', 'معدات سلامة'];
    for (const cat of cats) {
        try {
            await client.query(`INSERT INTO om_asset_categories (name_ar, name_en, description) VALUES ($1, $1, 'فئة') ON CONFLICT DO NOTHING`, [cat]);
        } catch (e) { }
    }
    console.log('   Done');

    // 11. OM ASSETS
    console.log('🔧 Assets...');
    const { rows: locRows } = await client.query(`SELECT id FROM locations LIMIT 5`);
    const { rows: catRows } = await client.query(`SELECT id FROM om_asset_categories LIMIT 4`);
    const assets = ['مكيف هواء', 'ثلاجة أدوية', 'سرير طبي', 'كرسي متحرك', 'جهاز أكسجين', 'غسالة صناعية'];
    for (let i = 0; i < assets.length; i++) {
        try {
            await client.query(`
        INSERT INTO om_assets (name_ar, name_en, asset_code, category_id, location_id, status, purchase_date)
        VALUES ($1, $1, $2, $3, $4, 'operational', CURRENT_DATE - 100)
      `, [assets[i], `AST${1000 + i}`, catRows[i % catRows.length]?.id, locRows[i % locRows.length]?.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 12. OM MAINTENANCE REQUESTS
    console.log('🔧 Maintenance Requests...');
    const { rows: assetRows } = await client.query(`SELECT id FROM om_assets LIMIT 6`);
    for (const asset of assetRows) {
        try {
            await client.query(`
        INSERT INTO om_maintenance_requests (asset_id, request_type, priority, description, requested_by, status, requested_at)
        VALUES ($1, 'صيانة دورية', 'medium', 'طلب صيانة', 'فني الصيانة', 'pending', CURRENT_TIMESTAMP)
      `, [asset.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 13. GRC STANDARDS
    console.log('🏛️ GRC Standards...');
    const stds = [{ code: 'HRSD-01', name: 'معايير الرعاية' }, { code: 'ISO-9001', name: 'نظام الجودة' }];
    for (const std of stds) {
        try {
            await client.query(`
        INSERT INTO grc_standards (code, name_ar, name_en, description, category, effective_date, status)
        VALUES ($1, $2, $2, 'معيار الجودة', 'operational', CURRENT_DATE - 365, 'active')
        ON CONFLICT DO NOTHING
      `, [std.code, std.name]);
        } catch (e) { }
    }
    console.log('   Done');

    // 14. GRC COMPLIANCE REQUIREMENTS
    console.log('🏛️ Compliance Requirements...');
    const { rows: stdRows } = await client.query(`SELECT id FROM grc_standards LIMIT 2`);
    for (const std of stdRows) {
        for (let i = 0; i < 5; i++) {
            try {
                await client.query(`
          INSERT INTO grc_compliance_requirements (standard_id, requirement_code, title_ar, description, compliance_status, due_date, responsible_person)
          VALUES ($1, $2, $3, 'متطلب الامتثال', 'compliant', CURRENT_DATE + 30, 'مسؤول الجودة')
        `, [std.id, `REQ-${std.id}-${i}`, `متطلب ${i + 1}`]);
            } catch (e) { }
        }
    }
    console.log('   Done');

    // 15. IPC INSPECTIONS
    console.log('🧪 IPC Inspections...');
    for (const loc of locRows) {
        try {
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, overall_score, hand_hygiene_score, surface_cleaning_score, waste_management_score, status)
        VALUES ($1, CURRENT_DATE - 7, 'مفتش العدوى', 85, 90, 85, 80, 'passed')
      `, [loc.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 16. EMERGENCY ALERTS
    console.log('🔔 Emergency Alerts...');
    for (const b of beneficiaries.slice(0, 8)) {
        try {
            await client.query(`
        INSERT INTO emergency_alerts (beneficiary_id, alert_type, severity, title, description, status, created_at)
        VALUES ($1, 'medical', 'medium', 'تنبيه صحي', 'وصف التنبيه', 'active', CURRENT_TIMESTAMP - interval '3 days')
      `, [b.id]);
        } catch (e) { }
    }
    console.log('   Done');

    // 17. SHIFT HANDOVER NOTES
    console.log('📋 Shift Handover Notes...');
    const shifts = ['صباحي', 'مسائي', 'ليلي'];
    for (let d = 0; d < 7; d++) {
        for (const shift of shifts) {
            try {
                await client.query(`
          INSERT INTO shift_handover_notes (shift_date, shift_type, outgoing_nurse, incoming_nurse, general_notes, important_alerts, pending_tasks)
          VALUES (CURRENT_DATE - $1, $2, 'أحمد محمد', 'فاطمة علي', 'ملاحظات الوردية', 'لا توجد تنبيهات', 'متابعة الأدوية')
        `, [d, shift]);
            } catch (e) { }
        }
    }
    console.log('   Done');

    // FINAL COUNTS
    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('FINAL COUNTS:');
    const tables = ['locations', 'employees', 'medical_profiles', 'medication_schedules', 'vital_signs',
        'social_research', 'beneficiary_preferences', 'rehab_goals', 'rehab_plans',
        'om_assets', 'om_maintenance_requests', 'grc_standards', 'grc_compliance_requirements',
        'ipc_inspections', 'emergency_alerts', 'shift_handover_notes'];

    for (const t of tables) {
        const { rows } = await client.query(`SELECT COUNT(*) as c FROM "${t}"`);
        console.log(`   ${t}: ${rows[0].c}`);
    }

    console.log('\n✅ SEEDING COMPLETE!');
    await client.end();
}

seed().catch(e => { console.error('Error:', e.message); process.exit(1); });
