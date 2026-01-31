import pg from 'pg';
const { Client } = pg;

// Use postgres superuser
const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'postgres',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function superuserSeed() {
    try {
        await client.connect();
    } catch (e) {
        console.log('Cannot connect with postgres user. Trying service_role...');
        // Try with service role through Supabase API instead
        console.log('ERROR:', e.message);
        return;
    }

    console.log('=== SUPERUSER SEEDING ===\n');

    // First check what tables have RLS and their current state
    console.log('Checking current RLS status...');
    const { rows: rlsStatus } = await client.query(`
    SELECT relname, relrowsecurity 
    FROM pg_class 
    WHERE relname IN ('locations', 'employees', 'medication_schedules', 'vital_signs', 'grc_standards', 'shift_handover_notes')
  `);

    for (const r of rlsStatus) {
        console.log(`  ${r.relname}: RLS=${r.relrowsecurity}`);
    }

    // Disable RLS force for seeding
    console.log('\nDisabling RLS force...');
    for (const t of ['locations', 'employees', 'medication_schedules', 'vital_signs', 'grc_standards', 'shift_handover_notes', 'ipc_inspections']) {
        try {
            await client.query(`ALTER TABLE ${t} DISABLE ROW LEVEL SECURITY`);
            console.log(`  ✓ ${t}: RLS disabled`);
        } catch (e) {
            console.log(`  ✗ ${t}: ${e.message.split('\n')[0]}`);
        }
    }

    // Now seed
    console.log('\nSeeding data...');

    // LOCATIONS
    try {
        await client.query(`TRUNCATE locations CASCADE`);
        const res = await client.query(`
      INSERT INTO locations (name, name_en, section, building, floor) VALUES 
        ('الجناح أ', 'Wing A', 'ذكور', 'المبنى الرئيسي', 1),
        ('الجناح ب', 'Wing B', 'ذكور', 'المبنى الرئيسي', 1),
        ('العيادة', 'Clinic', 'خدمات', 'المبنى الرئيسي', 0),
        ('المطبخ', 'Kitchen', 'خدمات', 'المبنى الخدمي', 0),
        ('الإدارة', 'Admin', 'خدمات', 'المبنى الرئيسي', 2)
      RETURNING id
    `);
        console.log(`  ✓ locations: ${res.rowCount} inserted`);
    } catch (e) {
        console.log(`  ✗ locations: ${e.message}`);
    }

    // EMPLOYEES
    try {
        await client.query(`TRUNCATE employees CASCADE`);
        const res = await client.query(`
      INSERT INTO employees (full_name, employee_number, job_title, department, section, phone, is_active) VALUES 
        ('أحمد محمد', 'EMP001', 'ممرض', 'التمريض', 'ذكور', '0501234567', true),
        ('فاطمة علي', 'EMP002', 'ممرضة', 'التمريض', 'إناث', '0501234568', true),
        ('خالد العتيبي', 'EMP003', 'أخصائي', 'العلاج', 'خدمات', '0501234569', true)
      RETURNING id
    `);
        console.log(`  ✓ employees: ${res.rowCount} inserted`);
    } catch (e) {
        console.log(`  ✗ employees: ${e.message}`);
    }

    // GRC_STANDARDS
    try {
        await client.query(`TRUNCATE grc_standards CASCADE`);
        const res = await client.query(`
      INSERT INTO grc_standards (code, name_ar, name_en, description, is_mandatory) VALUES 
        ('HRSD-01', 'معايير الرعاية', 'Care Standards', 'معايير وزارة الموارد البشرية', true),
        ('ISO-9001', 'نظام الجودة', 'Quality Management', 'معيار الأيزو', true)
      RETURNING id
    `);
        console.log(`  ✓ grc_standards: ${res.rowCount} inserted`);
    } catch (e) {
        console.log(`  ✗ grc_standards: ${e.message}`);
    }

    // SHIFT_HANDOVER_NOTES
    try {
        await client.query(`TRUNCATE shift_handover_notes CASCADE`);
        const res = await client.query(`
      INSERT INTO shift_handover_notes (shift_type, handover_by, received_by, notes, priority) VALUES
        ('صباحي', 'أحمد محمد', 'فاطمة علي', 'ملاحظات الوردية الصباحية', 'normal'),
        ('مسائي', 'فاطمة علي', 'خالد العتيبي', 'ملاحظات الوردية المسائية', 'normal')
      RETURNING id
    `);
        console.log(`  ✓ shift_handover_notes: ${res.rowCount} inserted`);
    } catch (e) {
        console.log(`  ✗ shift_handover_notes: ${e.message}`);
    }

    // MEDICATION_SCHEDULES
    try {
        await client.query(`TRUNCATE medication_schedules CASCADE`);
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 10');
        let count = 0;
        for (const ben of bens) {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, 'باراسيتامول', '500mg', 'مرة يومياً', CURRENT_DATE, 'active')
      `, [ben.id]);
            count++;
        }
        console.log(`  ✓ medication_schedules: ${count} inserted`);
    } catch (e) {
        console.log(`  ✗ medication_schedules: ${e.message}`);
    }

    // VITAL_SIGNS
    try {
        await client.query(`TRUNCATE vital_signs CASCADE`);
        const { rows: bens } = await client.query('SELECT id FROM beneficiaries LIMIT 15');
        let count = 0;
        for (const ben of bens) {
            await client.query(`
        INSERT INTO vital_signs (beneficiary_id, measured_at, temperature, heart_rate, blood_pressure_systolic, blood_pressure_diastolic, oxygen_saturation, respiratory_rate, measured_by)
        VALUES ($1, NOW(), 36.5, 75, 120, 80, 98, 16, 'الممرض أحمد')
      `, [ben.id]);
            count++;
        }
        console.log(`  ✓ vital_signs: ${count} inserted`);
    } catch (e) {
        console.log(`  ✗ vital_signs: ${e.message}`);
    }

    // Re-enable RLS
    console.log('\nRe-enabling RLS...');
    for (const t of ['locations', 'employees', 'medication_schedules', 'vital_signs', 'grc_standards', 'shift_handover_notes']) {
        try {
            await client.query(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY`);
            // Add open read policy
            await client.query(`DROP POLICY IF EXISTS open_read_${t} ON ${t}`);
            await client.query(`CREATE POLICY open_read_${t} ON ${t} FOR SELECT USING (true)`);
            console.log(`  ✓ ${t}: RLS re-enabled with open read`);
        } catch (e) {
            console.log(`  ✗ ${t}: ${e.message.split('\n')[0]}`);
        }
    }

    // Final counts
    console.log('\n=== FINAL COUNTS ===');
    for (const t of ['beneficiaries', 'locations', 'employees', 'medication_schedules', 'vital_signs', 'grc_standards', 'shift_handover_notes']) {
        const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
        console.log(`  ${t}: ${rows[0].cnt}`);
    }

    await client.end();
}

superuserSeed().catch(e => console.error('FATAL:', e.message));
