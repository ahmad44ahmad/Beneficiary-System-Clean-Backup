import { UnifiedBeneficiaryProfile } from '../types';

export interface RiskAnalysisResult {
    score: number; // 0-100
    level: 'low' | 'medium' | 'high' | 'critical';
    factors: string[];
    trend: 'stable' | 'increasing' | 'decreasing';
}

/**
 * محرك الحاسة الذكية (Hassa Zakiya / Smart Sense)
 * يحتسب درجة المخاطرة السريرية للمستفيد من ٠ إلى ١٠٠.
 *
 * مبني على:
 * - بنود من مقياس Morse للسقوط (Morse Fall Scale)
 * - استخراج إشارات تلقائية من التشخيص العربي
 * - التنبيهات النشطة (alert tags)
 * - حوادث الـ ٣٠ يوماً الماضية
 *
 * كل عامل يضيف وزناً ثابتاً، والمجموع مُسقَّف عند ١٠٠.
 */
export const calculateRiskScore = (beneficiary: UnifiedBeneficiaryProfile): RiskAnalysisResult => {
    let score = 0;
    const factors: string[] = [];

    const diagnosis = (beneficiary.medicalDiagnosis || '').toLowerCase();
    const psychDiagnosis = (beneficiary.psychiatricDiagnosis || '').toLowerCase();
    const alerts = beneficiary.alerts || [];

    // 1. تحليل التشخيص (Diagnosis Analysis)

    if (diagnosis.includes('epilepsy') || diagnosis.includes('صرع') || alerts.includes('epilepsy')) {
        score += 30;
        factors.push('تشخيص الصرع (احتمالية تشنّج)');
    }

    if (diagnosis.includes('diabetes') || diagnosis.includes('سكري') || alerts.includes('diabetic')) {
        score += 15;
        factors.push('السكري (متابعة الإنسولين)');
    }

    // استخراج صعوبة البلع من النص العربي
    if (diagnosis.includes('بلع') || diagnosis.includes('swallow') || alerts.includes('swallowingDifficulty')) {
        score += 15;
        factors.push('صعوبة بلع (احتمالية شَرْقة)');
    }

    // استخراج السلوك العدواني/الانفعالي من النص العربي
    if (
        diagnosis.includes('عدوان') ||
        diagnosis.includes('انفعال') ||
        diagnosis.includes('سلوكي') ||
        psychDiagnosis.includes('انفعال') ||
        psychDiagnosis.includes('عدوان') ||
        alerts.includes('aggressiveBehavior')
    ) {
        score += 20;
        factors.push('سلوك عدواني/انفعالي (يستوجب يقظة الكادر)');
    }

    // 2. مخاطر التنقّل (Mobility Risks — Morse-aligned)
    if (beneficiary.bedridden || alerts.includes('fallRisk')) {
        score += 25;
        factors.push('خطر سقوط / طريح فراش');
    }

    // 3. متابعة نفسية
    if (beneficiary.psychiatricDiagnosis) {
        score += 10;
        factors.push('متابعة نفسية مستمرة');
    }

    // 4. القصور الحسي (يزيد خطر السقوط والإصابة)
    if (alerts.includes('visuallyImpaired')) {
        score += 10;
        factors.push('ضعف البصر');
    }
    if (alerts.includes('hearingImpaired')) {
        score += 5;
        factors.push('ضعف السمع');
    }

    // 5. حساسية الطعام
    if (alerts.includes('foodAllergy')) {
        score += 5;
        factors.push('حساسية طعام موثَّقة');
    }

    // 6. السنّ (≥٧٥ يرفع الخطر)
    const age = typeof beneficiary.age === 'number' ? beneficiary.age : Number(beneficiary.age);
    if (Number.isFinite(age) && age >= 75) {
        score += 10;
        factors.push('السن ≥ ٧٥ سنة');
    }

    // 7. حوادث حديثة (آخر ٣٠ يوم)
    const incidents = beneficiary.incidents || [];
    if (incidents.length > 0) {
        score += 20;
        factors.push(`حادث عرضي حديث (${incidents.length})`);
    }

    // تسقيف عند ١٠٠
    score = Math.min(score, 100);

    // تحديد المستوى
    let level: RiskAnalysisResult['level'] = 'low';
    if (score >= 80) level = 'critical';
    else if (score >= 50) level = 'high';
    else if (score >= 20) level = 'medium';

    // الاتجاه: عدد التنبيهات النشطة هو المؤشّر اللحظي
    const trend: RiskAnalysisResult['trend'] =
        alerts.length >= 4 ? 'increasing' :
        alerts.length === 0 && incidents.length === 0 ? 'decreasing' :
        'stable';

    return { score, level, factors, trend };
};

export const getWardTensionScore = (beneficiaries: UnifiedBeneficiaryProfile[]): number => {
    if (!beneficiaries.length) return 0;
    const totalRisk = beneficiaries.reduce((acc, curr) => acc + calculateRiskScore(curr).score, 0);
    return Math.round(totalRisk / beneficiaries.length);
};
