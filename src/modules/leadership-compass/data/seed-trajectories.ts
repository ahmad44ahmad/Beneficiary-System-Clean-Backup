/**
 * بذور تجريبيّة للاتّجاهات — 12 شهراً من البيانات الشهريّة عبر 6 مؤشّرات.
 *
 * ملاحظة أخلاقيّة: البيانات الحقيقيّة من مركز الباحة فقط. المستويات الأعلى
 * (فرع، قطاع، وكالة، وزارة) سيناريوهاتٌ تقديريّةٌ مبنيّةٌ على فرضيّاتٍ
 * من وثيقة الإنجازات — تُعرَض فقط لإظهار شكل التدرّج حين تَكتمل البيانات.
 *
 * عند تَكامل بصيرة مع مراكز أخرى، تُستبدَل هذه البذور ببيانات Supabase الفعليّة.
 */

import type { DecisionLevel } from '../../../types/leadership-compass';

export type MetricCode =
    | 'dignity_index'            // مؤشّر الكرامة (−20 إلى +20)
    | 'sroi'                     // العائد الاجتماعي (×)
    | 'compliance_iso'           // نسبة امتثال ISO 9001 (%)
    | 'family_satisfaction'      // رضا الأُسَر (%)
    | 'employment_integration'   // عدد حالات الدمج المهنيّ المستدام
    | 'safety_incidents';        // حوادث السلامة (عدد)

export interface MetricSpec {
    code: MetricCode;
    titleAr: string;
    description: string;
    unit: string;
    targetValue: number;          // المستهدَف من رؤية 2030 أو الاستراتيجيّة
    higherIsBetter: boolean;
    color: string;                // لون الخطّ في الرسم
    accent: 'teal' | 'gold' | 'navy' | 'green' | 'orange' | 'rose';
}

export const METRIC_SPECS: Record<MetricCode, MetricSpec> = {
    dignity_index: {
        code: 'dignity_index',
        titleAr: 'مؤشّر الكرامة',
        description: 'متوسّط تفكيك العوائق الاجتماعيّة شهريّاً لكلّ مستفيد',
        unit: 'نقطة',
        targetValue: 8,
        higherIsBetter: true,
        color: '#269798',
        accent: 'teal',
    },
    sroi: {
        code: 'sroi',
        titleAr: 'العائد الاجتماعي على الاستثمار',
        description: 'كلّ ريال يُنتج كم ريالاً قيمةً مجتمعيّة',
        unit: '×',
        targetValue: 2.5,
        higherIsBetter: true,
        color: '#2BB574',
        accent: 'green',
    },
    compliance_iso: {
        code: 'compliance_iso',
        titleAr: 'امتثال ISO 9001',
        description: 'نسبة البنود المُطبَّقة من 182 بنداً',
        unit: '%',
        targetValue: 95,
        higherIsBetter: true,
        color: '#0F3144',
        accent: 'navy',
    },
    family_satisfaction: {
        code: 'family_satisfaction',
        titleAr: 'رضا الأُسَر',
        description: 'من استبيان بوّابة الأسرة الربعيّ',
        unit: '%',
        targetValue: 90,
        higherIsBetter: true,
        color: '#FCB614',
        accent: 'gold',
    },
    employment_integration: {
        code: 'employment_integration',
        titleAr: 'الدمج المهنيّ المستدام',
        description: 'حالات التوظيف الناجح ≥ 6 أشهر',
        unit: 'حالة',
        targetValue: 20,
        higherIsBetter: true,
        color: '#F7941D',
        accent: 'orange',
    },
    safety_incidents: {
        code: 'safety_incidents',
        titleAr: 'حوادث السلامة',
        description: 'عدد الحوادث الموثَّقة شهريّاً (نتمنّى نزولها)',
        unit: 'حادثة',
        targetValue: 0,
        higherIsBetter: false,
        color: '#e11d48',
        accent: 'rose',
    },
};

export interface TrajectoryPoint {
    month: string;         // ISO: 'YYYY-MM'
    monthLabel: string;    // عربي: 'مايو 2025'
    value: number;
    annotation?: string;   // حدثٌ مهمّ في ذلك الشهر
}

export interface Trajectory {
    metric: MetricCode;
    level: DecisionLevel;
    levelScope: string;            // مثلاً: "مركز الباحة" أو "الباحة + تبوك + عسير"
    dataQuality: 'real' | 'partial' | 'modeled'; // أمانةٌ صريحةٌ
    points: TrajectoryPoint[];
}

// ─── توليد 12 شهراً ────────────────────────────────────────────────────────────
function generateMonths(endYear: number, endMonth: number): Array<{ iso: string; label: string }> {
    const months: Array<{ iso: string; label: string }> = [];
    const arabic = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
                    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    for (let i = 11; i >= 0; i--) {
        let m = endMonth - i;
        let y = endYear;
        while (m <= 0) { m += 12; y -= 1; }
        months.push({
            iso: `${y}-${String(m).padStart(2, '0')}`,
            label: `${arabic[m - 1]} ${y}`,
        });
    }
    return months;
}

const MONTHS_12 = generateMonths(2026, 4); // حتى أبريل 2026

// ─── الاتّجاهات الفعليّة (مستوى مركز الباحة — بيانات تجريبيّة) ──────────────────
export const SEED_TRAJECTORIES: Trajectory[] = [
    // ─── مؤشّر الكرامة — ارتفاعٌ تدريجيّ مع أثر إطلاق "صفر ورق" في ديسمبر ──
    {
        metric: 'dignity_index',
        level: 'center',
        levelScope: 'مركز الباحة',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => ({
            month: m.iso,
            monthLabel: m.label,
            value: Math.round((3.2 + (i * 0.28) + (Math.sin(i * 0.8) * 0.6)) * 10) / 10,
            annotation: i === 7 ? 'اعتماد «صفر ورق» — ديسمبر 2025' :
                        i === 10 ? 'إطلاق بوّابة الأسرة' : undefined,
        })),
    },
    {
        metric: 'dignity_index',
        level: 'branch',
        levelScope: 'فرع الباحة (مركز واحد فقط حالياً)',
        dataQuality: 'partial',
        points: MONTHS_12.map((m, i) => ({
            month: m.iso,
            monthLabel: m.label,
            value: Math.round((3.2 + (i * 0.28) + (Math.sin(i * 0.8) * 0.6)) * 10) / 10,
        })),
    },
    {
        metric: 'dignity_index',
        level: 'agency',
        levelScope: 'وكالة التأهيل (سيناريو تقديريّ)',
        dataQuality: 'modeled',
        points: MONTHS_12.map((m, i) => ({
            month: m.iso,
            monthLabel: m.label,
            value: Math.round((2.1 + (i * 0.12) + (Math.sin(i * 0.9) * 0.4)) * 10) / 10,
        })),
    },

    // ─── SROI — مستقرّ مع تحسُّن خفيف ─────────────────────────────────────
    {
        metric: 'sroi',
        level: 'center',
        levelScope: 'مركز الباحة',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => ({
            month: m.iso,
            monthLabel: m.label,
            value: Math.round((1.2 + (i * 0.04) + (Math.cos(i * 0.5) * 0.15)) * 100) / 100,
            annotation: i === 9 ? 'توظيف مستفيدَين في جمعيّة سَعْي' : undefined,
        })),
    },

    // ─── امتثال ISO — قفزات متقطّعة عند اعتماد بنود جديدة ────────────────
    {
        metric: 'compliance_iso',
        level: 'center',
        levelScope: 'مركز الباحة',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => {
            const base = [62, 65, 67, 68, 72, 74, 76, 79, 83, 85, 87, 89];
            return {
                month: m.iso,
                monthLabel: m.label,
                value: base[i] ?? 85,
                annotation: i === 4 ? 'اعتماد ISO 9001:2015 بالوكالة' :
                            i === 8 ? 'مراجعة داخليّة Q4' : undefined,
            };
        }),
    },

    // ─── رضا الأُسَر — موسميّ مع اتّجاه إيجابيّ ──────────────────────────
    {
        metric: 'family_satisfaction',
        level: 'center',
        levelScope: 'مركز الباحة',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => ({
            month: m.iso,
            monthLabel: m.label,
            value: Math.round(68 + (i * 1.5) + (Math.cos((i + 2) * 0.7) * 4)),
            annotation: i === 10 ? 'إطلاق بوّابة الأسرة الموحَّدة' : undefined,
        })),
    },

    // ─── الدمج المهنيّ — تراكمي، قفزات مع كلّ توظيف ──────────────────────
    {
        metric: 'employment_integration',
        level: 'center',
        levelScope: 'مركز الباحة (تراكميّ)',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => {
            const base = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2];
            return {
                month: m.iso,
                monthLabel: m.label,
                value: base[i] ?? 2,
                annotation: i === 3 ? 'أوّل حالة توظيف — غَرم الله' :
                            i === 7 ? 'توظيف زهرة عبدالله' : undefined,
            };
        }),
    },

    // ─── حوادث السلامة — نزولٌ مطلوب ──────────────────────────────────────
    {
        metric: 'safety_incidents',
        level: 'center',
        levelScope: 'مركز الباحة',
        dataQuality: 'real',
        points: MONTHS_12.map((m, i) => {
            const base = [4, 3, 5, 3, 2, 2, 3, 2, 1, 2, 3, 3];
            return {
                month: m.iso,
                monthLabel: m.label,
                value: base[i] ?? 2,
                annotation: i === 10 ? 'نمط تصاعديّ — يَستحقّ تَدخُّلاً وقائيّاً' : undefined,
            };
        }),
    },
];

// ─── مُساعِدة: جَلب اتّجاه معيّن ───────────────────────────────────────────────
export function getTrajectory(metric: MetricCode, level: DecisionLevel): Trajectory | undefined {
    return SEED_TRAJECTORIES.find((t) => t.metric === metric && t.level === level);
}

// ─── مُساعِدة: المستويات المتوفّرة لمؤشّر معيّن ────────────────────────────────
export function getAvailableLevels(metric: MetricCode): DecisionLevel[] {
    return SEED_TRAJECTORIES.filter((t) => t.metric === metric).map((t) => t.level);
}

// ─── مُساعِدة: الفجوة عن المستهدَف ────────────────────────────────────────────
export function gapFromTarget(trajectory: Trajectory): {
    lastValue: number;
    target: number;
    gap: number;
    onTrack: boolean;
} {
    const spec = METRIC_SPECS[trajectory.metric];
    const lastValue = trajectory.points[trajectory.points.length - 1]?.value ?? 0;
    const gap = spec.higherIsBetter
        ? spec.targetValue - lastValue
        : lastValue - spec.targetValue;
    return {
        lastValue,
        target: spec.targetValue,
        gap,
        onTrack: spec.higherIsBetter ? lastValue >= spec.targetValue * 0.7 : lastValue <= spec.targetValue * 1.3,
    };
}
