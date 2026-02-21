-- ═══════════════════════════════════════════════════════════════════════════════
-- BASIRA REMEDY MIGRATION | ملف الإصلاح الشامل
-- الهدف: تحديث الجداول القديمة (الموجودة مسبقاً) لتتوافق مع مشروع بصيرة دون حذف البيانات
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. تحديث جدول المستفيدين (إضافة الأعمدة الناقصة بدلاً من إنشاء الجدول)
DO $$
BEGIN
    -- إضافة عمود القسم (Section) إذا لم يكن موجوداً
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beneficiaries' AND column_name = 'section') THEN
        ALTER TABLE beneficiaries ADD COLUMN section TEXT;
    END IF;

    -- إضافة عمود رقم الملف (File Number)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beneficiaries' AND column_name = 'file_number') THEN
        ALTER TABLE beneficiaries ADD COLUMN file_number TEXT;
    END IF;

    -- إضافة عمود صورة المستفيد
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beneficiaries' AND column_name = 'photo_url') THEN
        ALTER TABLE beneficiaries ADD COLUMN photo_url TEXT;
    END IF;
    
    -- إضافة تصنيف الإخلاء
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beneficiaries' AND column_name = 'evacuation_category') THEN
        ALTER TABLE beneficiaries ADD COLUMN evacuation_category TEXT CHECK (evacuation_category IN ('أخضر', 'أصفر', 'أحمر'));
    END IF;

    -- التأكد من وجود عمود الحالة
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'beneficiaries' AND column_name = 'status') THEN
        ALTER TABLE beneficiaries ADD COLUMN status TEXT DEFAULT 'نشط';
    END IF;
END $$;

-- تحديث البيانات الفارغة للقسم (مؤقت لتفادي المشاكل)
UPDATE beneficiaries SET section = 'غير محدد' WHERE section IS NULL;

-- 2. إنشاء الجداول الجديدة (للوحدات الجديدة فقط)
-- جدول الموظفين
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    section TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'موظف',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- سجل المتابعة اليومية
CREATE TABLE IF NOT EXISTS daily_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    recorded_by UUID REFERENCES employees(id),
    shift TEXT CHECK (shift IN ('صباحي', 'مسائي', 'ليلي')),
    log_date DATE DEFAULT CURRENT_DATE,
    log_time TIME DEFAULT CURRENT_TIME,
    temperature DECIMAL(4,1),
    pulse INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    oxygen_saturation INTEGER,
    blood_sugar INTEGER,
    weight DECIMAL(5,2),
    mobility_today TEXT,
    mood TEXT,
    notes TEXT,
    incidents TEXT,
    requires_followup BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, shift, log_date)
);

-- تقييم مخاطر السقوط
CREATE TABLE IF NOT EXISTS fall_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    assessed_by UUID REFERENCES employees(id),
    assessment_date DATE DEFAULT CURRENT_DATE,
    risk_score DECIMAL(5,2),
    risk_level TEXT,
    history_of_falls BOOLEAN,
    secondary_diagnosis BOOLEAN,
    ambulatory_aid TEXT,
    iv_therapy BOOLEAN,
    gait TEXT,
    mental_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- تنبيهات المخاطر
CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    title TEXT NOT NULL,
    description TEXT,
    severity TEXT, -- High, Medium, Low
    status TEXT DEFAULT 'نشط', -- Active, Resolved
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- المؤشرات الاستراتيجية
CREATE TABLE IF NOT EXISTS strategic_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_date DATE DEFAULT CURRENT_DATE,
    occupancy_rate DECIMAL(5,2),
    critical_cases INTEGER DEFAULT 0,
    fall_incidents_count INTEGER DEFAULT 0,
    staff_compliance DECIMAL(5,2),
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kpi_date)
);

-- 3. الدوال والإجراءات (Functions)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. الفهارس (Indexes) - مع التحقق من عدم الوجود
CREATE INDEX IF NOT EXISTS idx_beneficiaries_section ON beneficiaries(section);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_beneficiary ON daily_care_logs(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status);

-- 5. إصلاحات الصلاحيات (RLS & Grants)
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;

-- سياسة مؤقتة للسماح بكل شيء (للتجربة)
DROP POLICY IF EXISTS "Public Access" ON beneficiaries;
CREATE POLICY "Public Access" ON beneficiaries FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Access Logs" ON daily_care_logs;
CREATE POLICY "Public Access Logs" ON daily_care_logs FOR ALL USING (true) WITH CHECK (true);

-- 6. إنشاء جدول الملفات الطبية الشاملة (Project Basira - Medical Profiles)
-- هذا الجدول يدمج بيانات "الرعاية المتمركزة حول الشخص" (Person-Centered Care)
CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    
    -- بيانات التصنيف والإعاقة (Classification & Disability)
    disability_classification TEXT, -- تصنيف الحالات: إعاقة عقلية، حركية
    mental_disability_level TEXT, -- شديدة، متوسطة، بسيطة
    motor_disability_type TEXT[], -- أنواع الإعاقة الحركية (شلل رباعي، شلل نصفي...)
    
    -- الحالة الحركية (GMFCS & Mobility)
    mobility_status TEXT, -- يتحرك بنفسه، يمشي بصعوبة، كرسي متحرك، طريح فراش
    gmfcs_level TEXT, -- المستوى من 1 إلى 5
    is_bedridden BOOLEAN DEFAULT false, -- طريح الفراش
    
    -- القياسات الحيوية والتغذية (Vital Signs & Nutrition)
    bmi_value DECIMAL(5,2),
    bmi_category TEXT, -- تحت الوزن، طبيعي، سمنة 1، سمنة 2، سمنة مفرطة
    diet_type TEXT, -- فموي طبيعي، مهروس، أنبوبي (PEG/NG)
    
    -- الأمراض المزمنة (Chronic Diseases JSON)
    -- Structure: { "hypertension": {"status": "controlled", "medication": true}, "diabetes": {"hba1c": 7.5, "type": 2}, "epilepsy": {"seizures_last_month": 0, "controlled": true} }
    chronic_conditions JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- الحالة النفسية والعقلية (Psychological Profile)
    -- Structure: { "diagnosis": ["Psychosis", "Anxiety"], "status": "stable", "medications_count": 2, "plan": "CBT" }
    psychological_profile JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- الإصابات وقرح الفراش (Injuries & Bedsores)
    -- Structure: { "bedsores": [{"grade": 2, "location": "sacrum"}], "fractures": [], "wounds": [] }
    injuries_profile JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- الأمراض المعدية (Infectious Diseases)
    -- Structure: { "hepatitis_b": false, "hepatitis_c": false, "hiv": false, "tb": false }
    infection_status JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- التأهيل (Rehabilitation)
    -- Structure: { "pt_sessions_count": 4, "speech_therapy": true, "swallowing_difficulty": false }
    rehabilitation_plan JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Metadata
    last_assessment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id)
);

-- سياسات الأمان للملف الطبي
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Access Medical" ON medical_profiles;
CREATE POLICY "Public Access Medical" ON medical_profiles FOR ALL USING (true) WITH CHECK (true);

