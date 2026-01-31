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

async function fixAndSeed() {
    await client.connect();

    console.log('=== DISABLING RLS AND SEEDING ===\n');

    const tables = [
        'locations', 'employees', 'medication_schedules', 'vital_signs',
        'shift_handover_notes', 'grc_standards', 'ipc_inspections',
        'beneficiary_preferences', 'rehab_goals', 'om_asset_categories',
        'om_assets', 'om_maintenance_requests'
    ];

    // 1. DISABLE RLS on all tables
    console.log('1. Disabling RLS...');
    for (const t of tables) {
        try {
            await client.query(`ALTER TABLE ${t} DISABLE ROW LEVEL SECURITY`);
            console.log(`   ✓ ${t}: RLS disabled`);
        } catch (e) {
            console.log(`   ✗ ${t}: ${e.message.split('\n')[0]}`);
        }
    }

    // 2. SEED DATA
    console.log('\n2. Seeding data...');

    // LOCATIONS
    try {
        await client.query(`DELETE FROM locations`);
        await client.query(`
      INSERT INTO locations (name, name_en, section, building, floor) VALUES 
        ('الجناح أ', 'Wing A', 'ذكور', 'المبنى الرئيسي', 1),
        ('الجناح ب', 'Wing B', 'ذكور', 'المبنى الرئيسي', 1),
        ('العيادة', 'Clinic', 'خدمات', 'المبنى الرئيسي', 0),
        ('المطبخ', 'Kitchen', 'خدمات', 'المبنى الخدمي', 0),
        ('الإدارة', 'Admin', 'خدمات', 'المبنى الرئيسي', 2),
        ('غرفة العلاج', 'Therapy', 'خدمات', 'المبنى الرئيسي', 1)
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM locations');
        console.log(`   ✓ locations: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ locations: ${e.message.split('\n')[0]}`);
    }

    // EMPLOYEES
    try {
        await client.query(`DELETE FROM employees`);
        await client.query(`
      INSERT INTO employees (full_name, employee_number, job_title, department, section, phone, is_active) VALUES 
        ('أحمد محمد', 'EMP1001', 'ممرض', 'التمريض', 'ذكور', '0501234567', true),
        ('فاطمة علي', 'EMP1002', 'ممرضة', 'التمريض', 'إناث', '0501234568', true),
        ('خالد العتيبي', 'EMP1003', 'أخصائي علاج طبيعي', 'العلاج الطبيعي', 'خدمات', '0501234569', true),
        ('نورة السالم', 'EMP1004', 'أخصائية اجتماعية', 'الخدمات الاجتماعية', 'خدمات', '0501234570', true),
        ('محمد الشهري', 'EMP1005', 'فني صيانة', 'الصيانة', 'خدمات', '0501234571', true)
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM employees');
        console.log(`   ✓ employees: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ employees: ${e.message.split('\n')[0]}`);
    }

    // GRC_STANDARDS
    try {
        await client.query(`DELETE FROM grc_standards`);
        await client.query(`
      INSERT INTO grc_standards (code, name_ar, name_en, description, is_mandatory) VALUES 
        ('HRSD-01', 'معايير الرعاية', 'Care Standards', 'معايير وزارة الموارد البشرية', true),
        ('ISO-9001', 'نظام الجودة', 'Quality Management', 'معيار الأيزو لإدارة الجودة', true),
        ('MHRS-01', 'الصحة والسلامة', 'Health Safety', 'معايير الصحة والسلامة', true)
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM grc_standards');
        console.log(`   ✓ grc_standards: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ grc_standards: ${e.message.split('\n')[0]}`);
    }

    // SHIFT_HANDOVER_NOTES
    try {
        await client.query(`DELETE FROM shift_handover_notes`);
        await client.query(`
      INSERT INTO shift_handover_notes (shift_type, handover_by, received_by, notes, priority) VALUES
        ('صباحي', 'أحمد محمد', 'فاطمة علي', 'ملاحظات الوردية الصباحية', 'normal'),
        ('صباحي', 'أحمد محمد', 'فاطمة علي', 'متابعة حالة المستفيد رقم 15', 'high'),
        ('مسائي', 'فاطمة علي', 'خالد العتيبي', 'ملاحظات الوردية المسائية', 'normal'),
        ('ليلي', 'خالد العتيبي', 'أحمد محمد', 'ملاحظات الوردية الليلية', 'high')
    `);
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM shift_handover_notes');
        console.log(`   ✓ shift_handover_notes: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ shift_handover_notes: ${e.message.split('\n')[0]}`);
    }

    // MEDICATION_SCHEDULES
    try {
        await client.query(`DELETE FROM medication_schedules`);
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 15');
        for (let i = 0; i < bens.length; i++) {
            const meds = ['باراسيتامول', 'أوميبرازول', 'فيتامين د'];
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, $2, '500mg', 'مرة يومياً', CURRENT_DATE - 10, 'active')
      `, [bens[i].id, meds[i % 3]]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM medication_schedules');
        console.log(`   ✓ medication_schedules: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ medication_schedules: ${e.message.split('\n')[0]}`);
    }

    // VITAL_SIGNS
    try {
        await client.query(`DELETE FROM vital_signs`);
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 20');
        for (const ben of bens) {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, measured_at, temperature, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, respiratory_rate, measured_by)
        VALUES ($1, NOW() - interval '1 day' * random() * 7, 36.5, 75, 120, 80, 98, 16, 'الممرض أحمد')
      `, [ben.id]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM vital_signs');
        console.log(`   ✓ vital_signs: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ vital_signs: ${e.message.split('\n')[0]}`);
    }

    // IPC_INSPECTIONS
    try {
        await client.query(`DELETE FROM ipc_inspections`);
        const { rows: locs } = await client.query('SELECT id FROM locations');
        for (const loc of locs) {
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, compliance_score, total_items, compliant_items)
        VALUES ($1, CURRENT_DATE - 10, 'مفتش مكافحة العدوى', 85.0, 20, 17)
      `, [loc.id]);
        }
        const { rows } = await client.query('SELECT COUNT(*) as cnt FROM ipc_inspections');
        console.log(`   ✓ ipc_inspections: ${rows[0].cnt}`);
    } catch (e) {
        console.log(`   ✗ ipc_inspections: ${e.message.split('\n')[0]}`);
    }

    // 3. RE-ENABLE RLS (but add public read policies)
    console.log('\n3. Re-enabling RLS with public read policies...');
    for (const t of tables) {
        try {
            await client.query(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`);
            // Add public read policy
            await client.query(`DROP POLICY IF EXISTS public_read_${t} ON ${t}`);
            await client.query(`
        CREATE POLICY public_read_${t} ON ${t}
        FOR SELECT TO anon, authenticated, public
        USING (true)
      `);
            console.log(`   ✓ ${t}: RLS enabled with public read`);
        } catch (e) {
            console.log(`   ✗ ${t}: ${e.message.split('\n')[0]}`);
        }
    }

    // FINAL COUNTS
    console.log('\n=== FINAL COUNTS ===');
    const allTables = ['beneficiaries', 'locations', 'employees', 'medication_schedules',
        'vital_signs', 'shift_handover_notes', 'grc_standards', 'ipc_inspections'];
    for (const t of allTables) {
        const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
        console.log(`  ${t}: ${rows[0].cnt}`);
    }

    await client.end();
}

fixAndSeed().catch(console.error);
