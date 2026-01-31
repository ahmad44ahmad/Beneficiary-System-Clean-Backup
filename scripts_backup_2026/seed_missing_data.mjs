
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedMissingData() {
    console.log('🌱 Starting comprehensive data seed...');

    // 1. Get or Create Beneficiary
    let beneficiaryId;
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('id, full_name').limit(1);

    if (beneficiaries && beneficiaries.length > 0) {
        beneficiaryId = beneficiaries[0].id;
        console.log(`✅ Using existing beneficiary: ${beneficiaryId} (${beneficiaries[0].full_name})`);
    } else {
        console.log('⚠️ No beneficiaries found. Creating demo beneficiary...');
        // Schema requires: file_number (unique), full_name, section
        const { data: newBen, error } = await supabase.from('beneficiaries').insert({
            full_name: 'محمد أحمد العمري',
            file_number: 'DEMO-' + Date.now(),
            section: 'ذكور',
            admission_date: '2024-01-01',
            status: 'نشط'
        }).select().single();

        if (error) {
            console.error('❌ Failed to create beneficiary:', error);
            // Verify what actually went wrong
            return;
        }
        beneficiaryId = newBen.id;
        console.log(`✅ Created demo beneficiary: ${beneficiaryId}`);
    }

    // 2. Seed Dignity File (Beneficiary Preferences)
    console.log('👤 Seeding Dignity File...');
    const dignityData = {
        beneficiary_id: beneficiaryId,
        preferred_name: 'أبو أحمد',
        preferred_title: 'العم',
        communication_style: 'يفضل التحدث بهدوء وبطء',
        preferred_activities: ['القراءة', 'المشي في الحديقة'],
        hobbies: ['جمع الطوابع', 'الرسم'],
        calming_strategies: ['سماع القرآن', 'الجلوس في مكان هادئ'],
        motivators: ['الثناء اللفظي', 'زيارة الأحفاد'],
        what_makes_me_happy: 'الاجتماع بالعائلة وتناول القهوة',
        what_makes_me_upset: 'الضوضاء العالية والازدحام',
        my_dreams: 'أن أرى أحفادي يتخرجون من الجامعة',
        wake_up_time: '05:00',
        sleep_time: '21:30'
    };

    const { error: dignityError } = await supabase
        .from('beneficiary_preferences')
        .upsert(dignityData, { onConflict: 'beneficiary_id' });

    if (dignityError) console.error('❌ Dignity File seed failed:', dignityError);
    else console.log('✅ Dignity File seeded.');

    // 3. Seed Family Portal (Rehab Goals)
    console.log('👨‍👩‍👧 Seeding Family Portal Goals...');
    const goalsData = [
        {
            beneficiary_id: beneficiaryId,
            domain: 'physical',
            goal_title: 'المشي لمسافة 50 متر',
            goal_description: 'تحسين القدرة على المشي باستخدام المشاية',
            status: 'in_progress',
            progress_percentage: 65,
            start_date: '2025-01-01',
            target_date: '2025-06-01',
            created_at: new Date().toISOString()
        },
        {
            beneficiary_id: beneficiaryId,
            domain: 'social',
            goal_title: 'المشاركة في الأنشطة الجماعية',
            goal_description: 'حضور جلسات القهوة الصباحية 3 مرات أسبوعياً',
            status: 'achieved',
            progress_percentage: 100,
            start_date: '2025-01-01',
            target_date: '2025-03-01',
            created_at: new Date().toISOString()
        }
    ];

    const { error: goalsError } = await supabase.from('rehab_goals').insert(goalsData);
    if (goalsError) console.error('❌ Family Portal Goals seed failed:', goalsError);
    else console.log('✅ Family Portal Goals seeded.');

    // 4. Seed Compliance (GRC)
    console.log('📋 Seeding Compliance Requirements...');
    const complianceData = [
        {
            requirement_code: 'ISO-001',
            title_ar: 'سياسة حماية البيانات',
            description: 'وجود سياسة معتمدة لحماية بيانات المستفيدين',
            section: 'أمن المعلومات',
            compliance_status: 'compliant',
            compliance_score: 100,
            responsible_person: 'مدير التقنية',
            due_date: '2025-12-31'
        },
        {
            requirement_code: 'MOH-045',
            title_ar: 'ترخيص العيادة الطبية',
            description: 'تجديد ترخيص العيادة الداخلية',
            section: 'التراخيص',
            compliance_status: 'partial',
            compliance_score: 50,
            responsible_person: 'المدير الطبي',
            due_date: '2025-04-01'
        },
        {
            requirement_code: 'ISO-002',
            title_ar: 'إجراءات الطوارئ',
            description: 'توثيق إجراءات الإخلاء وتدريب الموظفين عليها',
            section: 'السلامة والصحة المهنية',
            compliance_status: 'non_compliant',
            compliance_score: 20,
            responsible_person: 'مسؤول السلامة',
            due_date: '2025-02-15'
        }
    ];

    const { error: complianceError } = await supabase.from('grc_compliance_requirements').insert(complianceData);
    if (complianceError) console.error('❌ Compliance seed failed:', complianceError);
    else console.log('✅ Compliance seeded.');

    console.log('✨ Seeding complete!');
}

seedMissingData();
