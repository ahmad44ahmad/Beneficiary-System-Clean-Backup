/**
 * مرجع موحَّد لافتراضات احتساب العائد الاجتماعي على الاستثمار (SROI).
 * مبني على منهجية NEF/SSE (New Economics Foundation / School for Social Entrepreneurs)
 * مع تطبيق مُعاملات الخصم الأربعة: deadweight, attribution, displacement, drop-off.
 *
 * تُستخدم في كلٍّ من:
 * - SROICard.tsx (الواجهة المختصرة في لوحة القيادة)
 * - SroiDashboard.tsx (لوحة التفاصيل التفاعلية)
 */

export const SROI_ASSUMPTIONS = {
    /** ميزانية شهرية مرجعية لمركز التأهيل (ريال سعودي) */
    monthlyInvestment: 150_000,

    /** نسبة المستفيدين الذين كانوا سيحققون النتائج بدون التدخل (deadweight) */
    deadweight: 0.25,

    /** الحصة المنسوبة لأطراف أخرى — أسرة، مؤسسات أخرى (attribution) */
    attribution: 0.30,

    /** نسبة الإزاحة — أثر سلبي محتمل على أطراف أخرى (displacement) */
    displacement: 0.05,

    /** تراجع الأثر السنوي مع مرور الوقت (drop-off) */
    annualDropoff: 0.15,

    /** نسبة الادّخار من تكلفة المستفيد عند نجاح خطة التأهيل */
    costSavingsPerSuccess: 0.40,

    /** متوسط تكلفة المستفيد الشهرية (ريال) */
    avgCostPerBeneficiaryMonth: 12_000,

    /** عدد المستفيدين المرجعي */
    beneficiaryCount: 62,

    /** نسبة نجاح خطة التأهيل (افتراض مرجعي قابل للضبط) */
    rehabSuccessRate: 0.45,

    /** نسبة المستفيدين الذين يلتحقون بسوق العمل بعد التأهيل */
    employmentRate: 0.15,

    /** متوسط الراتب الشهري للملتحقين بسوق العمل (ريال) */
    avgSalary: 4_000,
} as const;

export interface SroiSummary {
    ratio: number;
    socialValue: number;
    investment: number;
}

/**
 * احتساب نسبة العائد الاجتماعي بطريقة NEF المختصرة:
 *   gross_value = cost_savings + employment_value
 *   net_value = gross_value × (1 − deadweight) × (1 − attribution) × (1 − displacement)
 *   ratio = (net_value / investment) + 1
 */
export function computeSroiCardSummary(): SroiSummary {
    const a = SROI_ASSUMPTIONS;
    const investment = a.monthlyInvestment;

    const successfulCount = a.beneficiaryCount * a.rehabSuccessRate;
    const monthlyCostSavings = successfulCount * a.avgCostPerBeneficiaryMonth * a.costSavingsPerSuccess;
    const monthlyEmploymentValue = successfulCount * a.employmentRate * a.avgSalary;

    const grossValue = monthlyCostSavings + monthlyEmploymentValue;
    const netValue = grossValue
        * (1 - a.deadweight)
        * (1 - a.attribution)
        * (1 - a.displacement);

    const ratio = netValue / investment + 1;
    const socialValue = Math.round(investment * ratio);

    return { ratio, socialValue, investment };
}
