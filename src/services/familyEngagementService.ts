/**
 * محرك جسر الأسرة (Family Bridge) — احتساب «معدّل تفاعل الأسر».
 *
 * يحتسب درجة من ٠ إلى ١٠٠ تعكس مستوى تواصل الأسرة مع المستفيد عبر:
 *   ١. تكرار الزيارات الأسبوعي
 *   ٢. سرعة الردّ على رسائل الكادر
 *   ٣. اكتمال المكالمات المرئية المجدولة
 *   ٤. مشاهدة الصور والمقاطع المرسَلة
 *
 * إذا نزل المعدّل عن ٥٠٪ يُفعَّل تدخّل استباقي من الأخصائي الاجتماعي.
 */

export interface FamilyEngagementInputs {
    visitsThisMonth: number;          // عدد الزيارات الفعلية في الشهر
    expectedVisitsPerMonth: number;   // الحدّ المرجعي للزيارات (مثلاً ٤)
    avgReplyHours: number;            // متوسط زمن الردّ على رسائل الكادر (ساعات)
    scheduledVideoCalls: number;      // عدد المكالمات المجدولة في الشهر
    completedVideoCalls: number;      // عدد المكالمات المُنفَّذة فعلاً
    mediaItemsSent: number;           // عدد الصور/المقاطع المرسَلة
    mediaItemsViewed: number;         // عدد ما اطّلعت عليه الأسرة
}

export interface FamilyEngagementResult {
    score: number;                    // ٠–١٠٠
    level: 'low' | 'moderate' | 'good' | 'excellent';
    breakdown: { factor: string; weight: number; subscore: number }[];
    triggersIntervention: boolean;    // true إذا < ٥٠
    recommendation: string;
}

const WEIGHTS = {
    visits: 0.30,
    replyLatency: 0.20,
    videoCalls: 0.25,
    mediaViews: 0.25,
};

function clamp(n: number, lo = 0, hi = 1): number {
    return Math.max(lo, Math.min(hi, n));
}

export function computeFamilyEngagement(inputs: FamilyEngagementInputs): FamilyEngagementResult {
    // ١. الزيارات: نسبة الفعلي إلى المرجعي، مسقَّفة عند ١
    const visitsRatio = inputs.expectedVisitsPerMonth > 0
        ? clamp(inputs.visitsThisMonth / inputs.expectedVisitsPerMonth)
        : 0;

    // ٢. سرعة الردّ: ٠ ساعة → ١.٠، ٤٨ ساعة → ٠
    const replyRatio = clamp(1 - inputs.avgReplyHours / 48);

    // ٣. المكالمات المرئية: نسبة المُنفَّذ إلى المجدول
    const videoRatio = inputs.scheduledVideoCalls > 0
        ? clamp(inputs.completedVideoCalls / inputs.scheduledVideoCalls)
        : 0;

    // ٤. المشاهدة: نسبة ما اطّلعت عليه الأسرة من المحتوى المرسل
    const viewRatio = inputs.mediaItemsSent > 0
        ? clamp(inputs.mediaItemsViewed / inputs.mediaItemsSent)
        : 0;

    const breakdown = [
        { factor: 'تكرار الزيارات', weight: WEIGHTS.visits, subscore: Math.round(visitsRatio * 100) },
        { factor: 'سرعة الردّ على الرسائل', weight: WEIGHTS.replyLatency, subscore: Math.round(replyRatio * 100) },
        { factor: 'إتمام المكالمات المرئية', weight: WEIGHTS.videoCalls, subscore: Math.round(videoRatio * 100) },
        { factor: 'الاطّلاع على المحتوى المرسَل', weight: WEIGHTS.mediaViews, subscore: Math.round(viewRatio * 100) },
    ];

    const score = Math.round(
        visitsRatio * WEIGHTS.visits * 100 +
        replyRatio * WEIGHTS.replyLatency * 100 +
        videoRatio * WEIGHTS.videoCalls * 100 +
        viewRatio * WEIGHTS.mediaViews * 100
    );

    let level: FamilyEngagementResult['level'];
    if (score >= 80) level = 'excellent';
    else if (score >= 65) level = 'good';
    else if (score >= 50) level = 'moderate';
    else level = 'low';

    const triggersIntervention = score < 50;
    const recommendation = triggersIntervention
        ? 'يُفعَّل تدخّل استباقي من الأخصائي الاجتماعي خلال ٤٨ ساعة.'
        : 'الحفاظ على وتيرة التواصل، وإرسال محتوى أسبوعي مُعتمَد من الإدارة.';

    return { score, level, breakdown, triggersIntervention, recommendation };
}

/** مثال تجريبي للعرض */
export const DEMO_FAMILY_ENGAGEMENT_INPUTS: FamilyEngagementInputs = {
    visitsThisMonth: 3,
    expectedVisitsPerMonth: 4,
    avgReplyHours: 6,
    scheduledVideoCalls: 4,
    completedVideoCalls: 3,
    mediaItemsSent: 12,
    mediaItemsViewed: 9,
};
