// Use Supabase REST API with service_role key (bypasses RLS)
const SUPABASE_URL = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_-NuRJEzWuDNpxO9euyEZAA_ZSUDoUWA';

async function request(method, table, body = null, query = '') {
    const url = `${SUPABASE_URL}/rest/v1/${table}${query}`;
    const opts = {
        method,
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const text = await res.text();

    if (!res.ok) {
        throw new Error(`${res.status}: ${text}`);
    }

    return text ? JSON.parse(text) : null;
}

async function seedViaAPI() {
    console.log('=== SEEDING VIA SUPABASE REST API (SERVICE ROLE) ===\n');

    // 1. Get existing beneficiary IDs
    console.log('1. Getting beneficiary IDs...');
    const bens = await request('GET', 'beneficiaries', null, '?select=id&limit=30');
    console.log(`   Found ${bens.length} beneficiaries`);

    // 2. Delete existing data from target tables
    console.log('\n2. Clearing existing data...');
    const tables = ['locations', 'employees', 'medication_schedules', 'vital_signs',
        'shift_handover_notes', 'grc_standards'];
    for (const t of tables) {
        try {
            await request('DELETE', t, null, '?id=neq.00000000-0000-0000-0000-000000000000');
            console.log(`   ✓ ${t}: cleared`);
        } catch (e) {
            console.log(`   ✗ ${t}: ${e.message.substring(0, 50)}`);
        }
    }

    // 3. Insert LOCATIONS
    console.log('\n3. Inserting locations...');
    try {
        const locs = await request('POST', 'locations', [
            { name: 'الجناح أ', name_en: 'Wing A', section: 'ذكور', building: 'المبنى الرئيسي', floor: 1 },
            { name: 'الجناح ب', name_en: 'Wing B', section: 'ذكور', building: 'المبنى الرئيسي', floor: 1 },
            { name: 'العيادة', name_en: 'Clinic', section: 'خدمات', building: 'المبنى الرئيسي', floor: 0 },
            { name: 'المطبخ', name_en: 'Kitchen', section: 'خدمات', building: 'المبنى الخدمي', floor: 0 },
            { name: 'الإدارة', name_en: 'Admin', section: 'خدمات', building: 'المبنى الرئيسي', floor: 2 }
        ]);
        console.log(`   ✓ locations: ${locs.length} inserted`);
    } catch (e) {
        console.log(`   ✗ locations: ${e.message}`);
    }

    // 4. Insert EMPLOYEES
    console.log('\n4. Inserting employees...');
    try {
        const emps = await request('POST', 'employees', [
            { full_name: 'أحمد محمد', employee_number: 'EMP001', job_title: 'ممرض', department: 'التمريض', section: 'ذكور', phone: '0501234567', is_active: true },
            { full_name: 'فاطمة علي', employee_number: 'EMP002', job_title: 'ممرضة', department: 'التمريض', section: 'إناث', phone: '0501234568', is_active: true },
            { full_name: 'خالد العتيبي', employee_number: 'EMP003', job_title: 'أخصائي', department: 'العلاج', section: 'خدمات', phone: '0501234569', is_active: true }
        ]);
        console.log(`   ✓ employees: ${emps.length} inserted`);
    } catch (e) {
        console.log(`   ✗ employees: ${e.message}`);
    }

    // 5. Insert GRC_STANDARDS
    console.log('\n5. Inserting grc_standards...');
    try {
        const stds = await request('POST', 'grc_standards', [
            { code: 'HRSD-01', name_ar: 'معايير الرعاية', name_en: 'Care Standards', description: 'معايير وزارة الموارد البشرية', is_mandatory: true },
            { code: 'ISO-9001', name_ar: 'نظام الجودة', name_en: 'Quality Management', description: 'معيار الأيزو', is_mandatory: true }
        ]);
        console.log(`   ✓ grc_standards: ${stds.length} inserted`);
    } catch (e) {
        console.log(`   ✗ grc_standards: ${e.message}`);
    }

    // 6. Insert SHIFT_HANDOVER_NOTES
    console.log('\n6. Inserting shift_handover_notes...');
    try {
        const notes = await request('POST', 'shift_handover_notes', [
            { shift_type: 'صباحي', handover_by: 'أحمد محمد', received_by: 'فاطمة علي', notes: 'ملاحظات الوردية الصباحية', priority: 'normal' },
            { shift_type: 'مسائي', handover_by: 'فاطمة علي', received_by: 'خالد', notes: 'ملاحظات الوردية المسائية', priority: 'normal' },
            { shift_type: 'ليلي', handover_by: 'خالد', received_by: 'أحمد محمد', notes: 'ملاحظات الليلية', priority: 'high' }
        ]);
        console.log(`   ✓ shift_handover_notes: ${notes.length} inserted`);
    } catch (e) {
        console.log(`   ✗ shift_handover_notes: ${e.message}`);
    }

    // 7. Insert MEDICATION_SCHEDULES
    console.log('\n7. Inserting medication_schedules...');
    try {
        const medsData = [];
        for (let i = 0; i < Math.min(15, bens.length); i++) {
            medsData.push({
                beneficiary_id: bens[i].id,
                medication_name: ['باراسيتامول', 'أوميبرازول', 'فيتامين د'][i % 3],
                dosage: '500mg',
                frequency: 'مرة يومياً',
                start_date: new Date().toISOString().split('T')[0],
                status: 'active'
            });
        }
        const meds = await request('POST', 'medication_schedules', medsData);
        console.log(`   ✓ medication_schedules: ${meds.length} inserted`);
    } catch (e) {
        console.log(`   ✗ medication_schedules: ${e.message}`);
    }

    // 8. Insert VITAL_SIGNS
    console.log('\n8. Inserting vital_signs...');
    try {
        const vitalsData = [];
        for (let i = 0; i < Math.min(20, bens.length); i++) {
            vitalsData.push({
                beneficiary_id: bens[i].id,
                measured_at: new Date().toISOString(),
                temperature: 36.5 + Math.random(),
                heart_rate: 70 + Math.floor(Math.random() * 20),
                blood_pressure_systolic: 110 + Math.floor(Math.random() * 30),
                blood_pressure_diastolic: 70 + Math.floor(Math.random() * 15),
                oxygen_saturation: 95 + Math.floor(Math.random() * 5),
                respiratory_rate: 14 + Math.floor(Math.random() * 6),
                measured_by: 'الممرض أحمد'
            });
        }
        const vitals = await request('POST', 'vital_signs', vitalsData);
        console.log(`   ✓ vital_signs: ${vitals.length} inserted`);
    } catch (e) {
        console.log(`   ✗ vital_signs: ${e.message}`);
    }

    // FINAL COUNTS
    console.log('\n=== FINAL COUNTS ===');
    for (const t of ['beneficiaries', 'locations', 'employees', 'medication_schedules',
        'vital_signs', 'shift_handover_notes', 'grc_standards']) {
        try {
            const count = await request('GET', t, null, '?select=id');
            console.log(`  ${t}: ${count.length}`);
        } catch (e) {
            console.log(`  ${t}: ERROR - ${e.message.substring(0, 30)}`);
        }
    }
}

seedViaAPI().catch(e => console.error('FATAL:', e.message));
