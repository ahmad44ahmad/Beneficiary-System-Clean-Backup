// ═══════════════════════════════════════════════════════════════════════════
// DataSeeder Service - Seeds demo data if database tables are empty
// Ensures the application has data to display for demonstrations
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../config/supabase';
import { SEED_BENEFICIARIES, type SeedBeneficiary } from '../data/domain-assets';

// Transform SEED_BENEFICIARIES to database format
const DEMO_BENEFICIARIES = SEED_BENEFICIARIES.map((b: SeedBeneficiary) => ({
    full_name: b.fullName,
    national_id: b.nationalId,
    date_of_birth: b.birthDate,
    gender: b.gender,
    blood_type: 'O+',
    admission_date: b.admissionDate,
    status: b.status,
    room_number: b.room || '',
    disability_type: b.diagnosis.arabic,
    emergency_contact_name: b.guardian.name,
    emergency_contact_phone: b.guardian.phone
}));

// Demo risks data for GRC
const DEMO_RISKS = [
    {
        code: 'CLIN-01',
        title: 'الأخطاء الدوائية',
        description: 'مخاطر الأخطاء في صرف أو إعطاء الأدوية',
        category: 'clinical',
        likelihood: 'medium',
        impact: 'high',
        risk_score: 12,
        status: 'mitigated',
        owner: 'رئيس التمريض',
        mitigation_plan: 'نظام التحقق المزدوج والحقوق الخمسة'
    },
    {
        code: 'SAF-01',
        title: 'مخاطر السقوط',
        description: 'سقوط المستفيدين خاصة كبار السن',
        category: 'safety',
        likelihood: 'high',
        impact: 'high',
        risk_score: 16,
        status: 'open',
        owner: 'مشرف السلامة',
        mitigation_plan: 'تقييم مخاطر السقوط ومراقبة مستمرة'
    },
    {
        code: 'OPS-01',
        title: 'انقطاع الكهرباء',
        description: 'انقطاع مفاجئ للتيار الكهربائي',
        category: 'operational',
        likelihood: 'low',
        impact: 'critical',
        risk_score: 10,
        status: 'mitigated',
        owner: 'مدير التشغيل',
        mitigation_plan: 'مولدات احتياطية واختبارات دورية'
    }
];

// Demo audit logs
const DEMO_AUDIT_LOGS = [
    {
        user_id: 'seed-user-1',
        user_name: 'مدير النظام',
        user_role: 'admin',
        action: 'create',
        module: 'system',
        description: 'تهيئة بيانات النظام التجريبية',
        success: true,
        timestamp: new Date().toISOString()
    }
];

/**
 * Check if a table has data
 */
async function isTableEmpty(tableName: string): Promise<boolean> {
    if (!supabase) return true;

    try {
        const { data, error } = await supabase
            .from(tableName)
            .select('id')
            .limit(1);

        if (error) {
            console.log(`[DataSeeder] Table ${tableName} check error:`, error.message);
            return true;
        }

        return !data || data.length === 0;
    } catch (err) {
        return true;
    }
}

/**
 * Seed beneficiaries table
 */
async function seedBeneficiaries(): Promise<number> {
    if (!supabase) return 0;

    if (!(await isTableEmpty('beneficiaries'))) {
        console.log('[DataSeeder] Beneficiaries table not empty, skipping...');
        return 0;
    }

    const { data, error } = await supabase
        .from('beneficiaries')
        .insert(DEMO_BENEFICIARIES)
        .select();

    if (error) {
        console.error('[DataSeeder] Error seeding beneficiaries:', error.message);
        return 0;
    }

    console.log(`[DataSeeder] Seeded ${data?.length || 0} beneficiaries`);
    return data?.length || 0;
}

/**
 * Seed risks table for GRC
 */
async function seedRisks(): Promise<number> {
    if (!supabase) return 0;

    if (!(await isTableEmpty('grc_risks'))) {
        console.log('[DataSeeder] Risks table not empty, skipping...');
        return 0;
    }

    const { data, error } = await supabase
        .from('grc_risks')
        .insert(DEMO_RISKS)
        .select();

    if (error) {
        console.error('[DataSeeder] Error seeding risks:', error.message);
        return 0;
    }

    console.log(`[DataSeeder] Seeded ${data?.length || 0} risks`);
    return data?.length || 0;
}

/**
 * Seed audit logs
 */
async function seedAuditLogs(): Promise<number> {
    if (!supabase) return 0;

    if (!(await isTableEmpty('audit_logs'))) {
        console.log('[DataSeeder] Audit logs table not empty, skipping...');
        return 0;
    }

    const { data, error } = await supabase
        .from('audit_logs')
        .insert(DEMO_AUDIT_LOGS)
        .select();

    if (error) {
        console.error('[DataSeeder] Error seeding audit logs:', error.message);
        return 0;
    }

    console.log(`[DataSeeder] Seeded ${data?.length || 0} audit logs`);
    return data?.length || 0;
}

/**
 * Main seeding function - seeds all empty tables
 */
export async function seedDemoData(): Promise<{
    beneficiaries: number;
    risks: number;
    auditLogs: number;
    success: boolean;
}> {
    console.log('[DataSeeder] Starting demo data seeding...');

    const results = {
        beneficiaries: 0,
        risks: 0,
        auditLogs: 0,
        success: false
    };

    if (!supabase) {
        console.log('[DataSeeder] No Supabase connection, skipping seeding');
        return results;
    }

    try {
        results.beneficiaries = await seedBeneficiaries();
        results.risks = await seedRisks();
        results.auditLogs = await seedAuditLogs();
        results.success = true;

        console.log('[DataSeeder] Seeding complete:', results);
    } catch (err) {
        console.error('[DataSeeder] Seeding failed:', err);
    }

    return results;
}

/**
 * Initialize seeder on app startup (call this in index.tsx or App.tsx)
 */
export async function initializeDataSeeder(): Promise<void> {
    // Only seed in development or if explicitly enabled
    if (import.meta.env.PROD && !import.meta.env.VITE_ENABLE_SEEDING) {
        return;
    }

    await seedDemoData();
}

export default {
    seedDemoData,
    initializeDataSeeder,
    isTableEmpty
};
