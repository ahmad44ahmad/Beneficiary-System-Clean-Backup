/**
 * Clothing (الكسوة) domain types — derived from
 * "الضوابط التنظيمية لتأمين الكسوة لمقيمي مراكز التأهيل الشامل ودور الرعاية 2020"
 * (وكالة التأهيل والتوجيه الاجتماعي).
 *
 * Source PDF: ضوابط الكسوة 2020 (read 2026-04-22).
 * Keep this file in sync with any future revision of the ضوابط.
 */

/** The four phases of the clothing-procurement cycle (PDF §مراحل تأمين الكسوة). */
export type ClothingPhase =
    | 'phase_1_request'      // المرحلة الأولى: طلب تأمين الكسوة
    | 'phase_2_procurement'  // المرحلة الثانية: تأمين الكسوة
    | 'phase_3_settlement'   // المرحلة الثالثة: تسديد العهدة (السلفة)
    | 'phase_4_damage';      // المرحلة الرابعة: معالجة الكسوة التالفة

export const CLOTHING_PHASE_LABELS: Record<ClothingPhase, { ar: string; en: string; durationDays?: [number, number] }> = {
    phase_1_request: { ar: 'طلب تأمين الكسوة', en: 'Request', durationDays: [5, 10] },
    phase_2_procurement: { ar: 'تأمين الكسوة', en: 'Procurement' },
    phase_3_settlement: { ar: 'تسديد العهدة (السلفة)', en: 'Settlement', durationDays: [1, 60] },
    phase_4_damage: { ar: 'معالجة الكسوة التالفة', en: 'Damage Handling' },
};

/** Seasonal request windows (PDF §Phase 1.1). */
export type ClothingSeason = 'summer' | 'winter' | 'eid_fitr' | 'eid_adha';

export interface ClothingSeasonSpec {
    id: ClothingSeason;
    labelAr: string;
    requestDate: { month: number; day: number; calendar: 'gregorian' | 'hijri' };
    noteAr?: string;
}

/** Dates copied verbatim from PDF §Phase 1.1. */
export const CLOTHING_SEASONS: ClothingSeasonSpec[] = [
    {
        id: 'summer',
        labelAr: 'الكسوة الصيفية',
        requestDate: { month: 1, day: 1, calendar: 'gregorian' },
        noteAr: 'يُرفع الطلب بتاريخ 1/1 من السنة الميلادية',
    },
    {
        id: 'winter',
        labelAr: 'الكسوة الشتوية',
        requestDate: { month: 7, day: 1, calendar: 'gregorian' },
        noteAr: 'يُرفع الطلب بتاريخ 7/1 من السنة الميلادية',
    },
    {
        id: 'eid_fitr',
        labelAr: 'كسوة عيد الفطر',
        requestDate: { month: 7, day: 1, calendar: 'hijri' },
        noteAr: 'حصر الطلب في الأول من شهر رجب للسنة الهجرية',
    },
    {
        id: 'eid_adha',
        labelAr: 'كسوة عيد الأضحى',
        requestDate: { month: 9, day: 1, calendar: 'hijri' },
        noteAr: 'حصر الطلب في الأول من شهر رمضان للسنة الهجرية',
    },
];

/** Committee composition — fixed per PDF §Phase 2.2. */
export type ClothingCommitteeRole =
    | 'president'           // رئيس القسم الاجتماعي (القسم الداخلي) — رئيس
    | 'decision_recorder'   // مأمور العهدة — عضو مقرر
    | 'social_specialist'   // أخصائي اجتماعي — عضو
    | 'social_observer';    // مراقب اجتماعي — عضو

export interface ClothingCommitteeMember {
    role: ClothingCommitteeRole;
    roleLabelAr: string;
    membershipTypeAr: string;
    duties: string[];
    assignedStaffId?: string;
    assignedStaffName?: string;
}

export const CLOTHING_COMMITTEE_SPEC: readonly ClothingCommitteeMember[] = [
    {
        role: 'president',
        roleLabelAr: 'رئيس القسم الاجتماعي (القسم الداخلي)',
        membershipTypeAr: 'رئيس',
        duties: [
            'الاطلاع على تقدير احتياج المقيمين من الكسوة',
            'اعتماد تشكيل اللجنة مع المدير',
        ],
    },
    {
        role: 'decision_recorder',
        roleLabelAr: 'مأمور العهدة',
        membershipTypeAr: 'عضو مقرر',
        duties: [
            'تجهيز كافة المستندات والوثائق الخاصة بتأمين الكسوة',
            'معالجة المبالغ المتبقية من السلفة',
            'رفع ملف التسديد للإدارة العامة للشؤون المالية',
        ],
    },
    {
        role: 'social_specialist',
        roleLabelAr: 'أخصائي اجتماعي',
        membershipTypeAr: 'عضو',
        duties: [
            'حصر احتياج المقيمين بحسب الحالات والمقاسات',
            'تسلّم الكسوة من المستودع بموجب نموذج استلام',
            'مراعاة رغبات المقيمين قدر الإمكان',
        ],
    },
    {
        role: 'social_observer',
        roleLabelAr: 'مراقب اجتماعي',
        membershipTypeAr: 'عضو',
        duties: [
            'حصر القطع التالفة وفقاً للضوابط',
            'تعبئة بيان إرجاع الملابس التالفة',
            'توزيع البطاقات التصنيفية على خزانات المقيمين',
        ],
    },
] as const;

/** Damage categories — exactly 5 per PDF §Phase 4.1. No extensions without updating the ضوابط. */
export type ClothingDamageReason =
    | 'burn'                // حرق في القطعة
    | 'tear'                // خرق في القطعة
    | 'fabric_breakdown'    // تمزق في النسيج
    | 'expired'             // عدم صلاحية (تمدد، طمس ألوان، تغيير مقاس)
    | 'beneficiary_death';  // وفاة المقيم

export const CLOTHING_DAMAGE_REASONS: Record<ClothingDamageReason, string> = {
    burn: 'حرق في القطعة',
    tear: 'خرق في القطعة',
    fabric_breakdown: 'تمزق في النسيج',
    expired: 'عدم صلاحية (تمدد/طمس ألوان/تغيير مقاس)',
    beneficiary_death: 'وفاة المقيم',
};

/** Article categories covered by the ضوابط (PDF §Phase 2.3). */
export type ClothingArticleCategory =
    | 'sleepwear'       // بجامات أو قمصان
    | 'formal'          // ثوب / شماغ / فستان / جلابية / بنطال / بلوزة
    | 'innerwear'       // ملابس داخلية
    | 'athletic'        // بدلة رياضية
    | 'abaya'           // عباية
    | 'outerwear'       // معطف
    | 'gloves'          // قفاز
    | 'hat'             // قبعة
    | 'socks'           // جوارب
    | 'bath_towel'      // منشفة استحمام
    | 'bathrobe'        // روب
    | 'bib';            // صدريات

export const CLOTHING_ARTICLE_LABELS: Record<ClothingArticleCategory, string> = {
    sleepwear: 'بدلة نوم (بجامات/قمصان)',
    formal: 'ملابس رسمية',
    innerwear: 'ملابس داخلية',
    athletic: 'بدلة رياضية',
    abaya: 'عباية',
    outerwear: 'معطف',
    gloves: 'قفاز',
    hat: 'قبعة',
    socks: 'جوارب',
    bath_towel: 'منشفة استحمام',
    bathrobe: 'روب',
    bib: 'صدرية',
};

/** Quality specifications — verbatim from PDF §Phase 2.4. */
export const CLOTHING_QUALITY_SPECS: readonly string[] = [
    'أن يكون القماش قطنياً ومريحاً ويتحمل الغسيل المتكرر وذو جودة عالية',
    'يجب ألّا تحتوي الملابس على أي أزرار أو سحابات أو خيوط وأربطة أو قطع حديدية',
    'تأمين كسوة للحالات طريحة الفراش بحسب طبيعة الجسم ومكان فتحة التغذية',
    'أن يكون الحذاء مناسباً للمقيم ولا يحتوي على كعب عالٍ أو أربطة، ويكون مريحاً وذا جودة عالية',
    'مراعاة قدر الإمكان رغبات المقيمين',
    'أن تكون المقاسات متناسبة مع مقاس المقيم',
] as const;

/** Documents required for settlement (PDF §Phase 3.1). */
export const CLOTHING_SETTLEMENT_DOCS: readonly string[] = [
    'محضر لجنة تأمين الكسوة مشتملاً على كافة الإجراءات',
    'محاضر الاستلام (نموذج 3)',
    'فواتير المشتريات',
    'صورة قرار صرف السلفة',
    'إيصال إيداع المبالغ المتبقية في مؤسسة النقد العربي السعودي (إن وجد)',
] as const;

/** Settlement deadline from advance disbursement (PDF §Phase 3.1). */
export const CLOTHING_SETTLEMENT_DEADLINE_DAYS = 60; // شهرين بعد صدور قرار الصرف

/**
 * Calculate the next upcoming seasonal request window.
 * Returns the season plus days-until the next deadline.
 */
export function nextClothingSeason(now: Date = new Date()): {
    season: ClothingSeasonSpec;
    daysUntil: number;
    dueDate: Date;
} {
    const year = now.getFullYear();
    const candidates = CLOTHING_SEASONS
        .filter((s) => s.requestDate.calendar === 'gregorian')
        .map((s) => {
            const dueThisYear = new Date(year, s.requestDate.month - 1, s.requestDate.day);
            const dueDate = dueThisYear < now
                ? new Date(year + 1, s.requestDate.month - 1, s.requestDate.day)
                : dueThisYear;
            const daysUntil = Math.ceil((dueDate.getTime() - now.getTime()) / 86_400_000);
            return { season: s, daysUntil, dueDate };
        })
        .sort((a, b) => a.daysUntil - b.daysUntil);
    // Guaranteed non-empty because CLOTHING_SEASONS has 2 gregorian entries.
    return candidates[0]!;
}
