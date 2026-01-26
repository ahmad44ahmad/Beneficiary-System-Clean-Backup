// Supabase Admin Script - Uses Service Role Key for full access
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4MzQxOSwiZXhwIjoyMDgwODU5NDE5fQ.sb_secret_-NuRJEzWuDNpxO9euyEZAA_ZSUDoUWA';

// Create admin client with service role key (bypasses RLS)
const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
});

console.log('🔧 Supabase Admin Tool (Service Role)');
console.log('=====================================');

async function checkTables() {
    console.log('\n📋 Checking existing tables...');

    // Check beneficiaries
    try {
        const { count: beneficiariesCount } = await supabase
            .from('beneficiaries')
            .select('*', { count: 'exact', head: true });
        console.log(`   ✓ beneficiaries: ${beneficiariesCount || 0} records`);
    } catch (e) {
        console.log(`   ✗ beneficiaries: table not found`);
    }

    // Check staff
    try {
        const { count: staffCount } = await supabase
            .from('staff')
            .select('*', { count: 'exact', head: true });
        console.log(`   ✓ staff: ${staffCount || 0} records`);
    } catch (e) {
        console.log(`   ✗ staff: table not found`);
    }

    // Check grc_risks
    try {
        const { count: risksCount, error } = await supabase
            .from('grc_risks')
            .select('*', { count: 'exact', head: true });
        if (error) throw error;
        console.log(`   ✓ grc_risks: ${risksCount || 0} records`);
        return true; // GRC tables exist
    } catch (e) {
        console.log(`   ✗ grc_risks: table not found - needs creation`);
        return false;
    }
}

async function createGrcTables() {
    console.log('\n📦 Creating GRC tables via RPC...');

    // Since we can't run raw SQL through JS client, we'll create tables by inserting
    // But first, we need to check if tables exist

    // GRC Risks Data
    const grcRisks = [
        { title: 'مخاطر السقوط للمستفيدين', description: 'خطر سقوط المستفيدين ذوي الإعاقة الحركية', category: 'safety', risk_score: 15, probability: 3, impact: 5, status: 'mitigating', owner: 'مدير الرعاية', mitigation_plan: 'تركيب قضبان أمان في جميع الممرات' },
        { title: 'عدوى الجهاز التنفسي', description: 'خطر انتشار العدوى التنفسية بين المستفيدين', category: 'clinical', risk_score: 16, probability: 4, impact: 4, status: 'mitigating', owner: 'مدير الخدمات الطبية', mitigation_plan: 'بروتوكول عزل وتطعيم' },
        { title: 'نقص الكوادر التمريضية', description: 'عدم كفاية عدد الممرضين لتغطية الورديات', category: 'operational', risk_score: 12, probability: 3, impact: 4, status: 'open', owner: 'مدير الموارد البشرية', mitigation_plan: 'التعاقد مع شركة توظيف' },
        { title: 'تأخر صيانة المعدات الطبية', description: 'تأخر في صيانة أجهزة الأكسجين والمراقبة', category: 'infrastructure', risk_score: 12, probability: 3, impact: 4, status: 'mitigating', owner: 'مدير الصيانة', mitigation_plan: 'عقد صيانة سنوي' },
        { title: 'مخاطر الحريق', description: 'احتمال نشوب حريق في المبنى القديم', category: 'safety', risk_score: 14, probability: 2, impact: 5, status: 'mitigating', owner: 'مسؤول السلامة', mitigation_plan: 'تحديث نظام الإنذار' },
        { title: 'انقطاع التواصل مع الأسر', description: 'عدم متابعة بعض الأسر لأبنائهم', category: 'social', risk_score: 10, probability: 4, impact: 3, status: 'open', owner: 'مدير الخدمات الاجتماعية', mitigation_plan: 'برنامج تواصل شهري' },
        { title: 'مخاطر الإعاشة', description: 'جودة الطعام والنظافة', category: 'clinical', risk_score: 9, probability: 3, impact: 3, status: 'mitigating', owner: 'مشرف الإعاشة', mitigation_plan: 'فحوصات يومية' },
        { title: 'تسريب بيانات', description: 'خطر تسريب البيانات الشخصية للمستفيدين', category: 'operational', risk_score: 15, probability: 2, impact: 5, status: 'mitigating', owner: 'مسؤول تقنية المعلومات', mitigation_plan: 'تشفير البيانات وتدريب الموظفين' },
        { title: 'نقص الأدوية', description: 'احتمال نفاد بعض الأدوية الأساسية', category: 'clinical', risk_score: 12, probability: 3, impact: 4, status: 'open', owner: 'مدير الصيدلية', mitigation_plan: 'نظام إنذار مبكر للمخزون' },
        { title: 'حوادث العنف', description: 'سلوك عدواني بين بعض المستفيدين', category: 'safety', risk_score: 14, probability: 3, impact: 4, status: 'mitigating', owner: 'الأخصائي النفسي', mitigation_plan: 'خطط تدخل سلوكي' },
        { title: 'عدم الامتثال لمعايير الجودة', description: 'فجوات في الامتثال لمعايير ISO', category: 'operational', risk_score: 8, probability: 2, impact: 4, status: 'mitigating', owner: 'منسق الجودة', mitigation_plan: 'مراجعات دورية' },
        { title: 'مخاطر الإخلاء الطارئ', description: 'صعوبة إخلاء المستفيدين في حالات الطوارئ', category: 'safety', risk_score: 15, probability: 2, impact: 5, status: 'open', owner: 'مسؤول السلامة', mitigation_plan: 'تدريبات إخلاء ربع سنوية' },
    ];

    const grcNcrs = [
        { title: 'توثيق غير مكتمل للخطط التأهيلية', description: 'وجود خطط تأهيلية بدون توقيع المدير', category: 'documentation', severity: 'major', status: 'corrective_action', progress: 60, due_date: '2024-02-15', assigned_to: 'منسق الجودة' },
        { title: 'تأخر في تحديث السجلات الطبية', description: 'سجلات 5 مستفيدين لم تُحدث منذ 3 أشهر', category: 'medical', severity: 'major', status: 'investigating', progress: 30, due_date: '2024-02-20', assigned_to: 'مدير الخدمات الطبية' },
        { title: 'مخالفة نظافة في المطبخ', description: 'وجود مخالفة نظافة خلال الفحص الدوري', category: 'catering', severity: 'minor', status: 'corrective_action', progress: 80, due_date: '2024-02-10', assigned_to: 'مشرف الإعاشة' },
    ];

    const grcCompliance = [
        { requirement: 'توثيق جميع الحوادث خلال 24 ساعة', standard: 'ISO 9001:2015', category: 'documentation', status: 'compliant', notes: 'نظام إلكتروني مفعل', last_audit_date: '2024-01-15', next_audit_date: '2024-04-15' },
        { requirement: 'خطة تأهيلية لكل مستفيد', standard: 'معايير الوزارة', category: 'care', status: 'partial', notes: '85% من المستفيدين لديهم خطط', last_audit_date: '2024-01-10', next_audit_date: '2024-04-10' },
        { requirement: 'تدريب الموظفين على السلامة', standard: 'OSHA', category: 'safety', status: 'compliant', notes: 'تم تدريب جميع الموظفين', last_audit_date: '2024-01-20', next_audit_date: '2024-07-20' },
        { requirement: 'فحص معدات الإطفاء', standard: 'كود البناء السعودي', category: 'safety', status: 'compliant', notes: 'فحص شهري', last_audit_date: '2024-01-25', next_audit_date: '2024-02-25' },
        { requirement: 'سرية البيانات الشخصية', standard: 'نظام حماية البيانات', category: 'privacy', status: 'partial', notes: 'جاري تحديث السياسات', last_audit_date: '2024-01-05', next_audit_date: '2024-04-05' },
        { requirement: 'فحص جودة الطعام', standard: 'هيئة الغذاء والدواء', category: 'catering', status: 'compliant', notes: 'فحوصات أسبوعية', last_audit_date: '2024-01-28', next_audit_date: '2024-02-28' },
        { requirement: 'إجراءات العزل الصحي', standard: 'CDC Guidelines', category: 'medical', status: 'in_progress', notes: 'جاري تحديث البروتوكول', last_audit_date: '2024-01-12', next_audit_date: '2024-03-12' },
        { requirement: 'تقييم المخاطر السنوي', standard: 'ISO 31000', category: 'risk', status: 'partial', notes: 'تم تقييم 70% من المخاطر', last_audit_date: '2024-01-08', next_audit_date: '2025-01-08' },
        { requirement: 'خطة الاستجابة للطوارئ', standard: 'الدفاع المدني', category: 'emergency', status: 'compliant', notes: 'خطة معتمدة ومفعلة', last_audit_date: '2024-01-18', next_audit_date: '2024-07-18' },
    ];

    // Try to insert GRC data
    console.log('\n📊 Inserting GRC Risks...');
    const { data: risksData, error: risksError } = await supabase
        .from('grc_risks')
        .upsert(grcRisks, { onConflict: 'title' })
        .select();

    if (risksError) {
        console.log('   ❌ GRC Risks failed:', risksError.message);
        console.log('\n⚠️  GRC tables need to be created first!');
        console.log('   Please run this SQL in Supabase Dashboard SQL Editor:');
        console.log('   File: supabase/migrations/04_grc_tables.sql\n');
        return false;
    } else {
        console.log(`   ✅ Inserted ${risksData?.length || 0} risks`);
    }

    console.log('\n📊 Inserting GRC NCRs...');
    const { data: ncrsData, error: ncrsError } = await supabase
        .from('grc_ncrs')
        .upsert(grcNcrs, { onConflict: 'title' })
        .select();

    if (ncrsError) {
        console.log('   ❌ GRC NCRs failed:', ncrsError.message);
    } else {
        console.log(`   ✅ Inserted ${ncrsData?.length || 0} NCRs`);
    }

    console.log('\n📊 Inserting GRC Compliance...');
    const { data: complianceData, error: complianceError } = await supabase
        .from('grc_compliance')
        .upsert(grcCompliance, { onConflict: 'requirement' })
        .select();

    if (complianceError) {
        console.log('   ❌ GRC Compliance failed:', complianceError.message);
    } else {
        console.log(`   ✅ Inserted ${complianceData?.length || 0} compliance records`);
    }

    return true;
}

async function main() {
    try {
        const grcExists = await checkTables();

        if (!grcExists) {
            console.log('\n⚠️  GRC tables do not exist in the database.');
            console.log('   You need to run the SQL migration first.');
            console.log('\n📝 Instructions:');
            console.log('   1. Go to: https://supabase.com/dashboard/project/ruesovrbhcjphmfdcpsa/sql');
            console.log('   2. Open file: supabase/migrations/04_grc_tables.sql');
            console.log('   3. Copy the SQL and run it in the SQL Editor');
            console.log('\n   After that, run this script again to seed the data.');
        } else {
            await createGrcTables();
            console.log('\n✨ Database check complete!');
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
}

main();
