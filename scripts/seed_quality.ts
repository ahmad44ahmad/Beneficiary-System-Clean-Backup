
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedQualityData() {
    console.log('🌱 Seeding Quality Assurance Data...');

    // 1. Suppliers
    const { data: suppliers, error: supError } = await supabase
        .from('catering_suppliers')
        .upsert([
            {
                name: 'شركة الخليج للتموين',
                contact_person: 'أحمد الغامدي',
                phone: '0505555555',
                email: 'gulf@catering.com'
            },
            {
                name: 'مؤسسة الإعاشة الحديثة',
                contact_person: 'سعيد العتيبي',
                phone: '0506666666',
                email: 'modern@catering.com'
            }
        ], { onConflict: 'name' }) // Avoiding duplicates
        .select();

    if (supError) console.error('Error seeding suppliers:', supError);
    else console.log(`✅ Seeded ${suppliers?.length} suppliers`);

    // 2. Evaluation Criteria
    const { data: criteria, error: critError } = await supabase
        .from('evaluation_criteria')
        .upsert([
            { category: 'النظافة الشخصية', question: 'زي العمال نظيف وكامل (كمامات، قفازات، غطاء رأس)' },
            { category: 'النظافة الشخصية', question: 'نظافة أيدي العاملين وتقليم الأظافر' },
            { category: 'جودة الطعام', question: 'درجة حرارة الطعام عند التقديم مطابقة للمواصفات (>60c للساخن)' },
            { category: 'جودة الطعام', question: 'الالتزام بالأصناف المقررة في القائمة' },
            { category: 'المكان والتجهيزات', question: 'نظافة صالة الطعام والموائد' },
            { category: 'المكان والتجهيزات', question: 'عمل أجهزة التكييف والتهوية بكفاءة' }
        ], { onConflict: 'question' })
        .select();

    if (critError) console.error('Error seeding criteria:', critError);
    else console.log(`✅ Seeded ${criteria?.length} evaluation criteria`);

    console.log('✨ Seeding Complete!');
}

seedQualityData();
