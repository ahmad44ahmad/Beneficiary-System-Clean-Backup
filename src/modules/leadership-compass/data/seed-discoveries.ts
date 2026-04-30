/**
 * بذور تجريبيّة لمحرّك الاكتشاف — تدخّلاتٌ مُتميّزةٌ في مركزٍ واحد
 * تَستحقّ الدراسة للتعميم على مراكز أخرى.
 *
 * مبدأ: لا نَعرض «المركز الأفضل» (هذه منافسة) — نَعرض «الممارسة التي تَستحقّ
 * النَسخ» (هذه منهجيّة). الفرق ليس لغويّاً، بل مؤسّسيّاً.
 */

export type DiscoveryConfidence = 'preliminary' | 'moderate' | 'strong';

export const CONFIDENCE_LABELS: Record<DiscoveryConfidence, string> = {
    preliminary: 'أوّليّة',
    moderate:    'متوسّطة',
    strong:      'قويّة',
};

export const CONFIDENCE_TONES: Record<DiscoveryConfidence, {
    bg: string; text: string; border: string;
}> = {
    preliminary: { bg: 'bg-gray-100',   text: 'text-hrsd-navy',     border: 'border-gray-300' },
    moderate:    { bg: 'bg-[#269798]/10',     text: 'text-[#0F3144]',       border: 'border-[#269798]' },
    strong:      { bg: 'bg-hrsd-green/15', text: 'text-hrsd-green-dark', border: 'border-hrsd-green/50' },
};

export type DiscoveryStage = 'signal' | 'study_proposed' | 'pilot' | 'ready_for_scale' | 'scaled';

export const STAGE_LABELS: Record<DiscoveryStage, string> = {
    signal:           'إشارة أوليّة',
    study_proposed:   'دراسة مُقترَحة',
    pilot:            'تجربة توسّع',
    ready_for_scale:  'جاهز للتعميم',
    scaled:           'مُعمَّم وطنيّاً',
};

export interface Discovery {
    id: string;
    title: string;
    intervention: string;           // ما الذي فُعِل
    originCenter: string;           // أين ظهر
    observedSince: string;          // منذ متى
    outcomeMetric: string;          // المقياس المُستخدَم
    outcomeDelta: string;           // الفرق عن الأساس
    baselineComparison: string;     // مقارنةٌ رقميّة
    confidence: DiscoveryConfidence;
    stage: DiscoveryStage;
    sampleSize: number;             // عدد الحالات/الملاحظات
    barriersAddressed: string[];    // B1..B10
    proposedActions: Array<{ title: string; detail: string }>;
    risks: string[];                // مخاطر التعميم
}

export const SEED_DISCOVERIES: Discovery[] = [
    {
        id: 'disc-001',
        title: 'برنامج الرعاية اللاحقة بستّ خطواتٍ — أثرٌ تراكميّ مُلاحَظ',
        intervention:
            'برنامجٌ مُكوَّنٌ من ستّ خطواتٍ يَربط المستفيد بأسرته تدريجيّاً قبل الخروج: ' +
            'تقييمٌ أسريٌّ، تدريبٌ للأسرة على الرعاية، إجازاتٌ قصيرةٌ متَدرِّجة، مراقبةٌ ميدانيّة، ' +
            'دعمٌ نفسيٌّ للأسرة، متابعةٌ شهريّةٌ لستّة أشهر بعد الخروج.',
        originCenter: 'مركز التأهيل الشامل بالباحة',
        observedSince: '2024-10',
        outcomeMetric: 'معدّل الدمج الأسريّ المستقرّ ≥ 12 شهراً',
        outcomeDelta: '+2.3× مقارنةً بالمتوسّط الوطنيّ التقديريّ',
        baselineComparison: 'الباحة: 68% استقرار · متوسّط المراكز المُقارَنة (تقديريّ): 29%',
        confidence: 'moderate',
        stage: 'study_proposed',
        sampleSize: 14,
        barriersAddressed: ['B6', 'B7', 'B8'],
        proposedActions: [
            { title: 'توصيف رسميّ للمُعالجة',  detail: 'توثيق الستّ خطوات كـمعالجةٍ قياسيّةٍ قابلةٍ للتكرار.' },
            { title: 'تجربة توسّعٍ بـمركزين',   detail: 'عسير + تبوك — ستّة أشهر مع قياسٍ مُستقلّ.' },
            { title: 'تمويلٌ للدراسة الأكاديميّة', detail: 'شراكةٌ بحثيّةٌ مع جامعة محلّيّةٍ لقياسٍ صارم.' },
        ],
        risks: [
            'حجم العيّنة محدود (14 حالة) — نتائج قد لا تَتكرَّر.',
            'انحياز السياق — ارتفاع الأثر قد يَرتبط ببيئة الباحة الثقافيّة.',
            'كلفة التدريب الأسريّ المُكثَّف قد تَكون مُرتفعةً في مراكز ذات عبءٍ أعلى.',
        ],
    },

    {
        id: 'disc-002',
        title: 'الدليل المرئيّ متعدّد اللغات — نموذجٌ نُجِّح وطنيّاً',
        intervention:
            'دليلٌ مرئيٌّ للعناية الشخصيّة لذوي الإعاقة بخمس لغات: العربيّة، الإنجليزيّة، ' +
            'الأوردو، البنغاليّة، الهنديّة. يُخاطب الكادر المباشر بلغته الأم.',
        originCenter: 'مركز التأهيل الشامل بالباحة',
        observedSince: '2024-05',
        outcomeMetric: 'تقليل حوادث العناية + رفع الامتثال للبروتوكولات',
        outcomeDelta: 'اعتماد رسميّ من إدارة سلامة المستفيد + تعميمٌ على جميع المراكز',
        baselineComparison: 'مُعمَّمٌ وطنيّاً — خرج من نطاق القياس الفرديّ.',
        confidence: 'strong',
        stage: 'scaled',
        sampleSize: 38,
        barriersAddressed: ['B1', 'B2'],
        proposedActions: [
            { title: 'قياس الأثر البَعديّ', detail: 'دراسة لِما إذا حَقَّق التعميم الأثر المرجوّ في كلّ المراكز.' },
            { title: 'تحديث الدليل دوريّاً', detail: 'لغاتٌ إضافيّة (أمهريّة، فلبينيّة) حسب تركيبة الكوادر.' },
        ],
        risks: [
            'التعميم لا يَضمن التطبيق — قد يَبقى مُعلَّقاً في بعض المراكز.',
        ],
    },

    {
        id: 'disc-003',
        title: 'فريق كرة القدم النسائيّ — أثرٌ نفسيٌّ واجتماعيٌّ غير مُتوقَّع',
        intervention:
            'تشكيل فريقٍ نسائيٍّ من 12 مستفيدةٍ لممارسة كرة القدم بانتظام — الأوّل من نوعه ' +
            'على مستوى منطقة الباحة. تدريبٌ منتظمٌ أسبوعيٌّ مع أخصّائيٍّ رياضيٍّ مُؤهَّل.',
        originCenter: 'مركز التأهيل الشامل بالباحة (القسم النسائيّ)',
        observedSince: '2024-11',
        outcomeMetric: 'مُلاحظات كيفيّة في السلوك والمزاج والتفاعل الاجتماعيّ',
        outcomeDelta: 'تقديرٌ مَيدانيٌّ: تحسُّنٌ مَلحوظٌ في 9 من أصل 12 مشاركة',
        baselineComparison: 'لا يوجد مقياسٌ كمّيٌّ رسميّ بعد — أثرٌ مُلاحَظٌ ميدانيّاً.',
        confidence: 'preliminary',
        stage: 'pilot',
        sampleSize: 12,
        barriersAddressed: ['B6', 'B7', 'B8', 'B9'],
        proposedActions: [
            { title: 'توثيق الأثر النفسيّ والاجتماعيّ',  detail: 'أدواتُ قياسٍ نفسيّة (مقاييس الثقة والمشاركة) قبل/بعد.' },
            { title: 'دعوة أخصّائيٍّ بحثيّ',          detail: 'تحويل الملاحظة إلى ورقةٍ قابلةٍ للنشر.' },
            { title: 'نقل التجربة لمركزَين آخرَين',     detail: 'استنساخ النموذج في مراكز نسائيّةٍ أخرى.' },
        ],
        risks: [
            'القياس حتى الآن انطباعيٌّ — نَحتاج أدواتٍ كمّيّةً صارمة.',
            'البيئة الثقافيّة في كلّ منطقةٍ قد تَستوجب تكييفاً.',
        ],
    },

    {
        id: 'disc-004',
        title: 'إعادة توزيع المهامّ تَحت الضغط — استجابة أزمة الإعاشة',
        intervention:
            'عند تعثُّر متعهّد الإعاشة، شُكِّل فريق عمل «العاجل من الأمور» خلال 48 ساعة — ' +
            'أعاد توزيع المهامّ على الكوادر الداخليّة وضَمن استمرار الخدمة دون انقطاع.',
        originCenter: 'مركز التأهيل الشامل بالباحة',
        observedSince: '2024-07',
        outcomeMetric: 'زمن الاستجابة للأزمات + استمراريّة الخدمة',
        outcomeDelta: 'استمرار الخدمة 100% دون تأثير على المستفيدين',
        baselineComparison: 'أزماتٌ مماثلةٌ سابقةً: متوسّط انقطاعٍ 48-72 ساعة قبل الحلّ.',
        confidence: 'moderate',
        stage: 'ready_for_scale',
        sampleSize: 1,
        barriersAddressed: ['B2', 'B4'],
        proposedActions: [
            { title: 'صياغة بروتوكولٍ استجابة أزمة مُوحَّد', detail: 'دليلٌ لتشكيل فرق «العاجل» في كلّ المراكز.' },
            { title: 'تدريبٌ سنويٌّ على استجابة الأزمات',    detail: 'محاكاةٌ واقعيّة مرّةً في السنة لكلّ مركز.' },
        ],
        risks: [
            'عدد الحوادث المُوثَّقة صغير (حادثة واحدة) — النمط يَحتاج تكراراً للتأكيد.',
        ],
    },
];
