// Comprehensive seed script for all missing data
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://ruesovrbhcjphmfdcpsa.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc'
);

async function seedData() {
    console.log('🌱 Starting comprehensive data seed...\n');

    // Get beneficiary IDs for linking data
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('id, full_name').limit(5);
    const benIds = beneficiaries?.map(b => b.id) || [];

    if (benIds.length === 0) {
        console.log('❌ No beneficiaries found. Please seed beneficiaries first.');
        return;
    }

    console.log(`✅ Found ${benIds.length} beneficiaries\n`);

    // 1. Seed Dignity Files
    console.log('📁 Seeding dignity_files...');
    try {
        const dignityData = benIds.map((id, i) => ({
            beneficiary_id: id,
            preferences: JSON.stringify({
                likes: ['القراءة', 'المشي الصباحي', 'الحديث مع الأصدقاء'],
                dislikes: ['الضوضاء العالية', 'الأماكن المزدحمة'],
                motivators: ['الثناء اللفظي', 'المكالمات العائلية']
            }),
            care_tips: 'يفضل الهدوء في الصباح. يستجيب جيداً للموسيقى الهادئة.',
            communication_style: 'التحدث ببطء والتواصل البصري',
            daily_routine: 'استيقاظ 6 صباحاً، صلاة، إفطار، جلسة علاج',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        const { error: dignityError } = await supabase.from('dignity_files').upsert(dignityData);
        console.log(dignityError ? `   ❌ ${dignityError.message}` : '   ✅ dignity_files seeded');
    } catch (e) {
        console.log('   ⚠️ dignity_files table may not exist');
    }

    // 2. Seed Daily Care Logs
    console.log('📝 Seeding daily_care_logs...');
    try {
        const today = new Date().toISOString().split('T')[0];
        const careLogData = benIds.slice(0, 3).flatMap((id, i) => ([
            {
                beneficiary_id: id,
                log_date: today,
                log_time: '08:00',
                category: 'hygiene',
                description: 'استحمام صباحي بمساعدة',
                notes: 'تعاون جيد',
                staff_name: 'أحمد محمد',
                created_at: new Date().toISOString()
            },
            {
                beneficiary_id: id,
                log_date: today,
                log_time: '12:00',
                category: 'nutrition',
                description: 'تناول وجبة الغداء كاملة',
                notes: 'شهية جيدة',
                staff_name: 'فاطمة علي',
                created_at: new Date().toISOString()
            }
        ]));

        const { error: careError } = await supabase.from('daily_care_logs').upsert(careLogData);
        console.log(careError ? `   ❌ ${careError.message}` : '   ✅ daily_care_logs seeded');
    } catch (e) {
        console.log('   ⚠️ daily_care_logs table may not exist');
    }

    // 3. Seed Fall Risk Assessments
    console.log('⚠️ Seeding fall_risk_assessments...');
    try {
        const fallRiskData = benIds.slice(0, 4).map((id, i) => ({
            beneficiary_id: id,
            assessment_date: new Date().toISOString().split('T')[0],
            risk_score: [25, 45, 70, 35][i],
            mobility_score: [2, 3, 4, 2][i],
            vision_score: [1, 2, 3, 1][i],
            medication_score: [1, 2, 2, 1][i],
            environment_score: [1, 1, 2, 1][i],
            recommendations: ['توفير مساعدة عند المشي', 'إضاءة كافية', 'حذاء مانع للانزلاق'][i % 3],
            assessed_by: 'د. سارة أحمد',
            created_at: new Date().toISOString()
        }));

        const { error: fallError } = await supabase.from('fall_risk_assessments').upsert(fallRiskData);
        console.log(fallError ? `   ❌ ${fallError.message}` : '   ✅ fall_risk_assessments seeded');
    } catch (e) {
        console.log('   ⚠️ fall_risk_assessments table may not exist');
    }

    // 4. Seed Social Research
    console.log('👥 Seeding social_research...');
    try {
        const socialData = benIds.slice(0, 3).map((id, i) => ({
            beneficiary_id: id,
            national_id: `110${i}234567`,
            research_date: new Date().toISOString().split('T')[0],
            family_status: ['متزوج', 'أعزب', 'أرمل'][i],
            economic_status: ['متوسط', 'منخفض', 'جيد'][i],
            housing_status: 'مستقر',
            social_support: ['الأسرة', 'الأصدقاء', 'الجمعيات الخيرية'][i],
            researcher_name: 'أ. عبدالله محمد',
            notes: 'وضع اجتماعي مستقر',
            created_at: new Date().toISOString()
        }));

        const { error: socialError } = await supabase.from('social_research').upsert(socialData);
        console.log(socialError ? `   ❌ ${socialError.message}` : '   ✅ social_research seeded');
    } catch (e) {
        console.log('   ⚠️ social_research table may not exist');
    }

    // 5. Seed Assets (OM)
    console.log('🏢 Seeding om_assets...');
    try {
        const assetsData = [
            { asset_code: 'BED-001', name_ar: 'سرير طبي كهربائي', category: 'أثاث طبي', status: 'operational', location: 'الجناح أ - غرفة 101' },
            { asset_code: 'WC-001', name_ar: 'كرسي متحرك', category: 'أجهزة تنقل', status: 'operational', location: 'المستودع الرئيسي' },
            { asset_code: 'AC-001', name_ar: 'مكيف سبليت', category: 'تكييف', status: 'operational', location: 'الجناح أ' },
            { asset_code: 'GEN-001', name_ar: 'مولد كهربائي', category: 'طاقة', status: 'maintenance', location: 'غرفة المولدات' },
            { asset_code: 'LIFT-001', name_ar: 'رافعة مريض', category: 'أجهزة طبية', status: 'operational', location: 'الطابق الثاني' }
        ];

        const { error: assetsError } = await supabase.from('om_assets').upsert(assetsData);
        console.log(assetsError ? `   ❌ ${assetsError.message}` : '   ✅ om_assets seeded');
    } catch (e) {
        console.log('   ⚠️ om_assets table may not exist');
    }

    // 6. Seed Accountability Gaps (for GRC)
    console.log('📋 Seeding accountability_gaps...');
    try {
        const gapsData = [
            {
                issue_code: 'GAP-2025-001',
                issue_title: 'تأخر في توفير الأجهزة الطبية',
                issue_description: 'تأخر شركة المستلزمات الطبية في تسليم الأجهزة المطلوبة',
                responsible_agency: 'شركة المستلزمات الطبية',
                is_misdirected: false,
                official_response: 'سيتم التسليم خلال أسبوع',
                actual_delivery: 'لم يتم التسليم بعد',
                evasion_type: 'false_promise',
                severity: 'high',
                days_pending: 15,
                evidence_quote: 'تم الوعد بالتسليم في 10 يناير ولم يتم',
                requires_attention: true,
                acknowledged: false
            },
            {
                issue_code: 'GAP-2025-002',
                issue_title: 'نقص في الكوادر التمريضية',
                issue_description: 'عدم اكتمال الكادر التمريضي حسب المعايير',
                responsible_agency: 'إدارة الموارد البشرية',
                is_misdirected: false,
                official_response: 'جاري التوظيف',
                actual_delivery: 'تم توظيف 2 من 5 مطلوبين',
                evasion_type: 'partial_delivery',
                severity: 'medium',
                days_pending: 30,
                evidence_quote: 'المطلوب 5 ممرضين وتم توفير 2 فقط',
                requires_attention: true,
                acknowledged: false
            }
        ];

        const { error: gapsError } = await supabase.from('accountability_gaps').upsert(gapsData);
        console.log(gapsError ? `   ❌ ${gapsError.message}` : '   ✅ accountability_gaps seeded');
    } catch (e) {
        console.log('   ⚠️ accountability_gaps table may not exist');
    }

    console.log('\n✨ Seed process complete!');
}

seedData();
