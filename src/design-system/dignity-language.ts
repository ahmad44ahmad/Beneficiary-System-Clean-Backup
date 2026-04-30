/**
 * Dignity Language — Phase 2.5 substrate.
 *
 * The product axis is "محور الخدمة هو المستفيد، ليس المدير ولا الإجراء"
 * (Ahmad, 2026-04-30). Language carries that axis: a tool that calls a
 * person "حالة" (case) treats them as a record; a tool that calls them
 * "مستفيد" treats them as a citizen with rights guaranteed by النظام
 * الأساسي للحكم.
 *
 * The framing follows the **social-handicap compass** (الإعاقة كعوق
 * مجتمعي) — disability is what the environment imposes, not a deficit
 * located inside the person. Existing Basira engines already speak this
 * vocabulary: محرك إحسان (DignityProfile), محرك مروءة
 * (staffingOptimizerService). This file makes the vocabulary explicit
 * and queryable so reviewers, lints, and future ministry contributors
 * can see what NOT to write.
 *
 * **This is a soft guard, not a hard one.** Per Ahmad's directive
 * "لا تعقّد الأمور" — flag legacy terms as warnings, never block CI.
 * Migration is gradual, by hand, with the rationale visible at the
 * point of decision.
 *
 * Cross-references:
 *   - Vault: C:\dev\ahmad-brain\wiki\concepts\social-handicap-compass.md
 *   - Memory: ~/.claude/projects/C--Users-aass1/memory/feedback_social_handicap_compass.md
 *   - Saudi UN CRPD ratification (Royal Decree M/79, 1428 AH)
 *   - Saudi Persons-with-Disability Strategy (3 axes: عدم التمييز ·
 *     تمكين سوق العمل · الدمج المجتمعي)
 */

export type DignityCategory =
    | 'identity'      // كيف نسمّي المستفيد
    | 'framing'       // كيف نصف الإعاقة/الحالة
    | 'care'          // كيف نصف الفعل/الخدمة
    | 'setting'       // كيف نسمّي المكان/السياق المؤسسي
    | 'capability'    // كيف نصف القدرات والنموّ
    | 'family'        // كيف نصف الأسرة والمجتمع المحيط
    | 'risk'          // كيف نتعامل مع الحوادث والمخاطر
    | 'empowerment';  // كيف نصف الأهداف والاستقلال

export interface DignityTerm {
    /** المصطلح المُتجنَّب — لا يُكتب في واجهات أو تقارير المستفيدين. */
    avoid: string;
    /** البديل المُعتمد. */
    prefer: string;
    /** المبرّر — جملة واحدة باللغة الحكومية، تشرح لماذا الفرق يهمّ. */
    rationale: string;
    /** التصنيف للفلترة والمراجعات. */
    category: DignityCategory;
    /** سياق استثنائي يجوز فيه المصطلح القديم (نادر — وثائق طبية رسمية مثلاً). */
    validContext?: string;
}

export const DIGNITY_TERMS: readonly DignityTerm[] = [
    // ───── الهوية (identity) ─────
    {
        avoid: 'نزيل',
        prefer: 'مستفيد',
        rationale: 'الإيواء استضافة، لا احتجاز. كلمة «نزيل» تستحضر السجن أو المأوى، لا الخدمة الحكومية.',
        category: 'identity',
    },
    {
        avoid: 'حالة',
        prefer: 'مستفيد',
        rationale: 'الإنسان قبل الملف. «الحالة» تختزل الفرد إلى سجل قابل للإغلاق.',
        category: 'identity',
        validContext: 'في السجلات الطبية الداخلية حيث «حالة طبية» مصطلح فني',
    },
    {
        avoid: 'المريض',
        prefer: 'مستفيد',
        rationale: 'المركز ليس مستشفى. «مستفيد» المصطلح المعتمد للإشارة إلى الشخص ذي الإعاقة في كل الواجهات والتقارير.',
        category: 'identity',
        validContext: 'داخل الملف الطبي البحت أو في تواصل مع وزارة الصحة',
    },
    {
        avoid: 'المعاق',
        prefer: 'مستفيد',
        rationale: 'النموذج الاجتماعي للإعاقة (CRPD): الشخصية قبل الإعاقة. «مستفيد» يحفظ الكرامة ويعكس صياغة الوزارة الرسمية.',
        category: 'identity',
    },
    {
        avoid: 'المسن العاجز',
        prefer: 'المستفيد كبير السن',
        rationale: 'العمر سياق، ليس عجزاً. وصف «العجز» يفترض غياب القدرة بدلاً من تنوّعها.',
        category: 'identity',
    },

    // ───── التأطير (framing) ─────
    {
        avoid: 'الإعاقة',
        prefer: 'العوق المجتمعي',
        rationale: 'بوصلة المنتج: العائق في البيئة، لا في الفرد. هذا تأطير ينقل التركيز من «إصلاح الشخص» إلى «إزالة الحاجز».',
        category: 'framing',
        validContext: 'حين نقتبس صياغة قانونية رسمية أو تشخيصاً طبياً تخصّصياً',
    },
    {
        avoid: 'التشخيص',
        prefer: 'سياق الفرد',
        rationale: 'التشخيص لحظة طبية، أمّا «سياق الفرد» يستوعب الزمن والنموّ والظروف.',
        category: 'framing',
        validContext: 'الملف الطبي حصراً',
    },
    {
        avoid: 'درجة الإعاقة',
        prefer: 'شدّة الاحتياج',
        rationale: 'نقيس ما يستلزمه الدعم، لا ما يفقده الإنسان. يحوّل القياس من سلبي إلى تشغيلي.',
        category: 'framing',
    },
    {
        avoid: 'عوق ذهني',
        prefer: 'احتياج ذهني',
        rationale: 'ذات المنطق: ما الذي يحتاجه الفرد للتعلّم والمشاركة، لا ما الذي «ينقصه».',
        category: 'framing',
    },
    {
        avoid: 'حالة ميؤوس منها',
        prefer: 'حالة تستدعي رعاية مكثّفة',
        rationale: 'لا يأس في الخدمة الحكومية. الدولة الضامن، والكرامة لا تتدرّج.',
        category: 'framing',
    },

    // ───── الفعل / الخدمة (care) ─────
    {
        avoid: 'رعاية',
        prefer: 'رعاية وتمكين',
        rationale: 'الرعاية وحدها سلبية — ثنائية «رعاية وتمكين» تُذكّر بأنّ الهدف الاستقلال لا الإطعام.',
        category: 'care',
    },
    {
        avoid: 'مساعدة',
        prefer: 'إحسان',
        rationale: 'من ثقافتنا. «إحسان» التزام أخلاقي راسخ، لا منّة عابرة. اسم محرك الكرامة في النظام.',
        category: 'care',
    },
    {
        avoid: 'علاج',
        prefer: 'تأهيل',
        rationale: 'العلاج يفترض مرضاً يُشفى. التأهيل يبني قدرات للحياة في المجتمع. أقرب لمهمّة المركز.',
        category: 'care',
        validContext: 'الملف الطبي عند الحديث عن دواء أو تدخّل سريري',
    },
    {
        avoid: 'متابعة الموظف',
        prefer: 'متابعة الخدمة',
        rationale: 'محور الخدمة المستفيد، لا الموظف. التطبيق ليس أداة رقابة على العاملين.',
        category: 'care',
    },

    // ───── المكان / السياق (setting) ─────
    {
        avoid: 'إيواء',
        prefer: 'استضافة',
        rationale: 'الاستضافة تحفظ مؤقّتية الانفصال عن الأسرة وكرامة الضيف. كلمة أحمد المعتمدة.',
        category: 'setting',
        validContext: 'النصوص النظامية الرسمية حيث «الإيواء» مصطلح قانوني',
    },
    {
        avoid: 'القسم الداخلي',
        prefer: 'جناح الاستضافة',
        rationale: 'تتبع نفس منطق «الاستضافة». الجناح بُعد معماري دافئ، القسم بُعد إداري بارد.',
        category: 'setting',
    },
    {
        avoid: 'غرفة العزل',
        prefer: 'غرفة الراحة الفردية',
        rationale: 'لا تأطير عقابي في فضاء رعاية. حتى الفصل الصحّي له اسم يحفظ كرامته.',
        category: 'setting',
    },
    {
        avoid: 'أرشفة',
        prefer: 'سجل تطوّر',
        rationale: 'السجل يُقرأ، الأرشيف يُنسى. نريد ذاكرة حيّة، لا أوراق متراكمة.',
        category: 'setting',
    },

    // ───── القدرات والنموّ (capability) ─────
    {
        avoid: 'نقص قدرة',
        prefer: 'مهارة قيد التطوير',
        rationale: 'كل قدرة قابلة للنموّ. التأطير الديناميكي يحفظ مساحة الاحتمال.',
        category: 'capability',
    },
    {
        avoid: 'لا يستطيع',
        prefer: 'يحتاج دعماً في',
        rationale: 'النفي مغلق، الدعم مفتوح. إعادة صياغة تستدعي خطّة بدلاً من حكم.',
        category: 'capability',
    },
    {
        avoid: 'لا يتعاون',
        prefer: 'يحتاج وقتاً للاندماج',
        rationale: 'نسبة المسؤولية إلى الفرد تختزل البيئة. الوقت والجسر التواصلي مسؤوليتنا.',
        category: 'capability',
    },
    {
        avoid: 'سلوك سلبي',
        prefer: 'سلوك يستدعي فهماً أعمق',
        rationale: 'السلوك إشارة، لا صفة. نسأل «ماذا يقول هذا السلوك؟» قبل وصفه بالسلبية.',
        category: 'capability',
    },

    // ───── الأسرة والمجتمع (family) ─────
    {
        avoid: 'الأهل غير متعاونين',
        prefer: 'الأسرة تحتاج جسر تواصل',
        rationale: 'العائلة شريك لا متّهَم. حين يضعف التواصل ندنو، لا نشكو.',
        category: 'family',
    },
    {
        avoid: 'حالة مهملة',
        prefer: 'حالة تستدعي تدخّل الحماية الاجتماعية',
        rationale: 'الإهمال حكم، التدخّل خطّة. نسلك المسار النظامي بدلاً من الوصف الانطباعي.',
        category: 'family',
    },

    // ───── المخاطر والحوادث (risk) ─────
    {
        avoid: 'حادث',
        prefer: 'حدث يستدعي تعلّماً',
        rationale: 'سجل المخاطر للتعلّم لا للوم. التأطير يدفع للجذور لا للعقاب.',
        category: 'risk',
        validContext: 'البلاغات الرسمية للجهات الخارجية حيث «حادث» مصطلح قانوني',
    },
    {
        avoid: 'شكوى المستفيد',
        prefer: 'صوت المستفيد',
        rationale: 'الشكوى صوت يُستحبَّب. التأطير الإيجابي يفتح القناة بدل أن يُحرج المُبلِّغ.',
        category: 'risk',
    },
    {
        avoid: 'خطأ موظف',
        prefer: 'فرصة تحسين',
        rationale: 'في السجلّ التحسيني فقط. الحوادث الجسيمة تظلّ جسيمة — لا نموّه على الإهمال الجسيم.',
        category: 'risk',
        validContext: 'الإهمال الجسيم أو المخالفات النظامية تُسمّى باسمها',
    },

    // ───── التمكين والاستقلال (empowerment) ─────
    {
        avoid: 'هدف صغير',
        prefer: 'خطوة استقلال',
        rationale: 'لا يوجد هدف صغير في التأهيل — كل خطوة ذات قيمة تراكمية في طريق الاستقلال.',
        category: 'empowerment',
    },
    {
        avoid: 'تمكين',
        prefer: 'تمكين · دمج · استقلال',
        rationale: 'محاور الاستراتيجية الوطنية للأشخاص ذوي الإعاقة الثلاث. ذكرها معاً يحفظ الإطار.',
        category: 'empowerment',
        validContext: 'حين السياق محدّد بأحد المحاور تحديداً',
    },
    {
        avoid: 'التأهيل المجتمعي',
        prefer: 'الدمج المجتمعي',
        rationale: 'التأهيل يُعدّ الفرد للمجتمع، الدمج يُعدّ المجتمع للفرد. اتساق مع نموذج العوق المجتمعي.',
        category: 'empowerment',
    },
];

/** خرائط مساعِدة جاهزة. */
export const DIGNITY_BY_CATEGORY: Record<DignityCategory, readonly DignityTerm[]> = {
    identity: DIGNITY_TERMS.filter(t => t.category === 'identity'),
    framing: DIGNITY_TERMS.filter(t => t.category === 'framing'),
    care: DIGNITY_TERMS.filter(t => t.category === 'care'),
    setting: DIGNITY_TERMS.filter(t => t.category === 'setting'),
    capability: DIGNITY_TERMS.filter(t => t.category === 'capability'),
    family: DIGNITY_TERMS.filter(t => t.category === 'family'),
    risk: DIGNITY_TERMS.filter(t => t.category === 'risk'),
    empowerment: DIGNITY_TERMS.filter(t => t.category === 'empowerment'),
};

/**
 * يبحث عن مصطلح في القائمة المُتجنَّبة. يُرجع مدخل القائمة إن وُجد، أو
 * `undefined`. مفيد لـ ESLint custom rules ومراجعات الكود.
 *
 * المطابقة كلمة-كاملة بسيطة: يقتطع الفراغات، ولا يطابق جزءاً من كلمة
 * أكبر (مثلاً «المعاقين» لا يطابق «معاق» — وهذا مقصود لأنّ الجمع
 * يحتاج معالجة لغوية أوسع تأتي لاحقاً).
 */
export const findAvoidedTerm = (input: string): DignityTerm | undefined => {
    const trimmed = input.trim();
    return DIGNITY_TERMS.find(t => t.avoid === trimmed);
};

/**
 * الأسئلة الثلاثة الإلزامية قبل أيّ توصية أو تقرير عن مستفيد، مأخوذة من
 * بوصلة العوق المجتمعي. تُعرض في style-guide وتُستخدم prompt
 * helper لمحرّر الـ AI assistants داخل التطبيق.
 */
export const COMPASS_QUESTIONS: readonly string[] = [
    'ما الحاجز البيئي/المجتمعي الذي يواجهه المستفيد الآن؟',
    'ما الدعم الذي يجعل هذا الحاجز ينحلّ، لا الذي يجعل الفرد يتكيّف معه؟',
    'كيف نقيس النجاح بمشاركة المستفيد ورضاه، لا بإغلاق الإجراء؟',
];

const dignityLanguage = {
    DIGNITY_TERMS,
    DIGNITY_BY_CATEGORY,
    COMPASS_QUESTIONS,
    findAvoidedTerm,
};

export default dignityLanguage;
