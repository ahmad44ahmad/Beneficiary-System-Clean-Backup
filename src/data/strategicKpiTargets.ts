// Strategic KPI Targets - المؤشرات الاستراتيجية مع القيم المستهدفة
// Based on Ministry of Human Resources and Social Development standards

export interface StrategicKPI {
    code: string;
    nameAr: string;
    nameEn: string;
    category: 'care' | 'safety' | 'satisfaction' | 'operations';
    categoryAr: string;
    target: number;
    unit: string;
    unitAr: string;
    direction: 'higher_is_better' | 'lower_is_better';
    thresholds: {
        excellent: number;
        good: number;
        needsImprovement: number;
    };
    currentValue: number;
    previousValue: number;
    dataSource: string;
    description: string;
    icon: string;
}

export const STRATEGIC_KPIS: StrategicKPI[] = [
    {
        code: 'CARE-COMP',
        nameAr: 'نسبة إتمام خطة الرعاية',
        nameEn: 'Care Plan Completion Rate',
        category: 'care',
        categoryAr: 'الرعاية',
        target: 95,
        unit: '%',
        unitAr: '%',
        direction: 'higher_is_better',
        thresholds: { excellent: 95, good: 85, needsImprovement: 75 },
        currentValue: 88,
        previousValue: 82,
        dataSource: 'daily_care_logs',
        description: 'نسبة خطط الرعاية المكتملة لجميع المستفيدين النشطين',
        icon: 'ClipboardCheck'
    },
    {
        code: 'FALL-RATE',
        nameAr: 'معدل السقوط',
        nameEn: 'Fall Rate',
        category: 'safety',
        categoryAr: 'السلامة',
        target: 2,
        unit: '/1000 days',
        unitAr: '/1000 يوم رعاية',
        direction: 'lower_is_better',
        thresholds: { excellent: 1, good: 3, needsImprovement: 5 },
        currentValue: 3.1,
        previousValue: 4.2,
        dataSource: 'fall_risk_assessments',
        description: 'عدد حالات السقوط لكل 1000 يوم رعاية',
        icon: 'AlertTriangle'
    },
    {
        code: 'HAND-HYG',
        nameAr: 'امتثال نظافة الأيدي',
        nameEn: 'Hand Hygiene Compliance',
        category: 'safety',
        categoryAr: 'السلامة',
        target: 90,
        unit: '%',
        unitAr: '%',
        direction: 'higher_is_better',
        thresholds: { excellent: 95, good: 85, needsImprovement: 75 },
        currentValue: 87,
        previousValue: 79,
        dataSource: 'ipc_inspections',
        description: 'نسبة الامتثال للحظات الخمس لنظافة الأيدي (WHO)',
        icon: 'Hand'
    },
    {
        code: 'ALERT-RESP',
        nameAr: 'متوسط وقت الاستجابة للتنبيه',
        nameEn: 'Alert Response Time',
        category: 'care',
        categoryAr: 'الرعاية',
        target: 15,
        unit: 'min',
        unitAr: 'دقيقة',
        direction: 'lower_is_better',
        thresholds: { excellent: 10, good: 20, needsImprovement: 30 },
        currentValue: 18,
        previousValue: 25,
        dataSource: 'alerts',
        description: 'متوسط الوقت بالدقائق من إطلاق التنبيه حتى الاستجابة',
        icon: 'Bell'
    },
    {
        code: 'FAM-SAT',
        nameAr: 'رضا الأسر',
        nameEn: 'Family Satisfaction',
        category: 'satisfaction',
        categoryAr: 'الرضا',
        target: 85,
        unit: '%',
        unitAr: '%',
        direction: 'higher_is_better',
        thresholds: { excellent: 90, good: 80, needsImprovement: 70 },
        currentValue: 82,
        previousValue: 76,
        dataSource: 'family_surveys',
        description: 'نسبة رضا أسر المستفيدين بناءً على الاستبيانات الدورية',
        icon: 'Heart'
    },
    {
        code: 'COST-DAY',
        nameAr: 'التكلفة اليومية لكل مستفيد',
        nameEn: 'Daily Cost per Beneficiary',
        category: 'operations',
        categoryAr: 'العمليات',
        target: 350,
        unit: 'SAR',
        unitAr: 'ريال',
        direction: 'lower_is_better',
        thresholds: { excellent: 300, good: 400, needsImprovement: 500 },
        currentValue: 385,
        previousValue: 420,
        dataSource: 'cost_tracking',
        description: 'إجمالي التكاليف الشهرية مقسوماً على عدد المستفيدين × أيام الشهر',
        icon: 'DollarSign'
    },
    {
        code: 'HANDOVER',
        nameAr: 'تسليم المناوبة بالوقت',
        nameEn: 'Shift Handover Compliance',
        category: 'operations',
        categoryAr: 'العمليات',
        target: 95,
        unit: '%',
        unitAr: '%',
        direction: 'higher_is_better',
        thresholds: { excellent: 98, good: 90, needsImprovement: 80 },
        currentValue: 91,
        previousValue: 85,
        dataSource: 'shift_handover_reports',
        description: 'نسبة تقارير تسليم المناوبة المكتملة في الوقت المحدد',
        icon: 'RefreshCw'
    },
    {
        code: 'PREV-MAINT',
        nameAr: 'الصيانة الوقائية',
        nameEn: 'Preventive Maintenance Compliance',
        category: 'operations',
        categoryAr: 'العمليات',
        target: 90,
        unit: '%',
        unitAr: '%',
        direction: 'higher_is_better',
        thresholds: { excellent: 95, good: 85, needsImprovement: 75 },
        currentValue: 86,
        previousValue: 78,
        dataSource: 'om_preventive_schedules',
        description: 'نسبة أعمال الصيانة الوقائية المنفذة حسب الجدول',
        icon: 'Wrench'
    }
];

export const KPI_CATEGORIES = [
    { key: 'all', labelAr: 'الكل', color: '#6B7280' },
    { key: 'care', labelAr: 'الرعاية', color: '#10B981' },
    { key: 'safety', labelAr: 'السلامة', color: '#F59E0B' },
    { key: 'satisfaction', labelAr: 'الرضا', color: '#8B5CF6' },
    { key: 'operations', labelAr: 'العمليات', color: '#3B82F6' },
] as const;

// Monthly trend data for charts
export const KPI_MONTHLY_TRENDS = [
    { month: 'سبتمبر', 'CARE-COMP': 80, 'FALL-RATE': 4.5, 'HAND-HYG': 76, 'ALERT-RESP': 28, 'FAM-SAT': 73, 'COST-DAY': 435, 'HANDOVER': 82, 'PREV-MAINT': 74 },
    { month: 'أكتوبر', 'CARE-COMP': 82, 'FALL-RATE': 4.2, 'HAND-HYG': 79, 'ALERT-RESP': 25, 'FAM-SAT': 76, 'COST-DAY': 420, 'HANDOVER': 85, 'PREV-MAINT': 78 },
    { month: 'نوفمبر', 'CARE-COMP': 84, 'FALL-RATE': 3.8, 'HAND-HYG': 82, 'ALERT-RESP': 22, 'FAM-SAT': 78, 'COST-DAY': 405, 'HANDOVER': 87, 'PREV-MAINT': 81 },
    { month: 'ديسمبر', 'CARE-COMP': 85, 'FALL-RATE': 3.5, 'HAND-HYG': 84, 'ALERT-RESP': 20, 'FAM-SAT': 79, 'COST-DAY': 395, 'HANDOVER': 89, 'PREV-MAINT': 83 },
    { month: 'يناير', 'CARE-COMP': 86, 'FALL-RATE': 3.3, 'HAND-HYG': 85, 'ALERT-RESP': 19, 'FAM-SAT': 80, 'COST-DAY': 390, 'HANDOVER': 90, 'PREV-MAINT': 84 },
    { month: 'فبراير', 'CARE-COMP': 88, 'FALL-RATE': 3.1, 'HAND-HYG': 87, 'ALERT-RESP': 18, 'FAM-SAT': 82, 'COST-DAY': 385, 'HANDOVER': 91, 'PREV-MAINT': 86 },
];
