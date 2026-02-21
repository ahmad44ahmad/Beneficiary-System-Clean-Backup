-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة | رأس الحربة - قاعدة البيانات المصغرة لكسر البيروقراطية
-- الإصدار: 1.0 | التاريخ: 2025-12-23
-- ═══════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                         الجداول الأساسية (Core Tables)                      │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 1. جدول المستفيدين (مبسط)
CREATE TABLE IF NOT EXISTS beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_number TEXT UNIQUE NOT NULL,           -- رقم الملف
    full_name TEXT NOT NULL,                    -- الاسم الكامل
    national_id TEXT,                           -- رقم الهوية
    date_of_birth DATE,                         -- تاريخ الميلاد
    gender TEXT CHECK (gender IN ('ذكر', 'أنثى')),
    section TEXT NOT NULL,                      -- القسم (ذكور، إناث، أطفال)
    room_number TEXT,                           -- رقم الغرفة
    bed_number TEXT,                            -- رقم السرير
    admission_date DATE,                        -- تاريخ الإيواء
    guardian_name TEXT,                         -- اسم ولي الأمر
    guardian_phone TEXT,                        -- هاتف ولي الأمر
    medical_diagnosis TEXT,                     -- التشخيص الطبي
    mobility_type TEXT CHECK (mobility_type IN ('مشي_مستقل', 'مشي_بمساعدة', 'كرسي_متحرك', 'طريح_فراش')),
    communication_type TEXT CHECK (communication_type IN ('لفظي', 'إشارة', 'بصري', 'لمسي', 'لا_يتواصل')),
    special_needs TEXT[],                       -- احتياجات خاصة
    status TEXT DEFAULT 'نشط' CHECK (status IN ('نشط', 'إجازة', 'منقول', 'متوفى')),
    photo_url TEXT,                             -- صورة المستفيد
    evacuation_category TEXT CHECK (evacuation_category IN ('أخضر', 'أصفر', 'أحمر')), -- إضافة جديدة للإخلاء
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. جدول الموظفين (مبسط)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_number TEXT UNIQUE NOT NULL,       -- الرقم الوظيفي
    full_name TEXT NOT NULL,                    -- الاسم الكامل
    job_title TEXT NOT NULL,                    -- المسمى الوظيفي
    department TEXT NOT NULL,                   -- القسم/الإدارة
    section TEXT,                               -- الجناح (ذكور، إناث، أطفال)
    phone TEXT,                                 -- رقم الجوال
    email TEXT,                                 -- البريد الإلكتروني
    role TEXT DEFAULT 'موظف' CHECK (role IN ('موظف', 'مشرف', 'مدير_قسم', 'مدير_مركز', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الوحدة الأولى: محرك التسليم الرقمي (Digital Handover)           │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 3. سجل المتابعة اليومية
CREATE TABLE IF NOT EXISTS daily_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    recorded_by UUID REFERENCES employees(id) NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('صباحي', 'مسائي', 'ليلي')),
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    log_time TIME NOT NULL DEFAULT CURRENT_TIME,
    
    temperature DECIMAL(4,1),
    pulse INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    oxygen_saturation INTEGER,
    blood_sugar INTEGER,
    weight DECIMAL(5,2),
    
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
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(beneficiary_id, shift, log_date)
);

-- 4. تقرير التسليم الآلي
CREATE TABLE IF NOT EXISTS shift_handover_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_date DATE NOT NULL,
    outgoing_shift TEXT NOT NULL,
    incoming_shift TEXT NOT NULL,
    section TEXT NOT NULL,
    
    outgoing_staff UUID REFERENCES employees(id),
    incoming_staff UUID REFERENCES employees(id),
    
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
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(shift_date, outgoing_shift, section)
);

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              الوحدة الثانية: الحارس الذكي (Fall Risk Guardian)              │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 5. تقييم مخاطر السقوط
CREATE TABLE IF NOT EXISTS fall_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    assessed_by UUID REFERENCES employees(id) NOT NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    has_fall_history BOOLEAN DEFAULT false,
    fall_history_count INTEGER DEFAULT 0,
    last_fall_date DATE,
    
    takes_dizzy_medications BOOLEAN DEFAULT false,
    dizzy_medications TEXT[],
    
    cognitive_level INTEGER CHECK (cognitive_level BETWEEN 1 AND 3),
    mobility_level INTEGER CHECK (mobility_level BETWEEN 1 AND 4),
    
    risk_score DECIMAL(5,2) GENERATED ALWAYS AS (
        (CASE WHEN has_fall_history THEN 30 ELSE 0 END) +
        (CASE WHEN takes_dizzy_medications THEN 25 ELSE 0 END) +
        (COALESCE(cognitive_level, 1) * 8.33) +
        (COALESCE(mobility_level, 1) * 5)
    ) STORED,
    
    risk_level TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN (CASE WHEN has_fall_history THEN 30 ELSE 0 END) +
                 (CASE WHEN takes_dizzy_medications THEN 25 ELSE 0 END) +
                 (COALESCE(cognitive_level, 1) * 8.33) +
                 (COALESCE(mobility_level, 1) * 5) >= 75 THEN 'حرج'
            WHEN (CASE WHEN has_fall_history THEN 30 ELSE 0 END) +
                 (CASE WHEN takes_dizzy_medications THEN 25 ELSE 0 END) +
                 (COALESCE(cognitive_level, 1) * 8.33) +
                 (COALESCE(mobility_level, 1) * 5) >= 50 THEN 'عالي'
            WHEN (CASE WHEN has_fall_history THEN 30 ELSE 0 END) +
                 (CASE WHEN takes_dizzy_medications THEN 25 ELSE 0 END) +
                 (COALESCE(cognitive_level, 1) * 8.33) +
                 (COALESCE(mobility_level, 1) * 5) >= 25 THEN 'متوسط'
            ELSE 'منخفض'
        END
    ) STORED,
    
    preventive_measures TEXT[],
    special_instructions TEXT,
    next_assessment_date DATE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. سجل حوادث السقوط
CREATE TABLE IF NOT EXISTS fall_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    reported_by UUID REFERENCES employees(id) NOT NULL,
    incident_datetime TIMESTAMPTZ NOT NULL,
    location TEXT NOT NULL,
    was_witnessed BOOLEAN,
    witness_name TEXT,
    activity_during_fall TEXT,
    injury_occurred BOOLEAN DEFAULT false,
    injury_type TEXT,
    injury_severity TEXT,
    immediate_actions TEXT,
    medical_evaluation_done BOOLEAN DEFAULT false,
    physician_notified BOOLEAN DEFAULT false,
    family_notified BOOLEAN DEFAULT false,
    contributing_factors TEXT[],
    environmental_factors TEXT[],
    corrective_actions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. تنبيهات المخاطر
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

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │           الوحدة الثالثة: لوحة الحقيقة التنفيذية (Executive Dashboard)       │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- 8. مؤشرات الأداء الاستراتيجية
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
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(kpi_date, section)
);

-- 9. سجل التدقيق
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES employees(id),
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_beneficiaries_section ON beneficiaries(section);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_date ON daily_care_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_care_logs_beneficiary ON daily_care_logs(beneficiary_id, log_date DESC);
CREATE INDEX IF NOT EXISTS idx_fall_risk_beneficiary ON fall_risk_assessments(beneficiary_id, assessment_date DESC);
CREATE INDEX IF NOT EXISTS idx_risk_alerts_status ON risk_alerts(status, severity);

-- REALTIME setup
ALTER PUBLICATION supabase_realtime ADD TABLE risk_alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE daily_care_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE strategic_kpis;
