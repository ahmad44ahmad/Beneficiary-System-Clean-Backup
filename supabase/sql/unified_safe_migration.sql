-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة | Migration موحد آمن — يضيف الأعمدة المفقودة بدون حذف بيانات
-- التاريخ: 2026-02-21
-- ═══════════════════════════════════════════════════════════════════════════════
-- تعليمات: شغّل هذا الملف في Supabase SQL Editor
-- لن يحذف أي بيانات — يستخدم ADD COLUMN IF NOT EXISTS فقط
-- ═══════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 1: إضافة أعمدة مفقودة لجدول beneficiaries              │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- أعمدة يحتاجها التطبيق ولكنها قد تكون مفقودة من الـ schema الأصلي
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS file_id TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS guardian_relation TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS guardian_address TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS guardian_residence TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS psychiatric_diagnosis TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS disability_type TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS disability_degree TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS iq_level TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS iq_score TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS bedridden BOOLEAN DEFAULT false;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS alerts TEXT[] DEFAULT '{}';
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS social_status TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS visit_frequency TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS last_visit_date TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS dignity_profile JSONB;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS nationality TEXT DEFAULT 'سعودي';
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS hijri_birth_date TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS hijri_admission_date TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS hijri_last_visit_date TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS building TEXT;
ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS admission_type TEXT;

-- sync file_number and file_id
UPDATE beneficiaries SET file_id = file_number WHERE file_id IS NULL AND file_number IS NOT NULL;

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 2: ضمان وجود جداول الإعاشة والتغذية                    │
-- └─────────────────────────────────────────────────────────────────────────────┘

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

CREATE TABLE IF NOT EXISTS dietary_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL,
    allergies TEXT[] DEFAULT '{}',
    disliked_items TEXT[] DEFAULT '{}',
    special_instructions TEXT,
    last_assessment_date DATE DEFAULT CURRENT_DATE,
    nutritionist_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id)
);

CREATE TABLE IF NOT EXISTS daily_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID NOT NULL REFERENCES beneficiaries(id) ON DELETE CASCADE,
    meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    items JSONB DEFAULT '[]',
    consumption_percentage INTEGER,
    refusal_reason TEXT,
    notes TEXT,
    delivered_at TIMESTAMPTZ,
    delivered_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, meal_date, meal_type)
);

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

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 3: ضمان وجود جداول التشغيل والصيانة                    │
-- └─────────────────────────────────────────────────────────────────────────────┘

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

CREATE TABLE IF NOT EXISTS om_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT UNIQUE NOT NULL,
    barcode TEXT,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    category_id UUID REFERENCES om_asset_categories(id),
    asset_type TEXT,
    building TEXT,
    floor TEXT,
    room TEXT,
    location TEXT,
    acquisition_date DATE,
    acquisition_cost DECIMAL(12, 2),
    purchase_date DATE,
    warranty_start DATE,
    warranty_end DATE,
    warranty_expiry DATE,
    status TEXT DEFAULT 'active',
    condition TEXT,
    last_inspection_date DATE,
    next_inspection_date DATE,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE,
    asset_id UUID REFERENCES om_assets(id),
    request_type TEXT,
    priority TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    assigned_to TEXT,
    requested_by TEXT,
    status TEXT DEFAULT 'pending',
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    target_completion DATE,
    actual_completion DATE,
    completed_at TIMESTAMPTZ,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    quality_rating INT,
    completion_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_preventive_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES om_assets(id),
    task_name TEXT NOT NULL,
    task_description TEXT,
    frequency TEXT,
    next_due_date DATE NOT NULL,
    last_completed_date DATE,
    assigned_team TEXT,
    estimated_duration_hours DECIMAL(5, 2),
    is_mandatory BOOLEAN DEFAULT FALSE,
    compliance_standard TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    waste_type TEXT,
    waste_category TEXT,
    source_department TEXT,
    source_location TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    disposal_method TEXT,
    disposal_date DATE,
    contractor_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 4: ضمان وجود جداول الرعاية اليومية                     │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS daily_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    log_time TIME,
    shift TEXT,
    recorded_by UUID,
    category TEXT,
    description TEXT,
    staff_name TEXT,
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
    therapy_sessions TEXT[],
    recreational_activities TEXT[],
    general_notes TEXT,
    incidents TEXT,
    concerns TEXT,
    requires_followup BOOLEAN DEFAULT false,
    followup_priority TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fall_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    assessed_by UUID,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    risk_score INTEGER,
    mobility_score INTEGER DEFAULT 0,
    vision_score INTEGER DEFAULT 0,
    medication_score INTEGER DEFAULT 0,
    environment_score INTEGER DEFAULT 0,
    has_fall_history BOOLEAN DEFAULT false,
    fall_history_count INTEGER DEFAULT 0,
    last_fall_date DATE,
    takes_dizzy_medications BOOLEAN DEFAULT false,
    dizzy_medications TEXT[],
    cognitive_level INTEGER,
    mobility_level INTEGER,
    preventive_measures TEXT[],
    special_instructions TEXT,
    recommendations TEXT,
    assessed_by_name TEXT,
    next_assessment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS risk_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    alert_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    source TEXT,
    triggered_by TEXT,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    status TEXT DEFAULT 'نشط',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 5: ضمان وجود جداول البحث الاجتماعي والطبي              │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS social_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_id TEXT,
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    researcher_name TEXT,
    research_date DATE DEFAULT CURRENT_DATE,
    data JSONB DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    diagnosis TEXT,
    medications JSONB DEFAULT '[]',
    allergies TEXT[] DEFAULT '{}',
    blood_type TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    national_id TEXT,
    record_type TEXT,
    diagnosis TEXT,
    treatment TEXT,
    medication TEXT,
    doctor_name TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rehab_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    national_id TEXT,
    plan_type TEXT,
    goals JSONB DEFAULT '[]',
    status TEXT DEFAULT 'active',
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 6: ضمان وجود جداول الحوكمة والمخاطر                    │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS grc_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_code TEXT,
    code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    department TEXT,
    probability INTEGER,
    impact INTEGER,
    likelihood TEXT,
    risk_score INTEGER,
    mitigation_strategy TEXT,
    mitigation_plan TEXT,
    risk_owner TEXT,
    owner TEXT,
    status TEXT DEFAULT 'open',
    review_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grc_compliance_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard TEXT NOT NULL,
    requirement_code TEXT,
    requirement_text TEXT NOT NULL,
    department TEXT,
    responsible_person TEXT,
    status TEXT DEFAULT 'not_started',
    evidence_url TEXT,
    due_date DATE,
    completion_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accountability_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gap_code TEXT,
    issue_code TEXT,
    title TEXT,
    issue_title TEXT,
    description TEXT,
    issue_description TEXT,
    category TEXT,
    severity TEXT,
    source TEXT,
    responsible_agency TEXT,
    affected_department TEXT,
    status TEXT DEFAULT 'open',
    assigned_to TEXT,
    resolution_notes TEXT,
    target_date DATE,
    evasion_type TEXT,
    days_pending INTEGER DEFAULT 0,
    requires_attention BOOLEAN DEFAULT TRUE,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 7: ضمان وجود جداول التدقيق والموظفين                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    module TEXT,
    table_name TEXT,
    record_id UUID,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    success BOOLEAN DEFAULT true,
    timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    job_title TEXT,
    department TEXT,
    role TEXT DEFAULT 'staff',
    email TEXT,
    phone TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active',
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number TEXT UNIQUE,
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

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 8: ضمان وجود جداول إضافية                              │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE TABLE IF NOT EXISTS dignity_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    care_tips TEXT,
    communication_style TEXT,
    daily_routine TEXT,
    likes TEXT[],
    dislikes TEXT[],
    motivators TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS shift_handover_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_date DATE NOT NULL,
    outgoing_shift TEXT NOT NULL,
    incoming_shift TEXT NOT NULL,
    section TEXT NOT NULL,
    outgoing_staff UUID,
    incoming_staff UUID,
    total_beneficiaries INTEGER,
    stable_count INTEGER,
    needs_attention_count INTEGER,
    critical_count INTEGER,
    summary_vitals TEXT,
    summary_medications TEXT,
    summary_incidents TEXT,
    summary_followups TEXT,
    outgoing_signature_time TIMESTAMPTZ,
    incoming_signature_time TIMESTAMPTZ,
    status TEXT DEFAULT 'draft',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategic_kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kpi_date DATE NOT NULL DEFAULT CURRENT_DATE,
    section TEXT,
    total_capacity INTEGER,
    current_occupancy INTEGER,
    occupancy_rate DECIMAL(5,2),
    fall_incidents_count INTEGER DEFAULT 0,
    high_risk_beneficiaries INTEGER DEFAULT 0,
    active_alerts_count INTEGER DEFAULT 0,
    care_logs_completion_rate DECIMAL(5,2),
    medication_compliance_rate DECIMAL(5,2),
    therapy_sessions_completed INTEGER,
    hand_hygiene_compliance DECIMAL(5,2),
    infection_cases INTEGER DEFAULT 0,
    family_visits_count INTEGER,
    incidents_resolved_rate DECIMAL(5,2),
    staff_hours_saved DECIMAL(10,2),
    paper_forms_eliminated INTEGER,
    estimated_cost_savings DECIMAL(12,2),
    calculated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    beneficiary_id UUID,
    status TEXT DEFAULT 'open',
    escalation_level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID
);

CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type TEXT NOT NULL,
    meal_name TEXT NOT NULL,
    description TEXT,
    calories INTEGER,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    status TEXT DEFAULT 'scheduled',
    served_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    question TEXT NOT NULL,
    max_score INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 9: تمكين RLS وسياسات الوصول الأساسية                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- تمكين RLS على الجداول الجديدة (فقط إذا لم تكن مفعلة)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'beneficiaries', 'daily_care_logs', 'fall_risk_assessments',
        'risk_alerts', 'daily_meals', 'dietary_plans', 'catering_suppliers',
        'contractor_evaluations', 'om_assets', 'om_asset_categories',
        'om_maintenance_requests', 'om_preventive_schedules', 'om_waste_records',
        'grc_risks', 'grc_compliance_items', 'accountability_gaps',
        'audit_logs', 'staff', 'employees', 'dignity_files',
        'shift_handover_reports', 'strategic_kpis', 'alerts', 'meals',
        'social_research', 'medical_profiles', 'medical_records', 'rehab_plans',
        'evaluation_criteria'
    ])
    LOOP
        EXECUTE format('ALTER TABLE IF EXISTS %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END;
$$;

-- سياسات وصول أساسية (authenticated يقرأ ويكتب، anon يقرأ فقط)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'beneficiaries', 'daily_care_logs', 'fall_risk_assessments',
        'risk_alerts', 'daily_meals', 'dietary_plans', 'catering_suppliers',
        'contractor_evaluations', 'om_assets', 'om_asset_categories',
        'om_maintenance_requests', 'om_preventive_schedules', 'om_waste_records',
        'grc_risks', 'grc_compliance_items', 'accountability_gaps',
        'audit_logs', 'staff', 'employees', 'dignity_files',
        'shift_handover_reports', 'strategic_kpis', 'alerts', 'meals',
        'social_research', 'medical_profiles', 'medical_records', 'rehab_plans',
        'evaluation_criteria'
    ])
    LOOP
        -- سياسة القراءة والكتابة للمستخدمين المصادق عليهم
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "auth_all_%1$s" ON %1$I FOR ALL TO authenticated USING (true) WITH CHECK (true)',
            t
        );
        -- سياسة القراءة فقط للمجهولين
        EXECUTE format(
            'CREATE POLICY IF NOT EXISTS "anon_read_%1$s" ON %1$I FOR SELECT TO anon USING (true)',
            t
        );
    END LOOP;
END;
$$;

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الخطوة 10: فهارس لتحسين الأداء                                │
-- └─────────────────────────────────────────────────────────────────────────────┘

CREATE INDEX IF NOT EXISTS idx_beneficiaries_section ON beneficiaries(section);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id ON beneficiaries(national_id);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_date ON daily_care_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_beneficiary ON daily_care_logs(beneficiary_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_fall_risk_beneficiary ON fall_risk_assessments(beneficiary_id, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status, severity);
CREATE INDEX IF NOT EXISTS idx_daily_meals_date ON daily_meals(meal_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON om_maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_assets_status ON om_assets(status);
CREATE INDEX IF NOT EXISTS idx_grc_risks_status ON grc_risks(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- ═══════════════════════════════════════════════════════════════════════════════
-- نهاية الـ Migration الموحد — كل التغييرات آمنة وغير مدمرة
-- ═══════════════════════════════════════════════════════════════════════════════
