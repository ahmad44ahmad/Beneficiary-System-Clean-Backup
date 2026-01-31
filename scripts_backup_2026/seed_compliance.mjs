
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

async function seedCompliance() {
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

    const { error } = await supabase.from('grc_compliance_requirements').insert(complianceData);

    if (error) {
        console.error('❌ Compliance seed failed:', error);
    } else {
        console.log('✅ Compliance seeded successfully!');
    }
}

seedCompliance();
