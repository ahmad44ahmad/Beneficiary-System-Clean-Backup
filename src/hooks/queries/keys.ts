// src/hooks/queries/keys.ts
// Centralized query keys for TanStack Query
// This ensures consistent cache invalidation across the app

export const queryKeys = {
    // ═══════════════════════════════════════════════════════════════
    // المستفيدين (Beneficiaries)
    // ═══════════════════════════════════════════════════════════════
    beneficiaries: {
        all: ['beneficiaries'] as const,
        lists: () => [...queryKeys.beneficiaries.all, 'list'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.beneficiaries.lists(), filters] as const,
        details: () => [...queryKeys.beneficiaries.all, 'detail'] as const,
        detail: (id: string) => [...queryKeys.beneficiaries.details(), id] as const,
        stats: () => [...queryKeys.beneficiaries.all, 'stats'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // GRC (Governance, Risk, Compliance)
    // ═══════════════════════════════════════════════════════════════
    grc: {
        all: ['grc'] as const,
        risks: () => [...queryKeys.grc.all, 'risks'] as const,
        risk: (id: string) => [...queryKeys.grc.risks(), id] as const,
        compliance: () => [...queryKeys.grc.all, 'compliance'] as const,
        ncrs: () => [...queryKeys.grc.all, 'ncrs'] as const,
        stats: () => [...queryKeys.grc.all, 'stats'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الطبي (Medical)
    // ═══════════════════════════════════════════════════════════════
    medical: {
        all: ['medical'] as const,
        profiles: () => [...queryKeys.medical.all, 'profiles'] as const,
        profile: (beneficiaryId: string) => [...queryKeys.medical.profiles(), beneficiaryId] as const,
        vitals: (beneficiaryId: string) => [...queryKeys.medical.all, 'vitals', beneficiaryId] as const,
        medications: () => [...queryKeys.medical.all, 'medications'] as const,
        medication: (id: string) => [...queryKeys.medical.medications(), id] as const,
        fullProfile: (nationalId: string) => [...queryKeys.medical.all, 'fullProfile', nationalId] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الحوادث (Incidents)
    // ═══════════════════════════════════════════════════════════════
    incidents: {
        all: ['incidents'] as const,
        list: (filters?: Record<string, unknown>) => [...queryKeys.incidents.all, 'list', filters] as const,
        detail: (id: string) => [...queryKeys.incidents.all, 'detail', id] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الرعاية اليومية (Care)
    // ═══════════════════════════════════════════════════════════════
    care: {
        all: ['care'] as const,
        dailyLog: (beneficiaryId: string, date: string) => [...queryKeys.care.all, 'dailyLog', beneficiaryId, date] as const,
        fallRiskAssessments: (beneficiaryId?: string) => [...queryKeys.care.all, 'fallRisk', beneficiaryId] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الإعاشة (Catering)
    // ═══════════════════════════════════════════════════════════════
    catering: {
        all: ['catering'] as const,
        meals: (date?: string) => [...queryKeys.catering.all, 'meals', date] as const,
        dietary: (beneficiaryId: string) => [...queryKeys.catering.all, 'dietary', beneficiaryId] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الصيانة (Maintenance)
    // ═══════════════════════════════════════════════════════════════
    maintenance: {
        all: ['maintenance'] as const,
        requests: (status?: string) => [...queryKeys.maintenance.all, 'requests', status] as const,
        assets: () => [...queryKeys.maintenance.all, 'assets'] as const,
        schedules: () => [...queryKeys.maintenance.all, 'schedules'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // التنبيهات (Alerts)
    // ═══════════════════════════════════════════════════════════════
    alerts: {
        all: ['alerts'] as const,
        list: () => [...queryKeys.alerts.all, 'list'] as const,
        overdueMedications: () => [...queryKeys.alerts.all, 'overdueMedications'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // التدقيق (Audit)
    // ═══════════════════════════════════════════════════════════════
    audit: {
        all: ['audit'] as const,
        logs: () => [...queryKeys.audit.all, 'logs'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // المؤشرات (Indicators)
    // ═══════════════════════════════════════════════════════════════
    indicators: {
        all: ['indicators'] as const,
        iso: () => [...queryKeys.indicators.all, 'iso'] as const,
        earlyWarning: () => [...queryKeys.indicators.all, 'earlyWarning'] as const,
        benchmark: () => [...queryKeys.indicators.all, 'benchmark'] as const,
        cost: () => [...queryKeys.indicators.all, 'cost'] as const,
    },

    // ═══════════════════════════════════════════════════════════════
    // الإحصائيات (Statistics)
    // ═══════════════════════════════════════════════════════════════
    stats: {
        dashboard: () => ['stats', 'dashboard'] as const,
        kpis: () => ['stats', 'kpis'] as const,
        wellbeing: () => ['stats', 'wellbeing'] as const,
    },
};

// تكوينات الـ Query حسب نوع البيانات
export const queryConfigs = {
    // البيانات الحرجة - تحديث فوري (الأدوية، العلامات الحيوية)
    critical: {
        staleTime: 0,
        refetchInterval: 1000 * 10, // كل 10 ثواني
    },
    // البيانات العادية
    normal: {
        staleTime: 1000 * 60, // دقيقة
    },
    // البيانات الثابتة (الإعدادات، القوائم المرجعية)
    static: {
        staleTime: 1000 * 60 * 5, // 5 دقائق
    },
};
