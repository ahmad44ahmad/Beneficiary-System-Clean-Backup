-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة | محرك القرارات الذكي (Smart Decision Engine)
-- الإصدار: 3.0 | التاريخ: 2026-01-12
-- الغرض: تحويل بصيرة من نظام أرشفة إلى مساعد ذكي يتنبأ بالمخاطر
-- ═══════════════════════════════════════════════════════════════════════════════
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │           الخطوة 1: التوحيد المعياري للبيانات (Data Standardization)        │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 1.1 جدول أكواد التشخيص (ICD-10 مبسط)
CREATE TABLE IF NOT EXISTS diagnosis_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icd_code TEXT UNIQUE NOT NULL,
    -- مثال: F70, G40
    icd_name_ar TEXT NOT NULL,
    -- الاسم بالعربية
    icd_name_en TEXT,
    -- الاسم بالإنجليزية
    category TEXT NOT NULL,
    -- التصنيف الرئيسي
    subcategory TEXT,
    -- التصنيف الفرعي
    severity_weight INTEGER DEFAULT 1,
    -- وزن الخطورة (1-10)
    common_medications TEXT [],
    -- الأدوية الشائعة
    monitoring_requirements TEXT [],
    -- متطلبات المراقبة
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج التشخيصات الشائعة في مراكز التأهيل
INSERT INTO diagnosis_codes (
        icd_code,
        icd_name_ar,
        icd_name_en,
        category,
        subcategory,
        severity_weight,
        common_medications,
        monitoring_requirements
    )
VALUES (
        'F70',
        'إعاقة ذهنية خفيفة',
        'Mild Intellectual Disability',
        'إعاقات ذهنية',
        'خفيفة',
        3,
        ARRAY ['مكملات غذائية'],
        ARRAY ['متابعة سلوكية']
    ),
    (
        'F71',
        'إعاقة ذهنية متوسطة',
        'Moderate Intellectual Disability',
        'إعاقات ذهنية',
        'متوسطة',
        5,
        ARRAY ['مكملات غذائية'],
        ARRAY ['متابعة سلوكية', 'دعم تعليمي']
    ),
    (
        'F72',
        'إعاقة ذهنية شديدة',
        'Severe Intellectual Disability',
        'إعاقات ذهنية',
        'شديدة',
        7,
        ARRAY ['مكملات غذائية', 'مهدئات عند الحاجة'],
        ARRAY ['متابعة مستمرة', 'رعاية طبية']
    ),
    (
        'F84.0',
        'التوحد الطفولي',
        'Childhood Autism',
        'اضطرابات طيف التوحد',
        'كلاسيكي',
        6,
        ARRAY ['ريسبيريدون', 'أريبيبرازول'],
        ARRAY ['متابعة سلوكية', 'جلسات تخاطب']
    ),
    (
        'F84.5',
        'متلازمة أسبرجر',
        'Asperger Syndrome',
        'اضطرابات طيف التوحد',
        'عالي الأداء',
        4,
        ARRAY []::TEXT [],
        ARRAY ['دعم اجتماعي']
    ),
    (
        'G40',
        'الصرع',
        'Epilepsy',
        'أمراض عصبية',
        'صرع',
        8,
        ARRAY ['فينوباربيتال', 'كاربامازيبين', 'فالبروات'],
        ARRAY ['مراقبة نوبات', 'فحص دم دوري']
    ),
    (
        'G80',
        'الشلل الدماغي',
        'Cerebral Palsy',
        'أمراض عصبية',
        'شلل دماغي',
        7,
        ARRAY ['باكلوفين', 'بوتوكس'],
        ARRAY ['علاج طبيعي', 'مراقبة تنفسية']
    ),
    (
        'Q90',
        'متلازمة داون',
        'Down Syndrome',
        'متلازمات جينية',
        'كروموسوم 21',
        5,
        ARRAY ['هرمون الغدة الدرقية'],
        ARRAY ['فحص قلب', 'فحص سمع', 'فحص نظر']
    ),
    (
        'E10',
        'السكري النوع الأول',
        'Type 1 Diabetes',
        'أمراض الغدد',
        'سكري',
        8,
        ARRAY ['إنسولين'],
        ARRAY ['قياس سكر', 'فحص HbA1c']
    ),
    (
        'I10',
        'ارتفاع ضغط الدم',
        'Hypertension',
        'أمراض قلبية',
        'ضغط',
        6,
        ARRAY ['أملوديبين', 'ليزينوبريل'],
        ARRAY ['قياس ضغط يومي']
    ) ON CONFLICT (icd_code) DO NOTHING;
-- 1.2 جدول دليل الأدوية المعياري
CREATE TABLE IF NOT EXISTS medication_catalog (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generic_name TEXT NOT NULL,
    -- الاسم العلمي
    generic_name_ar TEXT NOT NULL,
    -- الاسم العلمي بالعربية
    brand_names TEXT [],
    -- الأسماء التجارية
    drug_class TEXT NOT NULL,
    -- الفئة الدوائية
    drug_class_ar TEXT,
    -- الفئة بالعربية
    route TEXT DEFAULT 'oral',
    -- طريقة الإعطاء
    common_dosages TEXT [],
    -- الجرعات الشائعة
    frequency_options TEXT [],
    -- خيارات التكرار
    max_daily_dose TEXT,
    -- الجرعة القصوى
    contraindications TEXT [],
    -- موانع الاستعمال
    side_effects TEXT [],
    -- الآثار الجانبية
    monitoring_required TEXT [],
    -- الفحوصات المطلوبة
    high_risk BOOLEAN DEFAULT false,
    -- دواء عالي الخطورة
    requires_refrigeration BOOLEAN DEFAULT false,
    is_controlled BOOLEAN DEFAULT false,
    -- دواء مضبوط
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(generic_name)
);
-- إدراج الأدوية الشائعة
INSERT INTO medication_catalog (
        generic_name,
        generic_name_ar,
        brand_names,
        drug_class,
        drug_class_ar,
        route,
        common_dosages,
        high_risk,
        monitoring_required
    )
VALUES (
        'Phenobarbital',
        'فينوباربيتال',
        ARRAY ['لمينال', 'فينوبارب'],
        'Anticonvulsant',
        'مضاد صرع',
        'oral',
        ARRAY ['30mg', '60mg', '100mg'],
        true,
        ARRAY ['مستوى الدواء في الدم', 'وظائف الكبد']
    ),
    (
        'Carbamazepine',
        'كاربامازيبين',
        ARRAY ['تيجريتول'],
        'Anticonvulsant',
        'مضاد صرع',
        'oral',
        ARRAY ['200mg', '400mg'],
        true,
        ARRAY ['CBC', 'وظائف الكبد']
    ),
    (
        'Valproic Acid',
        'حمض الفالبرويك',
        ARRAY ['ديباكين', 'ابيفال'],
        'Anticonvulsant',
        'مضاد صرع',
        'oral',
        ARRAY ['250mg', '500mg'],
        true,
        ARRAY ['وظائف الكبد', 'صفائح دموية']
    ),
    (
        'Risperidone',
        'ريسبيريدون',
        ARRAY ['ريسبردال'],
        'Antipsychotic',
        'مضاد ذهان',
        'oral',
        ARRAY ['0.5mg', '1mg', '2mg'],
        false,
        ARRAY ['وزن', 'سكر الدم']
    ),
    (
        'Baclofen',
        'باكلوفين',
        ARRAY ['ليوريزال'],
        'Muscle Relaxant',
        'مرخي عضلات',
        'oral',
        ARRAY ['5mg', '10mg', '25mg'],
        false,
        ARRAY []::TEXT []
    ),
    (
        'Insulin Regular',
        'إنسولين عادي',
        ARRAY ['هيومولين R', 'نوفولين R'],
        'Antidiabetic',
        'خافض سكر',
        'injection',
        ARRAY ['units'],
        true,
        ARRAY ['سكر الدم']
    ),
    (
        'Omeprazole',
        'أوميبرازول',
        ARRAY ['لوسيك', 'بريلوسيك'],
        'PPI',
        'مثبط مضخة البروتون',
        'oral',
        ARRAY ['20mg', '40mg'],
        false,
        ARRAY []::TEXT []
    ),
    (
        'Amlodipine',
        'أملوديبين',
        ARRAY ['نورفاسك'],
        'Calcium Channel Blocker',
        'حاصر قنوات الكالسيوم',
        'oral',
        ARRAY ['5mg', '10mg'],
        false,
        ARRAY ['ضغط الدم']
    ),
    (
        'Levothyroxine',
        'ليفوثيروكسين',
        ARRAY ['الثيروكسين', 'يوثيروكس'],
        'Thyroid Hormone',
        'هرمون الغدة الدرقية',
        'oral',
        ARRAY ['25mcg', '50mcg', '100mcg'],
        false,
        ARRAY ['TSH']
    ),
    (
        'Paracetamol',
        'باراسيتامول',
        ARRAY ['بنادول', 'فيفادول'],
        'Analgesic',
        'مسكن',
        'oral',
        ARRAY ['500mg', '1000mg'],
        false,
        ARRAY []::TEXT []
    ) ON CONFLICT (generic_name) DO NOTHING;
-- 1.3 جدول التفاعلات الدوائية
CREATE TABLE IF NOT EXISTS drug_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    drug_a_id UUID REFERENCES medication_catalog(id),
    drug_b_id UUID REFERENCES medication_catalog(id),
    drug_a_name TEXT NOT NULL,
    -- للبحث السريع
    drug_b_name TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (
        severity IN ('mild', 'moderate', 'severe', 'contraindicated')
    ),
    severity_ar TEXT NOT NULL,
    -- الشدة بالعربية
    interaction_type TEXT,
    -- نوع التفاعل
    clinical_effect TEXT NOT NULL,
    -- التأثير السريري
    clinical_effect_ar TEXT,
    management TEXT,
    -- كيفية التعامل
    evidence_level TEXT,
    -- مستوى الأدلة
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drug_a_name, drug_b_name)
);
-- إدراج التفاعلات المهمة
INSERT INTO drug_interactions (
        drug_a_name,
        drug_b_name,
        severity,
        severity_ar,
        interaction_type,
        clinical_effect,
        clinical_effect_ar,
        management
    )
VALUES (
        'Phenobarbital',
        'Valproic Acid',
        'moderate',
        'متوسط',
        'Pharmacokinetic',
        'Decreased valproic acid levels',
        'انخفاض مستوى حمض الفالبرويك',
        'مراقبة مستوى الدواء وتعديل الجرعة'
    ),
    (
        'Carbamazepine',
        'Valproic Acid',
        'moderate',
        'متوسط',
        'Pharmacokinetic',
        'Decreased valproic acid levels',
        'انخفاض مستوى حمض الفالبرويك',
        'مراقبة مستوى الدواء'
    ),
    (
        'Phenobarbital',
        'Warfarin',
        'severe',
        'شديد',
        'Pharmacokinetic',
        'Decreased anticoagulant effect',
        'انخفاض تأثير مميع الدم',
        'تجنب أو مراقبة INR'
    ),
    (
        'Insulin Regular',
        'Phenobarbital',
        'mild',
        'خفيف',
        'Pharmacodynamic',
        'May alter glucose control',
        'قد يؤثر على التحكم بالسكر',
        'مراقبة سكر الدم'
    ),
    (
        'Amlodipine',
        'Carbamazepine',
        'moderate',
        'متوسط',
        'Pharmacokinetic',
        'Decreased amlodipine effect',
        'انخفاض تأثير خافض الضغط',
        'مراقبة ضغط الدم'
    ) ON CONFLICT (drug_a_name, drug_b_name) DO NOTHING;
-- 1.4 جدول أدوية المستفيد (مجدولة ومنظمة)
CREATE TABLE IF NOT EXISTS beneficiary_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    medication_id UUID REFERENCES medication_catalog(id),
    medication_name TEXT NOT NULL,
    -- الاسم (للحالات بدون catalog)
    dosage TEXT NOT NULL,
    -- الجرعة
    route TEXT DEFAULT 'oral',
    -- طريقة الإعطاء
    frequency TEXT NOT NULL,
    -- التكرار (مرتين يومياً، كل 8 ساعات)
    frequency_times TIME [],
    -- الأوقات المحددة
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    -- تاريخ الإيقاف (null = مستمر)
    prescribing_physician TEXT,
    -- الطبيب الواصف
    indication TEXT,
    -- سبب الوصف
    special_instructions TEXT,
    -- تعليمات خاصة
    status TEXT DEFAULT 'active' CHECK (
        status IN ('active', 'paused', 'discontinued', 'completed')
    ),
    discontinued_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_beneficiary_meds_active ON beneficiary_medications(beneficiary_id, status)
WHERE status = 'active';
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │           الخطوة 2: نظام إدارة الأدوية المجدول (Medication Management)       │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 2.1 جدول جداول إعطاء الأدوية
CREATE TABLE IF NOT EXISTS medication_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_medication_id UUID REFERENCES beneficiary_medications(id) ON DELETE CASCADE NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (
        status IN ('pending', 'given', 'missed', 'refused', 'held')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(
        beneficiary_medication_id,
        scheduled_date,
        scheduled_time
    )
);
CREATE INDEX IF NOT EXISTS idx_med_schedules_pending ON medication_schedules(scheduled_date, scheduled_time, status)
WHERE status = 'pending';
-- 2.2 جدول سجل إعطاء الأدوية الفعلي
CREATE TABLE IF NOT EXISTS medication_administrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES medication_schedules(id),
    beneficiary_medication_id UUID REFERENCES beneficiary_medications(id) NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    administered_by TEXT NOT NULL,
    -- اسم المعطي
    administered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actual_dose TEXT,
    -- الجرعة الفعلية
    status TEXT NOT NULL CHECK (
        status IN ('given', 'refused', 'held', 'partial')
    ),
    refusal_reason TEXT,
    hold_reason TEXT,
    notes TEXT,
    witnessed_by TEXT,
    -- شاهد (للأدوية المضبوطة)
    vital_signs_before JSONB,
    -- العلامات الحيوية قبل الإعطاء
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_med_admin_beneficiary ON medication_administrations(beneficiary_id, administered_at DESC);
-- 2.3 جدول الجرعات الفائتة
CREATE TABLE IF NOT EXISTS missed_medications_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    schedule_id UUID REFERENCES medication_schedules(id) NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    medication_name TEXT NOT NULL,
    scheduled_time TIMESTAMPTZ NOT NULL,
    detected_at TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT,
    follow_up_action TEXT,
    resolved BOOLEAN DEFAULT false,
    resolved_by TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │           الخطوة 3: محرك القواعد الذكي (Smart Rule Engine)                  │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 3.1 جدول قواعد العلامات الحيوية
CREATE TABLE IF NOT EXISTS vital_sign_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vital_sign TEXT NOT NULL,
    -- temperature, pulse, oxygen, etc.
    vital_sign_ar TEXT NOT NULL,
    -- الاسم بالعربية
    unit TEXT NOT NULL,
    -- الوحدة
    normal_min DECIMAL(10, 2),
    -- الحد الأدنى الطبيعي
    normal_max DECIMAL(10, 2),
    -- الحد الأعلى الطبيعي
    warning_low DECIMAL(10, 2),
    -- حد التحذير المنخفض
    warning_high DECIMAL(10, 2),
    -- حد التحذير المرتفع
    critical_low DECIMAL(10, 2),
    -- حد الخطر المنخفض
    critical_high DECIMAL(10, 2),
    -- حد الخطر العالي
    age_group TEXT DEFAULT 'all',
    -- الفئة العمرية
    applies_to_diagnoses TEXT [],
    -- التشخيصات المعنية (null = الكل)
    alert_message_warning TEXT,
    -- رسالة التحذير
    alert_message_critical TEXT,
    -- رسالة الطوارئ
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج القواعد الأساسية
INSERT INTO vital_sign_rules (
        vital_sign,
        vital_sign_ar,
        unit,
        normal_min,
        normal_max,
        warning_low,
        warning_high,
        critical_low,
        critical_high,
        alert_message_warning,
        alert_message_critical
    )
VALUES (
        'temperature',
        'درجة الحرارة',
        '°C',
        36.5,
        37.5,
        36.0,
        38.0,
        35.0,
        39.5,
        'درجة الحرارة خارج النطاق الطبيعي',
        '⚠️ طوارئ: درجة حرارة حرجة!'
    ),
    (
        'oxygen_saturation',
        'تشبع الأكسجين',
        '%',
        95,
        100,
        92,
        100,
        90,
        100,
        'انخفاض في مستوى الأكسجين',
        '🚨 طوارئ تنفسية: أكسجين منخفض جداً!'
    ),
    (
        'pulse',
        'النبض',
        'نبضة/دقيقة',
        60,
        100,
        50,
        110,
        40,
        130,
        'معدل النبض غير طبيعي',
        '⚠️ طوارئ: نبض حرج!'
    ),
    (
        'blood_pressure_systolic',
        'الضغط الانقباضي',
        'mmHg',
        100,
        130,
        90,
        140,
        80,
        180,
        'ضغط الدم خارج النطاق الطبيعي',
        '⚠️ طوارئ: ضغط دم حرج!'
    ),
    (
        'blood_pressure_diastolic',
        'الضغط الانبساطي',
        'mmHg',
        60,
        85,
        55,
        90,
        50,
        110,
        'ضغط الدم خارج النطاق الطبيعي',
        '⚠️ طوارئ: ضغط دم حرج!'
    ),
    (
        'blood_sugar',
        'سكر الدم',
        'mg/dL',
        70,
        140,
        60,
        180,
        50,
        300,
        'مستوى السكر يحتاج مراجعة',
        '🚨 طوارئ: سكر الدم حرج!'
    ) ON CONFLICT DO NOTHING;
-- 3.2 دالة فحص العلامات الحيوية وإنشاء التنبيهات
CREATE OR REPLACE FUNCTION check_vital_signs_and_alert() RETURNS TRIGGER AS $$
DECLARE v_rule RECORD;
v_value DECIMAL;
v_vital_name TEXT;
v_severity TEXT;
v_message TEXT;
v_beneficiary_name TEXT;
BEGIN -- الحصول على اسم المستفيد
SELECT full_name INTO v_beneficiary_name
FROM beneficiaries
WHERE id = NEW.beneficiary_id;
-- فحص درجة الحرارة
IF NEW.temperature IS NOT NULL THEN
SELECT * INTO v_rule
FROM vital_sign_rules
WHERE vital_sign = 'temperature'
    AND is_active = true
LIMIT 1;
IF v_rule IS NOT NULL THEN IF NEW.temperature <= v_rule.critical_low
OR NEW.temperature >= v_rule.critical_high THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'حرج',
        v_rule.alert_message_critical,
        'درجة الحرارة: ' || NEW.temperature || ' °C للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
ELSIF NEW.temperature <= v_rule.warning_low
OR NEW.temperature >= v_rule.warning_high THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'عالي',
        v_rule.alert_message_warning,
        'درجة الحرارة: ' || NEW.temperature || ' °C للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
END IF;
END IF;
END IF;
-- فحص الأكسجين
IF NEW.oxygen_saturation IS NOT NULL THEN
SELECT * INTO v_rule
FROM vital_sign_rules
WHERE vital_sign = 'oxygen_saturation'
    AND is_active = true
LIMIT 1;
IF v_rule IS NOT NULL THEN IF NEW.oxygen_saturation <= v_rule.critical_low THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'حرج',
        v_rule.alert_message_critical,
        'تشبع الأكسجين: ' || NEW.oxygen_saturation || '% للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
ELSIF NEW.oxygen_saturation <= v_rule.warning_low THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'عالي',
        v_rule.alert_message_warning,
        'تشبع الأكسجين: ' || NEW.oxygen_saturation || '% للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
END IF;
END IF;
END IF;
-- فحص سكر الدم
IF NEW.blood_sugar IS NOT NULL THEN
SELECT * INTO v_rule
FROM vital_sign_rules
WHERE vital_sign = 'blood_sugar'
    AND is_active = true
LIMIT 1;
IF v_rule IS NOT NULL THEN IF NEW.blood_sugar <= v_rule.critical_low
OR NEW.blood_sugar >= v_rule.critical_high THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'حرج',
        v_rule.alert_message_critical,
        'سكر الدم: ' || NEW.blood_sugar || ' mg/dL للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
ELSIF NEW.blood_sugar <= v_rule.warning_low
OR NEW.blood_sugar >= v_rule.warning_high THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'vital_signs',
        'عالي',
        v_rule.alert_message_warning,
        'سكر الدم: ' || NEW.blood_sugar || ' mg/dL للمستفيد ' || v_beneficiary_name,
        'vital_signs_monitor',
        'daily_care_logs'
    );
END IF;
END IF;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- إنشاء الـ Trigger
DROP TRIGGER IF EXISTS trg_check_vitals ON daily_care_logs;
CREATE TRIGGER trg_check_vitals
AFTER
INSERT
    OR
UPDATE ON daily_care_logs FOR EACH ROW EXECUTE FUNCTION check_vital_signs_and_alert();
-- 3.3 دالة فحص التفاعلات الدوائية
CREATE OR REPLACE FUNCTION check_drug_interactions() RETURNS TRIGGER AS $$
DECLARE v_interaction RECORD;
v_existing_med RECORD;
v_beneficiary_name TEXT;
BEGIN -- الحصول على اسم المستفيد
SELECT full_name INTO v_beneficiary_name
FROM beneficiaries
WHERE id = NEW.beneficiary_id;
-- فحص التفاعلات مع الأدوية الحالية
FOR v_existing_med IN
SELECT medication_name
FROM beneficiary_medications
WHERE beneficiary_id = NEW.beneficiary_id
    AND status = 'active'
    AND id != NEW.id LOOP -- البحث عن تفاعل
SELECT * INTO v_interaction
FROM drug_interactions
WHERE (
        drug_a_name = NEW.medication_name
        AND drug_b_name = v_existing_med.medication_name
    )
    OR (
        drug_b_name = NEW.medication_name
        AND drug_a_name = v_existing_med.medication_name
    )
LIMIT 1;
IF v_interaction IS NOT NULL THEN
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        NEW.beneficiary_id,
        'drug_interaction',
        CASE
            v_interaction.severity
            WHEN 'contraindicated' THEN 'حرج'
            WHEN 'severe' THEN 'حرج'
            WHEN 'moderate' THEN 'عالي'
            ELSE 'متوسط'
        END,
        '⚠️ تفاعل دوائي: ' || NEW.medication_name || ' + ' || v_existing_med.medication_name,
        v_interaction.clinical_effect_ar || ' - ' || COALESCE(v_interaction.management, 'يرجى استشارة الطبيب'),
        'drug_interaction_checker',
        'beneficiary_medications'
    );
END IF;
END LOOP;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- إنشاء الـ Trigger
DROP TRIGGER IF EXISTS trg_check_drug_interactions ON beneficiary_medications;
CREATE TRIGGER trg_check_drug_interactions
AFTER
INSERT ON beneficiary_medications FOR EACH ROW
    WHEN (NEW.status = 'active') EXECUTE FUNCTION check_drug_interactions();
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │          الخطوة 4: طبقة التحليلات المنفصلة (Analytics Layer)                │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 4.1 جدول ملخص العلامات الحيوية اليومي
CREATE TABLE IF NOT EXISTS analytics_vital_signs_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    analysis_date DATE NOT NULL,
    -- الإحصائيات
    temperature_avg DECIMAL(4, 1),
    temperature_min DECIMAL(4, 1),
    temperature_max DECIMAL(4, 1),
    pulse_avg INTEGER,
    pulse_min INTEGER,
    pulse_max INTEGER,
    oxygen_avg INTEGER,
    oxygen_min INTEGER,
    oxygen_max INTEGER,
    bp_systolic_avg INTEGER,
    bp_diastolic_avg INTEGER,
    blood_sugar_avg INTEGER,
    blood_sugar_min INTEGER,
    blood_sugar_max INTEGER,
    -- العدادات
    total_readings INTEGER DEFAULT 0,
    abnormal_readings INTEGER DEFAULT 0,
    critical_readings INTEGER DEFAULT 0,
    -- التصنيف
    overall_status TEXT CHECK (
        overall_status IN ('مستقر', 'يحتاج متابعة', 'غير مستقر', 'حرج')
    ),
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, analysis_date)
);
-- 4.2 جدول اتجاهات المستفيد
CREATE TABLE IF NOT EXISTS analytics_beneficiary_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    trend_period TEXT NOT NULL,
    -- 'weekly', 'monthly', 'quarterly'
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    -- اتجاهات الصحة
    health_trend TEXT CHECK (
        health_trend IN ('improving', 'stable', 'declining')
    ),
    health_trend_ar TEXT,
    health_score_start DECIMAL(5, 2),
    health_score_end DECIMAL(5, 2),
    -- اتجاهات السلوك
    behavior_trend TEXT CHECK (
        behavior_trend IN ('improving', 'stable', 'declining')
    ),
    behavior_incidents_count INTEGER DEFAULT 0,
    -- اتجاهات التغذية
    nutrition_trend TEXT,
    meal_completion_rate DECIMAL(5, 2),
    -- اتجاهات التأهيل
    rehab_progress_rate DECIMAL(5, 2),
    goals_achieved INTEGER DEFAULT 0,
    -- الملاحظات والتوصيات
    key_observations TEXT [],
    recommendations TEXT [],
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, trend_period, period_start)
);
-- 4.3 جدول التنبؤات
CREATE TABLE IF NOT EXISTS analytics_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    prediction_type TEXT NOT NULL,
    -- 'fall_risk', 'infection_risk', 'behavior_episode'
    prediction_type_ar TEXT NOT NULL,
    prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    prediction_horizon_days INTEGER,
    -- المدى الزمني للتنبؤ
    probability DECIMAL(5, 2),
    -- احتمالية الحدوث (0-100)
    confidence DECIMAL(5, 2),
    -- مستوى الثقة
    contributing_factors JSONB,
    -- العوامل المساهمة
    recommended_actions TEXT [],
    -- الإجراءات الموصى بها
    outcome_actual TEXT,
    -- النتيجة الفعلية (للتعلم)
    outcome_date DATE,
    prediction_accuracy DECIMAL(5, 2),
    -- دقة التنبؤ
    model_version TEXT,
    -- إصدار نموذج التنبؤ
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4.4 دالة تحديث التحليلات اليومية
CREATE OR REPLACE FUNCTION refresh_daily_analytics() RETURNS void AS $$ BEGIN -- تحديث ملخص العلامات الحيوية لليوم السابق
INSERT INTO analytics_vital_signs_daily (
        beneficiary_id,
        analysis_date,
        temperature_avg,
        temperature_min,
        temperature_max,
        pulse_avg,
        pulse_min,
        pulse_max,
        oxygen_avg,
        oxygen_min,
        oxygen_max,
        bp_systolic_avg,
        bp_diastolic_avg,
        blood_sugar_avg,
        blood_sugar_min,
        blood_sugar_max,
        total_readings,
        overall_status
    )
SELECT beneficiary_id,
    log_date,
    ROUND(AVG(temperature)::NUMERIC, 1),
    MIN(temperature),
    MAX(temperature),
    ROUND(AVG(pulse)),
    MIN(pulse),
    MAX(pulse),
    ROUND(AVG(oxygen_saturation)),
    MIN(oxygen_saturation),
    MAX(oxygen_saturation),
    ROUND(AVG(blood_pressure_systolic)),
    ROUND(AVG(blood_pressure_diastolic)),
    ROUND(AVG(blood_sugar)),
    MIN(blood_sugar),
    MAX(blood_sugar),
    COUNT(*),
    CASE
        WHEN MIN(oxygen_saturation) < 90
        OR MAX(temperature) > 39 THEN 'حرج'
        WHEN MIN(oxygen_saturation) < 92
        OR MAX(temperature) > 38.5 THEN 'غير مستقر'
        WHEN MIN(oxygen_saturation) < 95
        OR MAX(temperature) > 38 THEN 'يحتاج متابعة'
        ELSE 'مستقر'
    END
FROM daily_care_logs
WHERE log_date = CURRENT_DATE - INTERVAL '1 day'
GROUP BY beneficiary_id,
    log_date ON CONFLICT (beneficiary_id, analysis_date) DO
UPDATE
SET temperature_avg = EXCLUDED.temperature_avg,
    pulse_avg = EXCLUDED.pulse_avg,
    oxygen_avg = EXCLUDED.oxygen_avg,
    total_readings = EXCLUDED.total_readings,
    overall_status = EXCLUDED.overall_status,
    calculated_at = NOW();
END;
$$ LANGUAGE plpgsql;
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │             الخطوة 5: تكامل الطقس (Weather Integration)                    │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 5.1 جدول بيانات الطقس اليومية
CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weather_date DATE NOT NULL,
    location TEXT DEFAULT 'الباحة',
    -- البيانات الأساسية
    temperature_high DECIMAL(4, 1),
    temperature_low DECIMAL(4, 1),
    humidity_avg INTEGER,
    wind_speed_avg DECIMAL(5, 1),
    -- الظروف
    weather_condition TEXT,
    -- 'clear', 'cloudy', 'rainy', 'dusty', 'hot_wave', 'cold_wave'
    weather_condition_ar TEXT,
    uv_index INTEGER,
    air_quality_index INTEGER,
    -- التحذيرات
    has_weather_warning BOOLEAN DEFAULT false,
    warning_type TEXT,
    warning_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(weather_date, location)
);
-- 5.2 جدول الارتباطات بين الطقس والصحة
CREATE TABLE IF NOT EXISTS weather_health_correlations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weather_condition TEXT NOT NULL,
    affected_diagnoses TEXT [],
    -- التشخيصات المتأثرة
    risk_increase_percentage INTEGER,
    -- نسبة زيادة الخطر
    recommended_precautions TEXT [],
    -- الاحتياطات الموصى بها
    monitoring_frequency TEXT,
    -- تكرار المراقبة
    alert_message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج الارتباطات المعروفة
INSERT INTO weather_health_correlations (
        weather_condition,
        affected_diagnoses,
        risk_increase_percentage,
        recommended_precautions,
        alert_message
    )
VALUES (
        'cold_wave',
        ARRAY ['G80', 'الشلل الدماغي', 'أمراض تنفسية'],
        40,
        ARRAY ['تدفئة إضافية', 'مراقبة تنفسية', 'تجهيز الأكسجين'],
        '⚠️ موجة برد قادمة - تجهيز المستفيدين المعرضين للخطر'
    ),
    (
        'hot_wave',
        ARRAY ['أمراض قلبية', 'I10'],
        35,
        ARRAY ['ترطيب إضافي', 'تبريد', 'مراقبة ضغط الدم'],
        '⚠️ موجة حر قادمة - زيادة السوائل والتبريد'
    ),
    (
        'dusty',
        ARRAY ['الربو', 'أمراض تنفسية', 'G80'],
        25,
        ARRAY ['إغلاق النوافذ', 'تجهيز البخاخات', 'مراقبة الأكسجين'],
        '⚠️ غبار متوقع - تجهيز أجهزة التنفس'
    ),
    (
        'high_humidity',
        ARRAY ['الصرع', 'G40'],
        15,
        ARRAY ['مراقبة النوبات', 'تهوية جيدة'],
        '⚠️ رطوبة عالية - مراقبة مرضى الصرع'
    ) ON CONFLICT DO NOTHING;
-- 5.3 دالة إنشاء تنبيهات الطقس
CREATE OR REPLACE FUNCTION generate_weather_alerts() RETURNS void AS $$
DECLARE v_weather RECORD;
v_correlation RECORD;
v_beneficiary RECORD;
BEGIN -- الحصول على طقس اليوم
SELECT * INTO v_weather
FROM weather_data
WHERE weather_date = CURRENT_DATE
LIMIT 1;
IF v_weather IS NULL
OR NOT v_weather.has_weather_warning THEN RETURN;
END IF;
-- البحث عن الارتباطات
FOR v_correlation IN
SELECT *
FROM weather_health_correlations
WHERE weather_condition = v_weather.weather_condition
    AND is_active = true LOOP -- إنشاء تنبيهات للمستفيدين المتأثرين
    FOR v_beneficiary IN
SELECT id,
    full_name,
    medical_diagnosis
FROM beneficiaries
WHERE status = 'نشط'
    AND (
        medical_diagnosis ILIKE ANY(v_correlation.affected_diagnoses)
        OR EXISTS (
            SELECT 1
            FROM diagnosis_codes dc
            WHERE dc.icd_code = ANY(v_correlation.affected_diagnoses)
        )
    ) LOOP
INSERT INTO risk_alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        source,
        triggered_by
    )
VALUES (
        v_beneficiary.id,
        'weather',
        'متوسط',
        v_correlation.alert_message,
        'الاحتياطات: ' || array_to_string(v_correlation.recommended_precautions, '، '),
        'weather_monitor',
        'weather_data'
    );
END LOOP;
END LOOP;
END;
$$ LANGUAGE plpgsql;
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │            الخطوة 6: محرك التوصيات الذكي (Recommendation Engine)            │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- 6.1 جدول أنماط التحسن المكتشفة
CREATE TABLE IF NOT EXISTS improvement_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_name TEXT NOT NULL,
    pattern_name_ar TEXT NOT NULL,
    pattern_type TEXT NOT NULL,
    -- 'behavior', 'health', 'rehab', 'social'
    -- الشروط
    condition_description TEXT NOT NULL,
    condition_query TEXT,
    -- SQL query للكشف
    -- النتيجة
    expected_improvement TEXT,
    improvement_percentage DECIMAL(5, 2),
    confidence_level DECIMAL(5, 2),
    -- التوصية
    recommendation_template TEXT NOT NULL,
    applies_to_diagnoses TEXT [],
    times_detected INTEGER DEFAULT 0,
    times_successful INTEGER DEFAULT 0,
    success_rate DECIMAL(5, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج أنماط معروفة
INSERT INTO improvement_patterns (
        pattern_name,
        pattern_name_ar,
        pattern_type,
        condition_description,
        expected_improvement,
        improvement_percentage,
        recommendation_template
    )
VALUES (
        'outdoor_activity_behavior',
        'تحسن سلوكي مع النشاط الخارجي',
        'behavior',
        'انخفاض الحوادث السلوكية في أيام النشاط الخارجي',
        'تحسن في السلوك والمزاج',
        30,
        'يُنصح بزيادة الأنشطة الخارجية للمستفيد {name} بناءً على تحسن ملحوظ بنسبة {percentage}%'
    ),
    (
        'therapy_consistency_rehab',
        'تقدم تأهيلي مع انتظام الجلسات',
        'rehab',
        'تحقيق أهداف أعلى مع 3+ جلسات أسبوعية',
        'تسريع تحقيق الأهداف',
        25,
        'يُنصح بزيادة جلسات العلاج الطبيعي للمستفيد {name} لتسريع التقدم'
    ),
    (
        'family_visit_mood',
        'تحسن المزاج بعد الزيارات',
        'social',
        'تحسن مؤشرات المزاج بعد زيارات الأسرة',
        'تحسن في المزاج والتفاعل',
        20,
        'يُنصح بتنسيق زيارات أكثر تكراراً لأسرة المستفيد {name}'
    ),
    (
        'sleep_quality_behavior',
        'ارتباط جودة النوم بالسلوك',
        'behavior',
        'انخفاض المشاكل السلوكية مع نوم 7+ ساعات',
        'استقرار سلوكي',
        35,
        'يُنصح بتحسين بيئة النوم ومراقبة جودة نوم المستفيد {name}'
    ) ON CONFLICT DO NOTHING;
-- 6.2 جدول التوصيات الذكية
CREATE TABLE IF NOT EXISTS smart_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    pattern_id UUID REFERENCES improvement_patterns(id),
    recommendation_type TEXT NOT NULL,
    -- 'care', 'therapy', 'nutrition', 'activity', 'family'
    recommendation_type_ar TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    priority_ar TEXT,
    supporting_data JSONB,
    -- البيانات الداعمة
    expected_benefit TEXT,
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'accepted',
            'rejected',
            'implemented',
            'expired'
        )
    ),
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    review_notes TEXT,
    implementation_deadline DATE,
    implemented_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days'
);
CREATE INDEX IF NOT EXISTS idx_smart_recommendations_pending ON smart_recommendations(beneficiary_id, status)
WHERE status = 'pending';
-- 6.3 جدول نتائج تطبيق التوصيات
CREATE TABLE IF NOT EXISTS recommendation_outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES smart_recommendations(id) NOT NULL,
    implementation_date DATE NOT NULL,
    evaluation_date DATE,
    -- القياسات
    metric_before JSONB,
    metric_after JSONB,
    improvement_achieved BOOLEAN,
    improvement_percentage DECIMAL(5, 2),
    -- التقييم
    effectiveness_rating INTEGER CHECK (
        effectiveness_rating BETWEEN 1 AND 5
    ),
    evaluator_notes TEXT,
    -- التعلم
    feedback_for_pattern TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                        Views التحليلية والتقارير                           │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- View: ملخص أدوية المستفيد مع التفاعلات
CREATE OR REPLACE VIEW v_beneficiary_medications_summary AS
SELECT b.id AS beneficiary_id,
    b.full_name,
    b.section,
    COUNT(bm.id) AS total_medications,
    COUNT(bm.id) FILTER (
        WHERE bm.status = 'active'
    ) AS active_medications,
    (
        SELECT COUNT(*)
        FROM drug_interactions di
        WHERE di.drug_a_name IN (
                SELECT medication_name
                FROM beneficiary_medications
                WHERE beneficiary_id = b.id
                    AND status = 'active'
            )
            AND di.drug_b_name IN (
                SELECT medication_name
                FROM beneficiary_medications
                WHERE beneficiary_id = b.id
                    AND status = 'active'
            )
    ) AS potential_interactions,
    ARRAY_AGG(bm.medication_name) FILTER (
        WHERE bm.status = 'active'
    ) AS active_medication_list
FROM beneficiaries b
    LEFT JOIN beneficiary_medications bm ON b.id = bm.beneficiary_id
GROUP BY b.id,
    b.full_name,
    b.section;
-- View: لوحة التنبيهات الذكية
CREATE OR REPLACE VIEW v_smart_alerts_dashboard AS
SELECT ra.id,
    ra.beneficiary_id,
    b.full_name AS beneficiary_name,
    b.section,
    b.room_number,
    ra.alert_type,
    ra.severity,
    ra.title,
    ra.description,
    ra.source,
    ra.status,
    ra.created_at,
    EXTRACT(
        EPOCH
        FROM (NOW() - ra.created_at)
    ) / 3600 AS hours_since_created,
    CASE
        WHEN ra.severity = 'حرج' THEN 1
        WHEN ra.severity = 'عالي' THEN 2
        WHEN ra.severity = 'متوسط' THEN 3
        ELSE 4
    END AS priority_order
FROM risk_alerts ra
    JOIN beneficiaries b ON ra.beneficiary_id = b.id
WHERE ra.status = 'نشط'
ORDER BY priority_order,
    ra.created_at DESC;
-- View: ملخص التوصيات الذكية
CREATE OR REPLACE VIEW v_smart_recommendations_summary AS
SELECT sr.id,
    sr.beneficiary_id,
    b.full_name AS beneficiary_name,
    sr.recommendation_type_ar,
    sr.title,
    sr.priority_ar,
    sr.status,
    ip.pattern_name_ar AS based_on_pattern,
    sr.created_at,
    sr.expires_at,
    CASE
        WHEN sr.expires_at < NOW() THEN true
        ELSE false
    END AS is_expired
FROM smart_recommendations sr
    JOIN beneficiaries b ON sr.beneficiary_id = b.id
    LEFT JOIN improvement_patterns ip ON sr.pattern_id = ip.id
WHERE sr.status = 'pending'
ORDER BY CASE
        sr.priority
        WHEN 'urgent' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        ELSE 4
    END,
    sr.created_at;
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                           سياسات الأمان (RLS)                              │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- تفعيل RLS على الجداول الجديدة
ALTER TABLE diagnosis_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE drug_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_administrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE missed_medications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_sign_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_vital_signs_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_beneficiary_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_health_correlations ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE smart_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_outcomes ENABLE ROW LEVEL SECURITY;
-- سياسات الوصول للمستخدمين المصادقين
CREATE POLICY "authenticated_all" ON diagnosis_codes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON medication_catalog FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON drug_interactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON beneficiary_medications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON medication_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON medication_administrations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON missed_medications_log FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON vital_sign_rules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON analytics_vital_signs_daily FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON analytics_beneficiary_trends FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON analytics_predictions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON weather_data FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON weather_health_correlations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON improvement_patterns FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON smart_recommendations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all" ON recommendation_outcomes FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- سياسات القراءة للوصول المجهول (الجداول المرجعية فقط)
CREATE POLICY "anon_read" ON diagnosis_codes FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON medication_catalog FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON drug_interactions FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON vital_sign_rules FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON weather_health_correlations FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read" ON improvement_patterns FOR
SELECT TO anon USING (true);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                         تفعيل Realtime للتنبيهات                           │
-- └─────────────────────────────────────────────────────────────────────────────┘
ALTER PUBLICATION supabase_realtime
ADD TABLE smart_recommendations;
ALTER PUBLICATION supabase_realtime
ADD TABLE medication_schedules;
ALTER PUBLICATION supabase_realtime
ADD TABLE missed_medications_log;
-- ═══════════════════════════════════════════════════════════════════════════════
-- نهاية ملف محرك القرارات الذكي - بصيرة 3.0
-- ═══════════════════════════════════════════════════════════════════════════════