/**
 * بذور تجريبيّة لسجلّ القرارات — قراراتٌ تاريخيّةٌ مع نتائجها الفعليّة بعد 3/6/12 شهراً.
 *
 * فلسفة: «نَتعلَّم من أين حطَّت النتيجة» (أحمد، 2026-04-22). كلّ قرارٍ يَبقى دائماً،
 * حتى المرفوض، حتى الذي لم يَنجح — هذا أثمن سِجلّ مؤسّسيّ.
 */

export type LedgerDecisionStatus = 'approved' | 'rejected' | 'delayed' | 'superseded';

export interface OutcomeActual {
    plannedValue: string;       // ما كان متوقّعاً
    actualValue: string;        // ما حَدث فعلاً
    variance: 'exceeded' | 'on_target' | 'below' | 'failed';
    notes?: string;
}

export interface LedgerEntry {
    id: string;
    decidedDate: string;                     // YYYY-MM
    title: string;
    category: string;
    level: string;
    status: LedgerDecisionStatus;
    decidedBy: string;
    originalRecommendation: string;
    decisionNotes?: string;                   // لماذا اتُّخذ القرار على هذا النحو

    cost?: { plannedSar: number; actualSar?: number };

    outcomes: {
        at3mo?: OutcomeActual;
        at6mo?: OutcomeActual;
        at12mo?: OutcomeActual;
    };

    lessonLearned: string;                    // الدرس المُستخلَص
    tags: string[];                           // للتصفية
}

export const VARIANCE_LABELS: Record<OutcomeActual['variance'], string> = {
    exceeded:  'تجاوز المُستهدَف',
    on_target: 'في المسار',
    below:     'دون المُستهدَف',
    failed:    'فشل',
};

export const VARIANCE_TONES: Record<OutcomeActual['variance'], { bg: string; text: string; icon: string }> = {
    exceeded:  { bg: 'bg-hrsd-green/15', text: 'text-hrsd-green-dark', icon: '↗' },
    on_target: { bg: 'bg-[#269798]/10',       text: 'text-[#0F3144]',         icon: '→' },
    below:     { bg: 'bg-[#FCB614]/15',     text: 'text-[#0F3144]',       icon: '↓' },
    failed:    { bg: 'bg-[#DC2626]/15',      text: 'text-[#7F1D1D]',        icon: '✕' },
};

export const SEED_LEDGER: LedgerEntry[] = [
    {
        id: 'led-2024-05-001',
        decidedDate: '2024-05',
        title: 'اعتماد الدليل المرئيّ متعدّد اللغات للعناية الشخصيّة',
        category: 'تعميم/توسعة',
        level: 'وكالة',
        status: 'approved',
        decidedBy: 'وكالة التأهيل والتوجيه الاجتماعيّ',
        originalRecommendation: 'اعتماد الدليل المُعَدّ من مركز الباحة وتعميمه وطنيّاً.',
        decisionNotes: 'تَمَّت الموافقة بعد مراجعةٍ فنّيّةٍ من إدارة سلامة المستفيدين.',
        cost: { plannedSar: 85_000, actualSar: 78_000 },
        outcomes: {
            at3mo: {
                plannedValue: 'توزيعٌ على 10 مراكز',
                actualValue:  'وُزِّع على 14 مركزاً',
                variance:     'exceeded',
                notes:        'إقبالٌ غير مُتوقَّعٍ من المراكز على الاعتماد الطوعيّ.',
            },
            at6mo: {
                plannedValue: 'تبنّي 50% من المراكز',
                actualValue:  '~70% من المراكز (حسب التقارير الشهريّة)',
                variance:     'exceeded',
            },
            at12mo: {
                plannedValue: 'تقليلٌ ملحوظٌ في حوادث العناية',
                actualValue:  'البيانات أعطت إشارةً إيجابيّةً لكنّها غير قاطعةٍ — قياسٌ غير مُوحَّد',
                variance:     'on_target',
                notes:        'الحاجة لأداة قياسٍ مُوحَّدة قبل إصدار حكمٍ نهائيّ.',
            },
        },
        lessonLearned:
            'التعميم السريع يَنجح لكن القياس البَعديّ يَحتاج تخطيطاً مبدئيّاً — ' +
            'نحن عرفنا أنّ الدليل انتشر، لكنّ أثره الفعليّ لم نَقِسه بدقّة. ' +
            'في القرارات المستقبليّة للتعميم: يُؤخَذ قرار أدوات القياس قبل إطلاق التعميم.',
        tags: ['تعميم', 'سلامة مستفيد', 'دليل نموذجيّ', 'قياس بعدي مفقود'],
    },

    {
        id: 'led-2024-08-002',
        decidedDate: '2024-08',
        title: 'توظيف مستفيدَين مع جمعيّة سَعْي',
        category: 'شراكة استراتيجيّة',
        level: 'مركز',
        status: 'approved',
        decidedBy: 'مدير مركز التأهيل الشامل بالباحة',
        originalRecommendation: 'توقيع اتّفاقيّة تعاونٍ مع جمعيّة سَعْي لتوظيف أربع حالات مُستفيدين.',
        cost: { plannedSar: 35_000, actualSar: 28_000 },
        outcomes: {
            at3mo: {
                plannedValue: 'توظيف 2 من أصل 4',
                actualValue:  'تَمَّ توظيف 2 (غَرم الله، زهرة عبدالله)',
                variance:     'on_target',
            },
            at6mo: {
                plannedValue: 'استمرار الموظَّفَين',
                actualValue:  'كلاهما مُستمرٌّ مع تقييمٍ إيجابيٍّ من الجهة الموظِّفة',
                variance:     'on_target',
            },
            at12mo: {
                plannedValue: 'توظيف الحالتَين المتبقّيتَين',
                actualValue:  'لم يَتِمّ — الحالتان المُرشَّحتان رَفَضتا',
                variance:     'below',
                notes:        'السبب: مخاوف الأسرتَين من استقلاليّة المستفيد.',
            },
        },
        lessonLearned:
            'التوظيف لا يَتمّ بالقرار الإداريّ وحده — يَحتاج عملاً مسبقاً مع الأسرة. ' +
            'في الحالات القادمة: يُدمَج تأهيلٌ أسريٌّ قبل 3 أشهر على الأقلّ من التوظيف.',
        tags: ['توظيف', 'شراكة', 'تمكين', 'دور الأسرة'],
    },

    {
        id: 'led-2024-11-003',
        decidedDate: '2024-11',
        title: 'تشكيل فريق كرة القدم النسائيّ',
        category: 'تدخّل خاصّ',
        level: 'مركز',
        status: 'approved',
        decidedBy: 'مدير مركز التأهيل الشامل بالباحة',
        originalRecommendation: 'تشكيل فريقٍ من 10-12 مستفيدةً للمشاركة في الأنشطة الرياضيّة.',
        cost: { plannedSar: 45_000, actualSar: 52_000 },
        outcomes: {
            at3mo: {
                plannedValue: 'تَدريبٌ أسبوعيٌّ منتظم',
                actualValue:  'انتظامٌ كاملٌ — 12 مشاركة',
                variance:     'on_target',
            },
            at6mo: {
                plannedValue: 'تحسُّنٌ ملحوظٌ في المشاركة الاجتماعيّة',
                actualValue:  '9 من 12 أظهرن تحسُّناً كيفيّاً — لا قياس رسميّ',
                variance:     'below',
                notes:        'الأثر موجود لكنّ القياس ضعيف.',
            },
        },
        lessonLearned:
            'التدخّلات النوعيّة تَستحقّ قياساً نوعيّاً - كمّيّاً معاً. ' +
            'نحتاج أدوات قياسٍ سلوكيّةٍ ونفسيّةٍ قياسيّة (WHOQOL-BREF مثلاً) ' +
            'قبل إطلاق تدخّلٍ جديدٍ من هذا النوع.',
        tags: ['تدخّل نوعيّ', 'نساء', 'رياضة', 'قياس ضعيف'],
    },

    {
        id: 'led-2025-02-004',
        decidedDate: '2025-02',
        title: 'رَفض مُقترَح إضافة نظام كاميرات في غرف النوم',
        category: 'حوكمة',
        level: 'مركز',
        status: 'rejected',
        decidedBy: 'مدير مركز التأهيل الشامل بالباحة',
        originalRecommendation: 'تركيب كاميرات مُراقَبة في جميع غرف المستفيدين لأسباب السلامة.',
        decisionNotes:
            'رُفض بعد مراجعة: ينتهك خصوصيّة المستفيد، يَتعارض مع CRPD المادة 22، ' +
            'كلفةُ بديلٍ إنسانيٍّ (مُراقبٌ ليليٌّ بشريّ) مُعقَّدة.',
        cost: { plannedSar: 180_000 },
        outcomes: {
            at3mo: {
                plannedValue: '—',
                actualValue:  'تَمَّ تعزيز المُراقبة البشريّة بدلاً',
                variance:     'on_target',
                notes:        'القرار البديل: إضافة ممرّضٍ لكلّ قسمٍ في فترة اللّيل.',
            },
            at6mo: {
                plannedValue: '—',
                actualValue:  'لا حوادث خصوصيّةٍ مُوثَّقة · مستوى السلامة لم يتأثَّر',
                variance:     'exceeded',
            },
        },
        lessonLearned:
            'الرفض قرارٌ جيّدٌ في حدّ ذاته — ليس نقصاً في الحكمة. ' +
            'البدائل الإنسانيّة قد تَكون أرخص في الكلفة الحقيقيّة (ثقة + امتثال) ' +
            'حتى لو بَدت أغلى في الكلفة المباشرة.',
        tags: ['رفض واعٍ', 'خصوصيّة', 'CRPD', 'بديل إنسانيّ'],
    },

    {
        id: 'led-2025-09-005',
        decidedDate: '2025-09',
        title: 'تأجيل توسعة برنامج التأهيل المهنيّ',
        category: 'ميزانيّة',
        level: 'فرع',
        status: 'delayed',
        decidedBy: 'فرع الوزارة بالباحة',
        originalRecommendation: 'تخصيص 300,000 ريال لتوسعة البرنامج ليَشمل 10 مستفيدين إضافيّين.',
        decisionNotes:
            'أُجِّل لتَأخُّر شراكاتٍ تشغيليّةٍ مع القطاع الخاصّ — بدون طرفٍ مُوظِّفٍ ' +
            'ستُهدر التكلفة. أُعيد جدولته لـQ2 2026.',
        outcomes: {
            at3mo: {
                plannedValue: '—',
                actualValue:  'لم يُنفَّذ — كما هو مُخطَّط',
                variance:     'on_target',
            },
        },
        lessonLearned:
            'التأجيل ليس فشلاً. القرارات التي تَنتظر توفُّر الشروط أحياناً أفضل ' +
            'من التنفيذ قبل النُضج. مفتاح النجاح: أن يَكون للتأجيل موعدٌ نهائيٌّ ' +
            'وشرطٌ واضحٌ لإعادة التفعيل.',
        tags: ['تأجيل واعٍ', 'ميزانيّة', 'شروط شراكة', 'نضج تشغيليّ'],
    },
];
