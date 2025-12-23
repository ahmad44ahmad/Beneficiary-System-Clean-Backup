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
-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة | رأس الحربة - الدوال والإجراءات المخزنة
-- الإصدار: 1.0 | التاريخ: 2025-12-23
-- ═══════════════════════════════════════════════════════════════════════════════

-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال التقرير الآلي (Automated Handover Logic)                   │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لتوليد تقرير التسليم تلقائياً بناءً على سجلات الرعاية
CREATE OR REPLACE FUNCTION generate_handover_report(
    p_shift_date DATE,
    p_outgoing_shift TEXT,
    p_section TEXT
) RETURNS JSONB AS $$
DECLARE
    v_report_id UUID;
    v_total_beneficiaries INTEGER;
    v_stable_count INTEGER;
    v_critical_count INTEGER;
    v_summary_incidents TEXT;
BEGIN
    -- 1. حساب الإحصائيات
    SELECT COUNT(*) INTO v_total_beneficiaries 
    FROM beneficiaries 
    WHERE section = p_section AND status = 'نشط';

    SELECT COUNT(*) INTO v_critical_count
    FROM daily_care_logs l
    JOIN beneficiaries b ON l.beneficiary_id = b.id
    WHERE l.log_date = p_shift_date 
      AND l.shift = p_outgoing_shift
      AND b.section = p_section
      AND l.requires_followup = true;

    v_stable_count := v_total_beneficiaries - v_critical_count;

    -- 2. تجميع ملخص الحوادث
    SELECT STRING_AGG(l.incidents, E'\n') INTO v_summary_incidents
    FROM daily_care_logs l
    JOIN beneficiaries b ON l.beneficiary_id = b.id
    WHERE l.log_date = p_shift_date 
      AND l.shift = p_outgoing_shift
      AND b.section = p_section
      AND l.incidents IS NOT NULL;

    -- 3. إنشاء أو تحديث التقرير
    INSERT INTO shift_handover_reports (
        shift_date, outgoing_shift, incoming_shift, section,
        total_beneficiaries, stable_count, critical_count,
        summary_incidents, status
    ) VALUES (
        p_shift_date, 
        p_outgoing_shift,
        CASE 
            WHEN p_outgoing_shift = 'صباحي' THEN 'مسائي'
            WHEN p_outgoing_shift = 'مسائي' THEN 'ليلي'
            ELSE 'صباحي'
        END,
        p_section,
        v_total_beneficiaries, v_stable_count, v_critical_count,
        COALESCE(v_summary_incidents, 'لا توجد حوادث مسجلة'),
        'draft'
    )
    ON CONFLICT (shift_date, outgoing_shift, section) 
    DO UPDATE SET 
        total_beneficiaries = EXCLUDED.total_beneficiaries,
        critical_count = EXCLUDED.critical_count,
        summary_incidents = EXCLUDED.summary_incidents,
        generated_at = NOW()
    RETURNING id INTO v_report_id;

    RETURN jsonb_build_object(
        'success', true, 
        'report_id', v_report_id,
        'message', 'تم توليد تقرير التسليم بنجاح'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال المؤشرات الاستراتيجية (Strategic KPIs Logic)               │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لحساب المؤشرات اليومية (تُستدعى في نهاية اليوم أو كل ساعة)
CREATE OR REPLACE FUNCTION calculate_daily_kpis() RETURNS VOID AS $$
DECLARE
    v_total_capacity CONSTANT INTEGER := 200; -- الطاقة الاستيعابية الثابتة للمثال
    v_current_occupancy INTEGER;
    v_active_alerts INTEGER;
    v_care_logs_count INTEGER;
    v_high_risk_count INTEGER;
BEGIN
    -- حساب الإشغال
    SELECT COUNT(*) INTO v_current_occupancy FROM beneficiaries WHERE status = 'نشط';
    
    -- حساب التنبيهات النشطة
    SELECT COUNT(*) INTO v_active_alerts FROM risk_alerts WHERE status = 'نشط';
    
    -- حساب نسبة اكتمال السجلات (لليوم الحالي)
    SELECT COUNT(*) INTO v_care_logs_count FROM daily_care_logs WHERE log_date = CURRENT_DATE;
    
    -- حساب ذوي الخطورة العالية
    SELECT COUNT(*) INTO v_high_risk_count 
    FROM fall_risk_assessments 
    WHERE risk_level IN ('عالي', 'حرج');

    -- إدخال المؤشرات
    INSERT INTO strategic_kpis (
        kpi_date, section,
        total_capacity, current_occupancy, occupancy_rate,
        active_alerts_count, high_risk_beneficiaries,
        care_logs_completion_rate,
        paper_forms_eliminated, -- كل سجل رقمي يلغي نموذجين ورقيين (افتراض)
        staff_hours_saved -- توفير 5 دقائق لكل سجل
    ) VALUES (
        CURRENT_DATE, NULL, -- المركز ككل
        v_total_capacity,
        v_current_occupancy,
        ROUND((v_current_occupancy::DECIMAL / v_total_capacity) * 100, 2),
        v_active_alerts,
        v_high_risk_count,
        ROUND((v_care_logs_count::DECIMAL / GREATEST(v_current_occupancy * 3, 1)) * 100, 2), -- 3 ورديات
        v_care_logs_count * 2,
        ROUND((v_care_logs_count * 5) / 60.0, 2)
    )
    ON CONFLICT (kpi_date, section)
    DO UPDATE SET
        current_occupancy = EXCLUDED.current_occupancy,
        active_alerts_count = EXCLUDED.active_alerts_count,
        care_logs_completion_rate = EXCLUDED.care_logs_completion_rate,
        paper_forms_eliminated = EXCLUDED.paper_forms_eliminated,
        staff_hours_saved = EXCLUDED.staff_hours_saved,
        calculated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              دوال مساعدة (Helper Functions)                                  │
-- └─────────────────────────────────────────────────────────────────────────────┘

-- دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- تطبيق التحديث الآلي على الجداول الرئيسية
CREATE TRIGGER update_beneficiaries_modtime
    BEFORE UPDATE ON beneficiaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessments_modtime
    BEFORE UPDATE ON fall_risk_assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Perfect Supabase Setup Script
-- Run this in the Supabase SQL Editor to fix all warnings and secure your database.

-- 1. FIX VIEWS SECURITY
-- Using security_invoker allows views to respect the current user's RLS policies
ALTER VIEW public.evacuation_list SET (security_invoker = true);
ALTER VIEW public.critical_low_stock SET (security_invoker = true);
ALTER VIEW public.daily_compliance_summary SET (security_invoker = true);

-- 2. FIX FUNCTION SEARCH PATHS
-- Secures functions against search_path hijacking attacks
ALTER FUNCTION public.upsert_beneficiary_safe SET search_path = public, pg_temp;
ALTER FUNCTION public.set_updated_at SET search_path = public, pg_temp;
ALTER FUNCTION public.normalize_empty_strings SET search_path = public, pg_temp;
ALTER FUNCTION public.set_tenant_id_from_jwt SET search_path = public, pg_temp;
ALTER FUNCTION public.update_updated_at SET search_path = public, pg_temp;
ALTER FUNCTION public.calculate_evacuation_priority SET search_path = public, pg_temp;
ALTER FUNCTION public.check_vital_signs_critical SET search_path = public, pg_temp;
ALTER FUNCTION public.check_medication_stock SET search_path = public, pg_temp;

-- 3. ENABLE ROW LEVEL SECURITY (RLS) & ADD POLICIES
-- Enables security on all tables and allows access for authenticated users

-- beneficiaries_staging
ALTER TABLE public.beneficiaries_staging ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.beneficiaries_staging;
CREATE POLICY "Enable all access for authenticated users" ON public.beneficiaries_staging FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- evacuation_logs
ALTER TABLE public.evacuation_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.evacuation_logs;
CREATE POLICY "Enable all access for authenticated users" ON public.evacuation_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- medications
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.medications;
CREATE POLICY "Enable all access for authenticated users" ON public.medications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- process_executions
ALTER TABLE public.process_executions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.process_executions;
CREATE POLICY "Enable all access for authenticated users" ON public.process_executions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- processes
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.processes;
CREATE POLICY "Enable all access for authenticated users" ON public.processes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- stock_alerts
ALTER TABLE public.stock_alerts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.stock_alerts;
CREATE POLICY "Enable all access for authenticated users" ON public.stock_alerts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. FIX CONSTRAINTS (Optional Clean up)
-- Ensures beneficiaries birth_date allows NULLs if needed in future (though we fixed via data)
ALTER TABLE public.beneficiaries ALTER COLUMN birth_date DROP NOT NULL;
ALTER TABLE public.beneficiaries ALTER COLUMN admission_date DROP NOT NULL;
