/**
 * بصيرة - الأصول الأساسية للنظام
 * Domain Assets for Baseerah Rehabilitation Center Management System
 * مركز التأهيل الشامل بالباحة
 */

// ═══════════════════════════════════════════════════════════════════════════
// ICF CODES (التصنيف الدولي للأداء)
// ═══════════════════════════════════════════════════════════════════════════

export type ICFCategory = "Mobility" | "Cognitive" | "Speech" | "SelfCare" | "Communication";
export type ICFQualifier = 0 | 1 | 2 | 3 | 4;

export interface ICFCode {
    code: string;
    englishLabel: string;
    arabicLabel: string;
    category: ICFCategory;
}

export const ICF_CODES: ICFCode[] = [
    // === MOBILITY (الحركة) ===
    { code: "d410", englishLabel: "Changing basic body position", arabicLabel: "تغيير وضع الجسم الأساسي", category: "Mobility" },
    { code: "d415", englishLabel: "Maintaining a body position", arabicLabel: "الحفاظ على وضع الجسم", category: "Mobility" },
    { code: "d420", englishLabel: "Transferring oneself", arabicLabel: "نقل النفس/التحويل", category: "Mobility" },
    { code: "d430", englishLabel: "Lifting and carrying objects", arabicLabel: "رفع وحمل الأشياء", category: "Mobility" },
    { code: "d440", englishLabel: "Fine hand use", arabicLabel: "استخدام اليد الدقيق", category: "Mobility" },
    { code: "d445", englishLabel: "Hand and arm use", arabicLabel: "استخدام اليد والذراع", category: "Mobility" },
    { code: "d450", englishLabel: "Walking", arabicLabel: "المشي", category: "Mobility" },
    { code: "d4500", englishLabel: "Walking short distances", arabicLabel: "المشي لمسافات قصيرة", category: "Mobility" },
    { code: "d4501", englishLabel: "Walking long distances", arabicLabel: "المشي لمسافات طويلة", category: "Mobility" },
    { code: "d451", englishLabel: "Going up and down stairs", arabicLabel: "صعود ونزول السلالم", category: "Mobility" },
    { code: "d455", englishLabel: "Moving around", arabicLabel: "التنقل/التحرك", category: "Mobility" },
    { code: "d465", englishLabel: "Moving around using equipment", arabicLabel: "التنقل باستخدام المعدات", category: "Mobility" },

    // === COGNITIVE (الإدراك) ===
    { code: "b110", englishLabel: "Consciousness functions", arabicLabel: "وظائف الوعي", category: "Cognitive" },
    { code: "b114", englishLabel: "Orientation functions", arabicLabel: "وظائف التوجه", category: "Cognitive" },
    { code: "b117", englishLabel: "Intellectual functions", arabicLabel: "الوظائف الذهنية/العقلية", category: "Cognitive" },
    { code: "b140", englishLabel: "Attention functions", arabicLabel: "وظائف الانتباه", category: "Cognitive" },
    { code: "b144", englishLabel: "Memory functions", arabicLabel: "وظائف الذاكرة", category: "Cognitive" },
    { code: "b152", englishLabel: "Emotional functions", arabicLabel: "الوظائف العاطفية", category: "Cognitive" },
    { code: "b164", englishLabel: "Higher-level cognitive functions", arabicLabel: "الوظائف الإدراكية العليا", category: "Cognitive" },
    { code: "b167", englishLabel: "Mental functions of language", arabicLabel: "الوظائف العقلية للغة", category: "Cognitive" },

    // === SPEECH (النطق) ===
    { code: "b310", englishLabel: "Voice functions", arabicLabel: "وظائف الصوت", category: "Speech" },
    { code: "b320", englishLabel: "Articulation functions", arabicLabel: "وظائف النطق/التعبير اللفظي", category: "Speech" },
    { code: "b330", englishLabel: "Fluency and rhythm of speech", arabicLabel: "طلاقة وإيقاع الكلام", category: "Speech" },

    // === SELF-CARE (الرعاية الذاتية) ===
    { code: "d510", englishLabel: "Washing oneself", arabicLabel: "الاستحمام/غسل النفس", category: "SelfCare" },
    { code: "d520", englishLabel: "Caring for body parts", arabicLabel: "العناية بأجزاء الجسم", category: "SelfCare" },
    { code: "d530", englishLabel: "Toileting", arabicLabel: "استخدام المرحاض", category: "SelfCare" },
    { code: "d540", englishLabel: "Dressing", arabicLabel: "ارتداء الملابس", category: "SelfCare" },
    { code: "d550", englishLabel: "Eating", arabicLabel: "الأكل", category: "SelfCare" },
    { code: "d560", englishLabel: "Drinking", arabicLabel: "الشرب", category: "SelfCare" },
    { code: "d570", englishLabel: "Looking after one's health", arabicLabel: "الاهتمام بصحة النفس", category: "SelfCare" },

    // === COMMUNICATION (التواصل) ===
    { code: "d310", englishLabel: "Receiving spoken messages", arabicLabel: "استقبال الرسائل المنطوقة", category: "Communication" },
    { code: "d315", englishLabel: "Receiving nonverbal messages", arabicLabel: "استقبال الرسائل غير اللفظية", category: "Communication" },
    { code: "d330", englishLabel: "Speaking", arabicLabel: "التحدث/الكلام", category: "Communication" },
    { code: "d335", englishLabel: "Producing nonverbal messages", arabicLabel: "إنتاج رسائل غير لفظية", category: "Communication" },
    { code: "d350", englishLabel: "Conversation", arabicLabel: "المحادثة", category: "Communication" },
    { code: "d360", englishLabel: "Using communication devices", arabicLabel: "استخدام أجهزة التواصل", category: "Communication" }
];

export const ICF_QUALIFIERS = {
    0: { label: "لا توجد مشكلة", percentage: "0-4%" },
    1: { label: "مشكلة طفيفة", percentage: "5-24%" },
    2: { label: "مشكلة متوسطة", percentage: "25-49%" },
    3: { label: "مشكلة شديدة", percentage: "50-95%" },
    4: { label: "مشكلة كاملة", percentage: "96-100%" }
} as const;

export const ICF_CATEGORY_LABELS: Record<ICFCategory, string> = {
    Mobility: "الحركة",
    Cognitive: "الإدراك",
    Speech: "النطق",
    SelfCare: "الرعاية الذاتية",
    Communication: "التواصل"
};

// ═══════════════════════════════════════════════════════════════════════════
// AL-BAHA FAMILIES & NAMES
// ═══════════════════════════════════════════════════════════════════════════

export const AL_BAHA_FAMILIES = [
    "الغامدي", "الزهراني", "العمري", "الدوسي", "الحسني",
    "البيضاني", "الجندبي", "العامري", "الخثعمي", "السعدي"
] as const;

export const MALE_FIRST_NAMES = [
    "محمد", "عبدالرحمن", "خالد", "سعود", "فهد", "تركي",
    "سلطان", "ناصر", "أحمد", "سعد", "عبدالله", "بندر"
];

export const FEMALE_FIRST_NAMES = [
    "نورة", "فاطمة", "سارة", "موضي", "العنود", "هيا",
    "لطيفة", "منيرة", "جواهر", "ريم", "أمل", "دلال"
];

// ═══════════════════════════════════════════════════════════════════════════
// MEDICAL DIAGNOSES & MEDICATIONS
// ═══════════════════════════════════════════════════════════════════════════

export interface MedicalDiagnosis {
    code: string;
    icd: string;
    english: string;
    arabic: string;
}

export const MEDICAL_DIAGNOSES: MedicalDiagnosis[] = [
    { code: "CP", icd: "G80", english: "Cerebral Palsy", arabic: "الشلل الدماغي" },
    { code: "ASD", icd: "F84.0", english: "Autism Spectrum Disorder", arabic: "اضطراب طيف التوحد" },
    { code: "DS", icd: "Q90", english: "Down Syndrome", arabic: "متلازمة داون" },
    { code: "ID", icd: "F70-F79", english: "Intellectual Disability", arabic: "الإعاقة الذهنية" },
    { code: "EPI", icd: "G40", english: "Epilepsy", arabic: "الصرع" },
    { code: "MD", icd: "G71", english: "Muscular Dystrophy", arabic: "ضمور العضلات" },
    { code: "GDD", icd: "F88", english: "Global Developmental Delay", arabic: "تأخر النمو الشامل" },
    { code: "DIPLEGIA", icd: "G80.1", english: "Spastic Diplegia", arabic: "الشلل النصفي السفلي التشنجي" },
    { code: "QUADRI", icd: "G80.0", english: "Spastic Quadriplegia", arabic: "الشلل الرباعي التشنجي" },
    { code: "ADHD", icd: "F90", english: "ADHD", arabic: "اضطراب فرط الحركة ونقص الانتباه" },
    { code: "SB", icd: "Q05", english: "Spina Bifida", arabic: "الشق الشوكي" },
    { code: "HC", icd: "G91", english: "Hydrocephalus", arabic: "استسقاء الدماغ" }
];

export interface Medication {
    trade: string;
    generic: string;
    arabic: string;
}

export const MEDICATIONS_DATABASE = {
    antiEpileptics: [
        { trade: "Depakine", generic: "Valproic Acid", arabic: "حمض الفالبرويك" },
        { trade: "Tegretol", generic: "Carbamazepine", arabic: "كاربامازيبين" },
        { trade: "Keppra", generic: "Levetiracetam", arabic: "ليفيتيراسيتام" },
        { trade: "Lamictal", generic: "Lamotrigine", arabic: "لاموتريجين" },
        { trade: "Phenobarbital", generic: "Phenobarbital", arabic: "فينوباربيتال" }
    ] as Medication[],
    muscleRelaxants: [
        { trade: "Lioresal", generic: "Baclofen", arabic: "باكلوفين" },
        { trade: "Valium", generic: "Diazepam", arabic: "ديازيبام" },
        { trade: "Botox", generic: "Botulinum Toxin", arabic: "توكسين البوتولينوم" }
    ] as Medication[],
    behavioral: [
        { trade: "Risperdal", generic: "Risperidone", arabic: "ريسبيريدون" },
        { trade: "Abilify", generic: "Aripiprazole", arabic: "أريبيبرازول" },
        { trade: "Ritalin", generic: "Methylphenidate", arabic: "ميثيلفينيدات" }
    ] as Medication[]
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// SOCIAL RESEARCH FORM SCHEMA
// ═══════════════════════════════════════════════════════════════════════════

export interface FormFieldOption {
    value: string;
    label: string;
}

export interface FormField {
    id: string;
    label: string;
    type: "select" | "multiSelect" | "text" | "number" | "date";
    options?: FormFieldOption[];
    required?: boolean;
}

export const SOCIAL_RESEARCH_SCHEMA: Record<string, FormField> = {
    economicStatus: {
        id: "economicStatus",
        label: "الحالة الاقتصادية للأسرة",
        type: "select",
        required: true,
        options: [
            { value: "excellent", label: "ممتازة" },
            { value: "good", label: "جيدة" },
            { value: "moderate", label: "متوسطة" },
            { value: "poor", label: "ضعيفة" }
        ]
    },
    incomeSources: {
        id: "incomeSources",
        label: "مصادر الدخل",
        type: "multiSelect",
        options: [
            { value: "salary", label: "راتب وظيفي" },
            { value: "socialSecurity", label: "ضمان اجتماعي" },
            { value: "disabilitySupport", label: "إعانة إعاقة" },
            { value: "retirement", label: "تقاعد" },
            { value: "charity", label: "مساعدات خيرية" },
            { value: "other", label: "أخرى" }
        ]
    },
    housingType: {
        id: "housingType",
        label: "نوع السكن",
        type: "select",
        required: true,
        options: [
            { value: "owned", label: "ملك" },
            { value: "rented", label: "إيجار" },
            { value: "publicHousing", label: "سكن حكومي" },
            { value: "familyHousing", label: "سكن مع الأهل" },
            { value: "other", label: "أخرى" }
        ]
    },
    guardianRelation: {
        id: "guardianRelation",
        label: "صلة القرابة بولي الأمر",
        type: "select",
        required: true,
        options: [
            { value: "father", label: "أب" },
            { value: "mother", label: "أم" },
            { value: "brother", label: "أخ" },
            { value: "sister", label: "أخت" },
            { value: "uncle", label: "عم" },
            { value: "legalGuardian", label: "وكيل شرعي" }
        ]
    }
};

// ═══════════════════════════════════════════════════════════════════════════
// ALERT TAGS SYSTEM
// ═══════════════════════════════════════════════════════════════════════════

export interface AlertTag {
    id: string;
    label: string;
    color: string;
    icon: string;
}

export const ALERT_TAGS: AlertTag[] = [
    { id: "diabetic", label: "مريض سكري", color: "#3498DB", icon: "💉" },
    { id: "fallRisk", label: "خطر سقوط", color: "#E67E22", icon: "⚠️" },
    { id: "foodAllergy", label: "حساسية طعام", color: "#E74C3C", icon: "🚫" },
    { id: "swallowingDifficulty", label: "صعوبة بلع", color: "#9B59B6", icon: "🍽️" },
    { id: "aggressiveBehavior", label: "سلوك عدواني", color: "#C0392B", icon: "⚡" },
    { id: "epilepsy", label: "حالة صرع", color: "#F1C40F", icon: "🧠" },
    { id: "hearingImpaired", label: "ضعف سمع", color: "#1ABC9C", icon: "👂" },
    { id: "visuallyImpaired", label: "ضعف بصر", color: "#34495E", icon: "👁️" }
];

// ═══════════════════════════════════════════════════════════════════════════
// SEED BENEFICIARIES - 10 Realistic Al-Baha Beneficiaries
// ═══════════════════════════════════════════════════════════════════════════

export interface SeedBeneficiary {
    fileId: string;
    nationalId: string;
    fullName: string;
    gender: "male" | "female";
    birthDate: string;
    diagnosis: { code: string; arabic: string };
    admissionDate: string;
    status: "active" | "daycare" | "discharged";
    room: string | null;
    bed: string | null;
    alerts: string[];
    medications: string[];
    guardian: { name: string; relation: string; phone: string };
}

export const SEED_BENEFICIARIES: SeedBeneficiary[] = [
    {
        fileId: "RHB-2026-001",
        nationalId: "1098765432",
        fullName: "محمد بن سعد بن عبدالله الغامدي",
        gender: "male",
        birthDate: "1995-03-15",
        diagnosis: { code: "CP", arabic: "الشلل الدماغي" },
        admissionDate: "2020-01-10",
        status: "active",
        room: "أ-101",
        bed: "1",
        alerts: ["fallRisk", "epilepsy"],
        medications: ["Lioresal", "Depakine"],
        guardian: { name: "سعد بن عبدالله الغامدي", relation: "father", phone: "0551234567" }
    },
    {
        fileId: "RHB-2026-002",
        nationalId: "1087654321",
        fullName: "عبدالرحمن بن أحمد بن فهد الزهراني",
        gender: "male",
        birthDate: "2010-07-22",
        diagnosis: { code: "ASD", arabic: "اضطراب طيف التوحد" },
        admissionDate: "2022-05-15",
        status: "active",
        room: "ب-205",
        bed: "2",
        alerts: ["foodAllergy"],
        medications: ["Risperdal"],
        guardian: { name: "أحمد بن فهد الزهراني", relation: "father", phone: "0559876543" }
    },
    {
        fileId: "RHB-2026-003",
        nationalId: "1076543210",
        fullName: "خالد بن سلطان بن محمد العمري",
        gender: "male",
        birthDate: "2005-11-08",
        diagnosis: { code: "DS", arabic: "متلازمة داون" },
        admissionDate: "2018-09-01",
        status: "active",
        room: "أ-102",
        bed: "1",
        alerts: ["diabetic"],
        medications: [],
        guardian: { name: "سلطان بن محمد العمري", relation: "father", phone: "0541122334" }
    },
    {
        fileId: "RHB-2026-004",
        nationalId: "1065432109",
        fullName: "سعود بن عبدالله بن سعيد الدوسي",
        gender: "male",
        birthDate: "2000-02-28",
        diagnosis: { code: "QUADRI", arabic: "الشلل الرباعي التشنجي" },
        admissionDate: "2019-03-20",
        status: "active",
        room: "ج-301",
        bed: "1",
        alerts: ["fallRisk", "swallowingDifficulty"],
        medications: ["Lioresal", "Botox"],
        guardian: { name: "عبدالله بن سعيد الدوسي", relation: "father", phone: "0552233445" }
    },
    {
        fileId: "RHB-2026-005",
        nationalId: "1054321098",
        fullName: "فهد بن تركي بن ناصر الغامدي",
        gender: "male",
        birthDate: "2012-06-10",
        diagnosis: { code: "ID", arabic: "الإعاقة الذهنية" },
        admissionDate: "2023-01-15",
        status: "active",
        room: "ب-206",
        bed: "1",
        alerts: [],
        medications: [],
        guardian: { name: "تركي بن ناصر الغامدي", relation: "father", phone: "0563344556" }
    },
    {
        fileId: "RHB-2026-006",
        nationalId: "1043210987",
        fullName: "نورة بنت سعد بن عبدالله الزهراني",
        gender: "female",
        birthDate: "2008-09-25",
        diagnosis: { code: "EPI", arabic: "الصرع" },
        admissionDate: "2021-07-01",
        status: "active",
        room: "د-401",
        bed: "2",
        alerts: ["epilepsy"],
        medications: ["Depakine", "Keppra"],
        guardian: { name: "سعد بن عبدالله الزهراني", relation: "father", phone: "0574455667" }
    },
    {
        fileId: "RHB-2026-007",
        nationalId: "1032109876",
        fullName: "فاطمة بنت محمد بن أحمد الغامدي",
        gender: "female",
        birthDate: "2015-01-30",
        diagnosis: { code: "GDD", arabic: "تأخر النمو الشامل" },
        admissionDate: "2024-02-10",
        status: "active",
        room: "د-402",
        bed: "1",
        alerts: [],
        medications: [],
        guardian: { name: "محمد بن أحمد الغامدي", relation: "father", phone: "0585566778" }
    },
    {
        fileId: "RHB-2026-008",
        nationalId: "1021098765",
        fullName: "سارة بنت عبدالرحمن بن خالد العمري",
        gender: "female",
        birthDate: "2003-04-18",
        diagnosis: { code: "DIPLEGIA", arabic: "الشلل النصفي السفلي التشنجي" },
        admissionDate: "2017-11-05",
        status: "active",
        room: "د-403",
        bed: "1",
        alerts: ["fallRisk"],
        medications: ["Lioresal"],
        guardian: { name: "عبدالرحمن بن خالد العمري", relation: "father", phone: "0596677889" }
    },
    {
        fileId: "RHB-2026-009",
        nationalId: "1010987654",
        fullName: "موضي بنت فهد بن سلطان الدوسي",
        gender: "female",
        birthDate: "2018-12-05",
        diagnosis: { code: "HC", arabic: "استسقاء الدماغ" },
        admissionDate: "2023-06-20",
        status: "active",
        room: "د-404",
        bed: "2",
        alerts: ["fallRisk"],
        medications: [],
        guardian: { name: "فهد بن سلطان الدوسي", relation: "father", phone: "0507788990" }
    },
    {
        fileId: "RHB-2026-010",
        nationalId: "1009876543",
        fullName: "العنود بنت تركي بن سعد الزهراني",
        gender: "female",
        birthDate: "2007-08-14",
        diagnosis: { code: "ADHD", arabic: "اضطراب فرط الحركة ونقص الانتباه" },
        admissionDate: "2022-09-01",
        status: "daycare",
        room: null,
        bed: null,
        alerts: ["aggressiveBehavior"],
        medications: ["Ritalin"],
        guardian: { name: "تركي بن سعد الزهراني", relation: "father", phone: "0518899001" }
    }
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get ICF codes grouped by category
 */
export function getICFCodesByCategory(): Record<ICFCategory, ICFCode[]> {
    return ICF_CODES.reduce((acc, code) => {
        if (!acc[code.category]) {
            acc[code.category] = [];
        }
        acc[code.category].push(code);
        return acc;
    }, {} as Record<ICFCategory, ICFCode[]>);
}

/**
 * Get diagnosis by code
 */
export function getDiagnosisByCode(code: string): MedicalDiagnosis | undefined {
    return MEDICAL_DIAGNOSES.find(d => d.code === code);
}

/**
 * Get alert tag by id
 */
export function getAlertTagById(id: string): AlertTag | undefined {
    return ALERT_TAGS.find(tag => tag.id === id);
}

/**
 * Get all medications as flat array
 */
export function getAllMedications(): Medication[] {
    return [
        ...MEDICATIONS_DATABASE.antiEpileptics,
        ...MEDICATIONS_DATABASE.muscleRelaxants,
        ...MEDICATIONS_DATABASE.behavioral
    ];
}
