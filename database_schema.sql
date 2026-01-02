-- ════════════════════════════════════════════════════════════════════════════
-- نظام إدارة مركز التأهيل الشامل - قاعدة البيانات الموحدة
-- الإصدار: 2.0 | التاريخ: 2026-01-02
-- ════════════════════════════════════════════════════════════════════════════
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء الأول: الجداول الأساسية                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- 1. المستفيدين الرئيسي
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    national_id TEXT,
    date_of_birth DATE,
    gender TEXT CHECK (gender IN ('ذكر', 'أنثى')),
    section TEXT NOT NULL,
    room_number TEXT,
    bed_number TEXT,
    admission_date DATE,
    guardian_name TEXT,
    guardian_phone TEXT,
    medical_diagnosis TEXT,
    mobility_type TEXT CHECK (
        mobility_type IN (
            'مشي_مستقل',
            'مشي_بمساعدة',
            'كرسي_متحرك',
            'طريح_فراش'
        )
    ),
    communication_type TEXT CHECK (
        communication_type IN ('لفظي', 'إشارة', 'بصري', 'لمسي', 'لا_يتواصل')
    ),
    special_needs TEXT [],
    status TEXT DEFAULT 'نشط' CHECK (status IN ('نشط', 'إجازة', 'منقول', 'متوفى')),
    photo_url TEXT,
    evacuation_category TEXT CHECK (evacuation_category IN ('أخضر', 'أصفر', 'أحمر')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. الموظفين
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    section TEXT,
    phone TEXT,
    email TEXT,
    role TEXT DEFAULT 'موظف' CHECK (
        role IN ('موظف', 'مشرف', 'مدير_قسم', 'مدير_مركز', 'admin')
    ),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء الثاني: الرعاية اليومية                         ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- 3. سجل المتابعة اليومية
CREATE TABLE IF NOT EXISTS daily_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    recorded_by UUID REFERENCES employees(id) NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('صباحي', 'مسائي', 'ليلي')),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    log_time TIME NOT NULL DEFAULT CURRENT_TIME,
    temperature DECIMAL(4, 1),
    pulse INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    oxygen_saturation INTEGER,
    blood_sugar INTEGER,
    weight DECIMAL(5, 2),
    breakfast_status TEXT,
    lunch_status TEXT,
    dinner_status TEXT,
    fluid_intake TEXT,
    medications_given BOOLEAN DEFAULT false,
    medications_notes TEXT,
    bathing_done BOOLEAN DEFAULT false,
    oral_care_done BOOLEAN DEFAULT false,
    skin_condition TEXT,
    diaper_changes INTEGER DEFAULT 0,
    mood TEXT,
    sleep_quality TEXT,
    mobility_today TEXT,
    social_interaction TEXT,
    therapy_sessions TEXT [],
    recreational_activities TEXT [],
    general_notes TEXT,
    incidents TEXT,
    concerns TEXT,
    requires_followup BOOLEAN DEFAULT false,
    followup_priority TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, shift, log_date)
);
-- 4. تقييم مخاطر السقوط
CREATE TABLE IF NOT EXISTS fall_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    assessed_by UUID REFERENCES employees(id) NOT NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    has_fall_history BOOLEAN DEFAULT false,
    fall_history_count INTEGER DEFAULT 0,
    last_fall_date DATE,
    takes_dizzy_medications BOOLEAN DEFAULT false,
    dizzy_medications TEXT [],
    cognitive_level INTEGER CHECK (
        cognitive_level BETWEEN 1 AND 3
    ),
    mobility_level INTEGER CHECK (
        mobility_level BETWEEN 1 AND 4
    ),
    risk_score DECIMAL(5, 2) GENERATED ALWAYS AS (
        (
            CASE
                WHEN has_fall_history THEN 30
                ELSE 0
            END
        ) + (
            CASE
                WHEN takes_dizzy_medications THEN 25
                ELSE 0
            END
        ) + (COALESCE(cognitive_level, 1) * 8.33) + (COALESCE(mobility_level, 1) * 5)
    ) STORED,
    preventive_measures TEXT [],
    special_instructions TEXT,
    next_assessment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. تنبيهات المخاطر
CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT,
    triggered_by TEXT,
    acknowledged_by UUID REFERENCES employees(id),
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES employees(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    status TEXT DEFAULT 'نشط',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء الثالث: الإعاشة والتغذية                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- 6. الموردين والمتعهدين
CREATE TABLE IF NOT EXISTS catering_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    contract_start DATE,
    contract_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 7. الخطط الغذائية
CREATE TABLE IF NOT EXISTS dietary_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL CHECK (
        plan_type IN (
            'قياسي',
            'سكري',
            'كلوى',
            'لين',
            'سائل',
            'مهروس',
            'خالي من القمح'
        )
    ),
    allergies TEXT [] DEFAULT '{}',
    disliked_items TEXT [] DEFAULT '{}',
    special_instructions TEXT,
    last_assessment_date DATE DEFAULT CURRENT_DATE,
    nutritionist_id UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id)
);
-- 8. الوجبات اليومية
CREATE TABLE IF NOT EXISTS daily_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL CHECK (
        meal_type IN (
            'فطور',
            'غداء',
            'عشاء',
            'وجبة خفيفة 1',
            'وجبة خفيفة 2'
        )
    ),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'preparing',
            'ready',
            'delivered',
            'consumed',
            'refused'
        )
    ),
    items JSONB DEFAULT '[]',
    consumption_percentage INTEGER CHECK (
        consumption_percentage BETWEEN 0 AND 100
    ),
    refusal_reason TEXT,
    notes TEXT,
    delivered_at TIMESTAMPTZ,
    delivered_by UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, meal_date, meal_type)
);
-- 9. معايير التقييم
CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    max_score INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 10. تقييمات المتعهدين
CREATE TABLE IF NOT EXISTS contractor_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES catering_suppliers(id),
    evaluator_id UUID,
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_score INTEGER,
    total_penalty_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    staff_observations TEXT,
    ai_enhanced_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء الرابع: التشغيل والصيانة                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- 11. فئات الأصول
CREATE TABLE IF NOT EXISTS om_asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    parent_id UUID REFERENCES om_asset_categories(id),
    color_code TEXT DEFAULT '#14415A',
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 12. سجل الأصول
CREATE TABLE IF NOT EXISTS om_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT UNIQUE NOT NULL,
    barcode TEXT,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    category_id UUID REFERENCES om_asset_categories(id),
    asset_type TEXT CHECK (asset_type IN ('fixed', 'movable', 'consumable')),
    building TEXT,
    floor TEXT,
    room TEXT,
    acquisition_date DATE,
    acquisition_cost DECIMAL(12, 2),
    current_book_value DECIMAL(12, 2),
    depreciation_rate DECIMAL(5, 2) DEFAULT 10.00,
    useful_life_years INT,
    salvage_value DECIMAL(12, 2),
    supplier_name TEXT,
    warranty_start DATE,
    warranty_end DATE,
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'under_maintenance',
            'out_of_service',
            'disposed',
            'transferred'
        )
    ),
    condition TEXT CHECK (
        condition IN ('excellent', 'good', 'fair', 'poor', 'unusable')
    ),
    last_inspection_date DATE,
    next_inspection_date DATE,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 13. طلبات الصيانة
CREATE TABLE IF NOT EXISTS om_maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    asset_id UUID REFERENCES om_assets(id),
    request_type TEXT CHECK (
        request_type IN (
            'corrective',
            'preventive',
            'emergency',
            'improvement'
        )
    ),
    priority TEXT DEFAULT 'medium' CHECK (
        priority IN ('low', 'medium', 'high', 'critical')
    ),
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    assigned_contractor UUID REFERENCES catering_suppliers(id),
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'approved',
            'in_progress',
            'on_hold',
            'completed',
            'cancelled',
            'rejected'
        )
    ),
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    target_completion DATE,
    actual_completion DATE,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    quality_rating INT CHECK (
        quality_rating BETWEEN 1 AND 5
    ),
    completion_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 14. جدول الصيانة الوقائية
CREATE TABLE IF NOT EXISTS om_preventive_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES om_assets(id),
    task_name TEXT NOT NULL,
    task_description TEXT,
    frequency TEXT CHECK (
        frequency IN (
            'daily',
            'weekly',
            'monthly',
            'quarterly',
            'semi_annual',
            'annual'
        )
    ),
    next_due_date DATE NOT NULL,
    last_completed_date DATE,
    assigned_team TEXT,
    estimated_duration_hours DECIMAL(5, 2),
    is_mandatory BOOLEAN DEFAULT FALSE,
    compliance_standard TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 15. سجلات إدارة المخلفات
CREATE TABLE IF NOT EXISTS om_waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    waste_type TEXT CHECK (
        waste_type IN (
            'general',
            'recyclable',
            'hazardous',
            'medical',
            'electronic',
            'confidential'
        )
    ),
    waste_category TEXT,
    source_department TEXT,
    source_location TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    disposal_method TEXT CHECK (
        disposal_method IN (
            'landfill',
            'recycling',
            'incineration',
            'special_treatment',
            'reuse'
        )
    ),
    disposal_date DATE,
    contractor_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء الخامس: الحوكمة والمخاطر                        ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- 16. سجل المخاطر
CREATE TABLE IF NOT EXISTS grc_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    department TEXT,
    probability INTEGER CHECK (
        probability BETWEEN 1 AND 5
    ),
    impact INTEGER CHECK (
        impact BETWEEN 1 AND 5
    ),
    risk_score INTEGER GENERATED ALWAYS AS (probability * impact) STORED,
    mitigation_strategy TEXT,
    risk_owner TEXT,
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'mitigating', 'closed', 'accepted')
    ),
    review_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 17. متابعة الامتثال
CREATE TABLE IF NOT EXISTS grc_compliance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard TEXT NOT NULL,
    requirement_code TEXT,
    requirement_text TEXT NOT NULL,
    department TEXT,
    responsible_person TEXT,
    status TEXT DEFAULT 'not_started' CHECK (
        status IN (
            'not_started',
            'in_progress',
            'compliant',
            'non_compliant',
            'not_applicable'
        )
    ),
    evidence_url TEXT,
    due_date DATE,
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 18. ثغرات المساءلة
CREATE TABLE IF NOT EXISTS accountability_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gap_code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    severity TEXT CHECK (
        severity IN ('critical', 'high', 'medium', 'low')
    ),
    source TEXT,
    affected_department TEXT,
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'in_progress', 'resolved', 'escalated')
    ),
    assigned_to TEXT,
    resolution_notes TEXT,
    target_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء السادس: الفهارس والتحسينات                      ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- الفهارس
CREATE INDEX IF NOT EXISTS idx_beneficiaries_section ON beneficiaries(section);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_date ON daily_care_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_beneficiary ON daily_care_logs(beneficiary_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_fall_risk_beneficiary ON fall_risk_assessments(beneficiary_id, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_daily_meals_date ON daily_meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON om_maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_assets_status ON om_assets(status);
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║                      الجزء السابع: سياسات الأمان (RLS)                     ║
-- ╚══════════════════════════════════════════════════════════════════════════╝
-- تمكين RLS
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_care_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fall_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dietary_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_preventive_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE accountability_gaps ENABLE ROW LEVEL SECURITY;
-- سياسات القراءة العامة (للمستخدمين المصادق عليهم)
CREATE POLICY IF NOT EXISTS "Allow authenticated read" ON beneficiaries FOR
SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated read" ON employees FOR
SELECT TO authenticated USING (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON daily_care_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON fall_risk_assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON risk_alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON catering_suppliers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON dietary_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON daily_meals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON evaluation_criteria FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON contractor_evaluations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON om_asset_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON om_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON om_maintenance_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON om_preventive_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON om_waste_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON grc_risks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON grc_compliance_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Allow authenticated all" ON accountability_gaps FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- تمكين الوقت الفعلي
ALTER PUBLICATION supabase_realtime
ADD TABLE risk_alerts;
ALTER PUBLICATION supabase_realtime
ADD TABLE daily_care_logs;
ALTER PUBLICATION supabase_realtime
ADD TABLE daily_meals;
ALTER PUBLICATION supabase_realtime
ADD TABLE om_maintenance_requests;