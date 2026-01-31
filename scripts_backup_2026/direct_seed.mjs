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

async function directSeed() {
    await client.connect();

    console.log('=== DIRECT DATABASE SEEDING ===\n');

    // 1. LOCATIONS
    console.log('1. Seeding locations...');
    try {
        await client.query(`
      INSERT INTO locations (name, name_en, section, building, floor) VALUES 
        ('الجناح أ', 'Wing A', 'ذكور', 'المبنى الرئيسي', 1),
        ('الجناح ب', 'Wing B', 'ذكور', 'المبنى الرئيسي', 1),
        ('العيادة', 'Clinic', 'خدمات', 'المبنى الرئيسي', 0),
        ('المطبخ', 'Kitchen', 'خدمات', 'المبنى الخدمي', 0),
        ('الإدارة', 'Admin', 'خدمات', 'المبنى الرئيسي', 2),
        ('غرفة العلاج', 'Therapy', 'خدمات', 'المبنى الرئيسي', 1)
      ON CONFLICT DO NOTHING
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM locations');
        console.log(`   ✓ locations: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ locations: ${e.message.split('\n')[0]}`);
    }

    // 2. EMPLOYEES
    console.log('2. Seeding employees...');
    try {
        await client.query(`
      INSERT INTO employees (full_name, employee_number, job_title, department, section, phone, is_active) VALUES 
        ('أحمد محمد', 'EMP1001', 'ممرض', 'التمريض', 'ذكور', '0501234567', true),
        ('فاطمة علي', 'EMP1002', 'ممرضة', 'التمريض', 'إناث', '0501234568', true),
        ('خالد العتيبي', 'EMP1003', 'أخصائي علاج طبيعي', 'العلاج الطبيعي', 'خدمات', '0501234569', true),
        ('نورة السالم', 'EMP1004', 'أخصائية اجتماعية', 'الخدمات الاجتماعية', 'خدمات', '0501234570', true),
        ('محمد الشهري', 'EMP1005', 'فني صيانة', 'الصيانة', 'خدمات', '0501234571', true)
      ON CONFLICT DO NOTHING
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM employees');
        console.log(`   ✓ employees: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ employees: ${e.message.split('\n')[0]}`);
    }

    // 3. MEDICATION SCHEDULES
    console.log('3. Seeding medication_schedules...');
    try {
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 20');
        for (let i = 0; i < Math.min(5, bens.length); i++) {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, 'باراسيتامول', '500mg', 'مرة يومياً', CURRENT_DATE - 10, 'active')
        ON CONFLICT DO NOTHING
      `, [bens[i].id]);
        }
        for (let i = 5; i < Math.min(10, bens.length); i++) {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, 'أوميبرازول', '20mg', 'مرتين يومياً', CURRENT_DATE - 15, 'active')
        ON CONFLICT DO NOTHING
      `, [bens[i].id]);
        }
        for (let i = 10; i < Math.min(15, bens.length); i++) {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, 'فيتامين د', '1000IU', 'مرة يومياً', CURRENT_DATE - 30, 'active')
        ON CONFLICT DO NOTHING
      `, [bens[i].id]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM medication_schedules');
        console.log(`   ✓ medication_schedules: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ medication_schedules: ${e.message.split('\n')[0]}`);
    }

    // 4. VITAL SIGNS
    console.log('4. Seeding vital_signs...');
    try {
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 25');
        for (const ben of bens) {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, measured_at, temperature, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, respiratory_rate, measured_by)
        VALUES ($1, NOW() - interval '1 day' * random() * 7, 36.2 + random() * 1.5, 65 + floor(random() * 25), 110 + floor(random() * 30), 70 + floor(random() * 15), 95 + floor(random() * 5), 14 + floor(random() * 6), 'الممرض أحمد')
      `, [ben.id]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM vital_signs');
        console.log(`   ✓ vital_signs: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ vital_signs: ${e.message.split('\n')[0]}`);
    }

    // 5. SHIFT HANDOVER NOTES
    console.log('5. Seeding shift_handover_notes...');
    try {
        await client.query(`
      INSERT INTO shift_handover_notes (shift_type, handover_by, received_by, notes, priority) VALUES
        ('صباحي', 'أحمد محمد', 'فاطمة علي', 'ملاحظات الوردية الصباحية - جميع المستفيدين بحالة مستقرة', 'normal'),
        ('صباحي', 'أحمد محمد', 'فاطمة علي', 'ملاحظات الوردية - متابعة حالة المستفيد رقم 15', 'high'),
        ('مسائي', 'فاطمة علي', 'خالد العتيبي', 'ملاحظات الوردية المسائية - لا توجد حالات طارئة', 'normal'),
        ('مسائي', 'فاطمة علي', 'خالد العتيبي', 'ملاحظات متابعة الأدوية المسائية', 'normal'),
        ('ليلي', 'خالد العتيبي', 'أحمد محمد', 'ملاحظات الوردية الليلية - مراقبة الحالات الحرجة', 'high'),
        ('ليلي', 'خالد العتيبي', 'أحمد محمد', 'ملاحظات الوردية - كل شيء على ما يرام', 'normal')
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM shift_handover_notes');
        console.log(`   ✓ shift_handover_notes: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ shift_handover_notes: ${e.message.split('\n')[0]}`);
    }

    // 6. GRC STANDARDS
    console.log('6. Seeding grc_standards...');
    try {
        await client.query(`
      INSERT INTO grc_standards (code, name_ar, name_en, description, is_mandatory) VALUES 
        ('HRSD-01', 'معايير الرعاية', 'Care Standards', 'معايير وزارة الموارد البشرية', true),
        ('ISO-9001', 'نظام الجودة', 'Quality Management', 'معيار الأيزو لإدارة الجودة', true),
        ('MHRS-01', 'الصحة والسلامة', 'Health & Safety', 'معايير الصحة والسلامة', true)
      ON CONFLICT DO NOTHING
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM grc_standards');
        console.log(`   ✓ grc_standards: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ grc_standards: ${e.message.split('\n')[0]}`);
    }

    // 7. IPC INSPECTIONS
    console.log('7. Seeding ipc_inspections...');
    try {
        const { rows: locs } = await client.query('SELECT id FROM locations LIMIT 6');
        for (const loc of locs) {
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, compliance_score, total_items, compliant_items)
        VALUES ($1, CURRENT_DATE - 10, 'مفتش مكافحة العدوى', 85.0, 20, 17)
      `, [loc.id]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM ipc_inspections');
        console.log(`   ✓ ipc_inspections: ${rows[0].cnt} rows`);
    } catch (e) {
        console.log(`   ✗ ipc_inspections: ${e.message.split('\n')[0]}`);
    }

    // FINAL SUMMARY
    console.log('\n=== FINAL COUNTS ===\n');
    const tables = ['beneficiaries', 'locations', 'employees', 'medication_schedules', 'vital_signs',
        'shift_handover_notes', 'grc_standards', 'ipc_inspections', 'daily_care_logs',
        'grc_risks', 'social_research', 'rehab_plans'];
    for (const t of tables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
            console.log(`  ${t}: ${rows[0].cnt}`);
        } catch (e) {
            console.log(`  ${t}: ERROR`);
        }
    }

    await client.end();
}

directSeed().catch(console.error);
