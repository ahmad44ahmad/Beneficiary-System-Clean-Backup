// COMPREHENSIVE SEEDING WITH SERVICE ROLE - ALL TABLES
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

async function comprehensiveSeed() {
    console.log('=== COMPREHENSIVE SEEDING (SERVICE ROLE) ===\n');

    // 1. Get existing beneficiary IDs
    console.log('1. Getting beneficiary IDs...');
    const bens = await request('GET', 'beneficiaries', null, '?select=id,full_name&limit=50');
    console.log(`   Found ${bens.length} beneficiaries`);

    if (bens.length === 0) {
        console.log('   ✗ No beneficiaries found. Cannot proceed.');
        return;
    }

    // 2. Seed LOCATIONS
    console.log('\n2. Seeding locations...');
    try {
        await request('DELETE', 'locations', null, '?id=neq.00000000-0000-0000-0000-000000000000');
        const locs = await request('POST', 'locations', [
            { name: 'الجناح أ - ذكور', name_en: 'Wing A Male', section: 'ذكور', building: 'المبنى الرئيسي', floor: 1 },
            { name: 'الجناح ب - ذكور', name_en: 'Wing B Male', section: 'ذكور', building: 'المبنى الرئيسي', floor: 1 },
            { name: 'العيادة الطبية', name_en: 'Medical Clinic', section: 'خدمات', building: 'المبنى الرئيسي', floor: 0 },
            { name: 'المطبخ المركزي', name_en: 'Central Kitchen', section: 'خدمات', building: 'المبنى الخدمي', floor: 0 },
            { name: 'الإدارة', name_en: 'Administration', section: 'خدمات', building: 'المبنى الرئيسي', floor: 2 },
            { name: 'غرفة العلاج الطبيعي', name_en: 'Physiotherapy Room', section: 'خدمات', building: 'المبنى الرئيسي', floor: 1 }
        ]);
        console.log(`   ✓ locations: ${locs.length} inserted`);
    } catch (e) {
        console.log(`   ✗ locations: ${e.message}`);
    }

    // 3. Seed EMPLOYEES
    console.log('\n3. Seeding employees...');
    try {
        await request('DELETE', 'employees', null, '?id=neq.00000000-0000-0000-0000-000000000000');
        const emps = await request('POST', 'employees', [
            { full_name: 'أحمد محمد العنزي', employee_number: 'EMP001', job_title: 'ممرض رئيسي', department: 'التمريض', section: 'ذكور', phone: '0501234567', is_active: true },
            { full_name: 'فاطمة علي السالم', employee_number: 'EMP002', job_title: 'ممرضة', department: 'التمريض', section: 'خدمات', phone: '0501234568', is_active: true },
            { full_name: 'خالد العتيبي', employee_number: 'EMP003', job_title: 'أخصائي علاج طبيعي', department: 'التأهيل', section: 'خدمات', phone: '0501234569', is_active: true },
            { full_name: 'نورة القحطاني', employee_number: 'EMP004', job_title: 'أخصائية اجتماعية', department: 'الخدمات الاجتماعية', section: 'خدمات', phone: '0501234570', is_active: true },
            { full_name: 'محمد الشهري', employee_number: 'EMP005', job_title: 'فني صيانة', department: 'التشغيل', section: 'خدمات', phone: '0501234571', is_active: true }
        ]);
        console.log(`   ✓ employees: ${emps.length} inserted`);
    } catch (e) {
        console.log(`   ✗ employees: ${e.message}`);
    }

    // 4. Seed MEDICATION_SCHEDULES
    console.log('\n4. Seeding medication_schedules...');
    try {
        await request('DELETE', 'medication_schedules', null, '?id=neq.00000000-0000-0000-0000-000000000000');
        const medsData = [];
        const meds = ['باراسيتامول 500mg', 'أوميبرازول 20mg', 'فيتامين د3', 'ميتفورمين 500mg', 'أملوديبين 5mg'];
        for (let i = 0; i < Math.min(25, bens.length); i++) {
            medsData.push({
                beneficiary_id: bens[i].id,
                medication_name: meds[i % meds.length],
                dosage: '1 حبة',
                frequency: ['مرة يومياً', 'مرتين يومياً', 'ثلاث مرات يومياً'][i % 3],
                start_date: new Date().toISOString().split('T')[0],
                status: 'active'
            });
        }
        const result = await request('POST', 'medication_schedules', medsData);
        console.log(`   ✓ medication_schedules: ${result.length} inserted`);
    } catch (e) {
        console.log(`   ✗ medication_schedules: ${e.message}`);
    }

    // 5. Seed VITAL_SIGNS
    console.log('\n5. Seeding vital_signs...');
    try {
        await request('DELETE', 'vital_signs', null, '?id=neq.00000000-0000-0000-0000-000000000000');
        const vitalsData = [];
        for (let i = 0; i < Math.min(30, bens.length); i++) {
            vitalsData.push({
                beneficiary_id: bens[i].id,
                measured_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
                temperature: (36 + Math.random() * 1.5).toFixed(1),
                heart_rate: Math.floor(65 + Math.random() * 25),
                blood_pressure_systolic: Math.floor(110 + Math.random() * 30),
                blood_pressure_diastolic: Math.floor(70 + Math.random() * 15),
                oxygen_saturation: Math.floor(95 + Math.random() * 5),
                respiratory_rate: Math.floor(14 + Math.random() * 6),
                measured_by: 'الممرض أحمد'
            });
        }
        const result = await request('POST', 'vital_signs', vitalsData);
        console.log(`   ✓ vital_signs: ${result.length} inserted`);
    } catch (e) {
        console.log(`   ✗ vital_signs: ${e.message}`);
    }

    // 6. Seed SHIFT_HANDOVER_NOTES
    console.log('\n6. Seeding shift_handover_notes...');
    try {
        await request('DELETE', 'shift_handover_notes', null, '?id=neq.00000000-0000-0000-0000-000000000000');
        const notes = await request('POST', 'shift_handover_notes', [
            { shift_type: 'صباحي', handover_by: 'أحمد العنزي', received_by: 'فاطمة السالم', notes: 'جميع المستفيدين بحالة مستقرة. تم توزيع الأدوية الصباحية.', priority: 'normal' },
            { shift_type: 'صباحي', handover_by: 'أحمد العنزي', received_by: 'فاطمة السالم', notes: 'يرجى متابعة حالة المستفيد رقم 15 - ارتفاع طفيف في الحرارة.', priority: 'high' },
            { shift_type: 'مسائي', handover_by: 'فاطمة السالم', received_by: 'خالد العتيبي', notes: 'تم إجراء جلسات العلاج الطبيعي للمستفيدين المجدولين.', priority: 'normal' },
            { shift_type: 'مسائي', handover_by: 'فاطمة السالم', received_by: 'خالد العتيبي', notes: 'لا توجد حالات طارئة. النظافة العامة ممتازة.', priority: 'normal' },
            { shift_type: 'ليلي', handover_by: 'خالد العتيبي', received_by: 'أحمد العنزي', notes: 'ليلة هادئة. جميع المستفيدين نائمون.', priority: 'normal' },
            { shift_type: 'ليلي', handover_by: 'خالد العتيبي', received_by: 'أحمد العنزي', notes: 'تمت مراقبة الحالات الحرجة كل ساعتين.', priority: 'high' }
        ]);
        console.log(`   ✓ shift_handover_notes: ${notes.length} inserted`);
    } catch (e) {
        console.log(`   ✗ shift_handover_notes: ${e.message}`);
    }

    // 7. Seed DAILY_CARE_LOGS (if empty)
    console.log('\n7. Checking daily_care_logs...');
    try {
        const existing = await request('GET', 'daily_care_logs', null, '?select=id&limit=1');
        if (existing.length === 0) {
            const logsData = [];
            for (let i = 0; i < Math.min(20, bens.length); i++) {
                logsData.push({
                    beneficiary_id: bens[i].id,
                    log_date: new Date().toISOString().split('T')[0],
                    activity_type: ['تغذية', 'نظافة', 'علاج', 'ترفيه'][i % 4],
                    notes: 'تمت الرعاية اليومية بنجاح',
                    recorded_by: 'أحمد العنزي'
                });
            }
            const result = await request('POST', 'daily_care_logs', logsData);
            console.log(`   ✓ daily_care_logs: ${result.length} inserted`);
        } else {
            console.log(`   ℹ daily_care_logs: Already has data (${existing.length}+)`);
        }
    } catch (e) {
        console.log(`   ✗ daily_care_logs: ${e.message}`);
    }

    // 8. Seed GRC_STANDARDS (if empty)
    console.log('\n8. Checking grc_standards...');
    try {
        const existing = await request('GET', 'grc_standards', null, '?select=id&limit=1');
        if (existing.length === 0) {
            const stds = await request('POST', 'grc_standards', [
                { code: 'HRSD-01', name_ar: 'معايير وزارة الموارد البشرية للرعاية', name_en: 'HRSD Care Standards', description: 'المعايير الأساسية لدور الرعاية الاجتماعية من وزارة الموارد البشرية والتنمية الاجتماعية', is_mandatory: true },
                { code: 'ISO-9001', name_ar: 'معيار الأيزو لإدارة الجودة', name_en: 'ISO 9001 Quality Management', description: 'المعيار الدولي لنظام إدارة الجودة', is_mandatory: true },
                { code: 'MHRS-01', name_ar: 'معايير الصحة والسلامة المهنية', name_en: 'Occupational Health & Safety', description: 'متطلبات السلامة والصحة المهنية في بيئة العمل', is_mandatory: true }
            ]);
            console.log(`   ✓ grc_standards: ${stds.length} inserted`);
        } else {
            console.log(`   ℹ grc_standards: Already has data`);
        }
    } catch (e) {
        console.log(`   ✗ grc_standards: ${e.message}`);
    }

    // FINAL COUNTS
    console.log('\n=== FINAL VERIFICATION ===');
    const tables = ['beneficiaries', 'locations', 'employees', 'medication_schedules',
        'vital_signs', 'shift_handover_notes', 'daily_care_logs', 'grc_standards',
        'grc_risks', 'social_research', 'rehab_plans'];
    for (const t of tables) {
        try {
            const count = await request('GET', t, null, '?select=id');
            console.log(`  ${t}: ${count.length}`);
        } catch (e) {
            console.log(`  ${t}: ERROR`);
        }
    }
}

comprehensiveSeed().catch(e => console.error('FATAL:', e.message));
