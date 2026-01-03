-- ═══════════════════════════════════════════════════════════════════════════════
-- بصيرة 2.0 | Schema النهائي المُحسّن
-- الإصدار: 2.0 Final | التاريخ: 2026-01-03
-- الفلسفة: من "إدارة الرعاية" ← إلى "إدارة التمكين"
-- ═══════════════════════════════════════════════════════════════════════════════
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │                    الخيط الذهبي: ربط كل جدول بالأهداف الوطنية               │
-- │         إجراء الممارس ← مؤشر القسم ← هدف المركز ← رؤية 2030               │
-- └─────────────────────────────────────────────────────────────────────────────┘
-- ═══════════════════════════════════════════════════════════════════════════════
-- الجزء الأول: وحدة مكافحة العدوى (IPC Module) | RICE: 950
-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. جدول المواقع داخل المركز
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_en TEXT,
    section TEXT CHECK (
        section IN ('ذكور', 'إناث', 'أطفال', 'إداري', 'خدمات')
    ),
    building TEXT DEFAULT 'المبنى الرئيسي',
    floor INTEGER DEFAULT 0,
    capacity INTEGER,
    is_high_risk BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج المواقع الأساسية
INSERT INTO locations (name, section, is_high_risk)
VALUES ('جناح الذكور - الدور الأول', 'ذكور', false),
    ('جناح الذكور - الدور الثاني', 'ذكور', false),
    ('جناح الإناث - الدور الأول', 'إناث', false),
    ('جناح الإناث - الدور الثاني', 'إناث', false),
    ('جناح الأطفال', 'أطفال', true),
    ('العيادة الطبية', 'خدمات', true),
    ('غرفة العزل', 'خدمات', true),
    ('المطبخ الرئيسي', 'خدمات', true),
    ('المغسلة', 'خدمات', false),
    ('الإدارة', 'إداري', false) ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════════════
-- 2. جدول قوالب قوائم التحقق (يجب إنشاؤه أولاً)
CREATE TABLE IF NOT EXISTS ipc_checklist_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name TEXT NOT NULL,
    template_name_ar TEXT NOT NULL,
    category TEXT CHECK (
        category IN (
            'hygiene',
            'ppe',
            'waste',
            'environment',
            'equipment'
        )
    ),
    checklist_items JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج القوالب المعيارية
INSERT INTO ipc_checklist_templates (
        template_name,
        template_name_ar,
        category,
        checklist_items
    )
VALUES (
        'Daily IPC Round',
        'الجولة اليومية لمكافحة العدوى',
        'hygiene',
        '{
    "hand_hygiene_moment_1": {"ar": "قبل ملامسة المريض", "weight": 10, "category": "5_moments"},
    "hand_hygiene_moment_2": {"ar": "قبل الإجراء التعقيمي", "weight": 10, "category": "5_moments"},
    "hand_hygiene_moment_3": {"ar": "بعد التعرض لسوائل الجسم", "weight": 10, "category": "5_moments"},
    "hand_hygiene_moment_4": {"ar": "بعد ملامسة المريض", "weight": 10, "category": "5_moments"},
    "hand_hygiene_moment_5": {"ar": "بعد ملامسة محيط المريض", "weight": 10, "category": "5_moments"},
    "sanitizer_available": {"ar": "توفر المعقم في نقاط الرعاية", "weight": 5, "category": "supplies"},
    "soap_dispenser_filled": {"ar": "موزعات الصابون ممتلئة", "weight": 5, "category": "supplies"},
    "ppe_gloves_available": {"ar": "توفر القفازات", "weight": 8, "category": "ppe"},
    "ppe_gowns_available": {"ar": "توفر العباءات الواقية", "weight": 8, "category": "ppe"},
    "ppe_masks_available": {"ar": "توفر الكمامات", "weight": 8, "category": "ppe"},
    "waste_yellow_correct": {"ar": "فرز النفايات الطبية (أصفر)", "weight": 8, "category": "waste"},
    "waste_black_correct": {"ar": "فرز النفايات العادية (أسود)", "weight": 4, "category": "waste"},
    "sharps_container_safe": {"ar": "حاويات الأدوات الحادة آمنة", "weight": 8, "category": "waste"},
    "surface_disinfection_log": {"ar": "سجل تطهير الأسطح موثق", "weight": 6, "category": "environment"}
}'::JSONB
    ),
    (
        'Isolation Room Check',
        'فحص غرفة العزل',
        'environment',
        '{
    "negative_pressure_working": {"ar": "الضغط السلبي يعمل", "weight": 20, "category": "ventilation"},
    "door_closed": {"ar": "الباب مغلق دائماً", "weight": 15, "category": "containment"},
    "ppe_station_outside": {"ar": "محطة PPE خارج الغرفة", "weight": 15, "category": "ppe"},
    "waste_inside_room": {"ar": "النفايات داخل الغرفة فقط", "weight": 15, "category": "waste"},
    "signage_visible": {"ar": "لافتة العزل واضحة", "weight": 10, "category": "communication"},
    "visitor_log_updated": {"ar": "سجل الزوار محدث", "weight": 10, "category": "tracking"},
    "dedicated_equipment": {"ar": "أجهزة مخصصة للغرفة", "weight": 15, "category": "equipment"}
}'::JSONB
    ) ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════════════
-- 3. جدول حوادث العدوى والتعرض
CREATE TABLE IF NOT EXISTS ipc_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- التصنيف والتوقيت
    incident_category TEXT NOT NULL CHECK (
        incident_category IN (
            'infection_confirmed',
            'infection_suspected',
            'needle_stick',
            'blood_exposure',
            'outbreak_alert',
            'colonization'
        )
    ),
    detection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    detection_time TIME DEFAULT CURRENT_TIME,
    -- الأطراف المعنية
    affected_type TEXT NOT NULL CHECK (
        affected_type IN ('beneficiary', 'staff', 'visitor')
    ),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE
    SET NULL,
        reported_by TEXT NOT NULL,
        -- الموقع
        location_id UUID REFERENCES locations(id),
        -- البيانات السريرية
        infection_site TEXT,
        pathogen_identified TEXT,
        symptoms JSONB DEFAULT '[]',
        onset_date DATE,
        severity_level TEXT DEFAULT 'mild' CHECK (
            severity_level IN ('mild', 'moderate', 'severe', 'critical')
        ),
        -- الإجراءات الفورية
        immediate_actions JSONB DEFAULT '[]',
        isolation_required BOOLEAN DEFAULT false,
        isolation_type TEXT CHECK (
            isolation_type IN ('contact', 'droplet', 'airborne', 'combined')
        ),
        isolation_start_date DATE,
        isolation_end_date DATE,
        -- سير العمل
        status TEXT DEFAULT 'open' CHECK (
            status IN (
                'open',
                'investigating',
                'containment',
                'resolved',
                'closed'
            )
        ),
        assigned_to TEXT,
        investigation_notes TEXT,
        root_cause TEXT,
        outcome TEXT,
        lessons_learned TEXT,
        -- الربط بالخيط الذهبي
        linked_kpi TEXT DEFAULT 'infection_rate',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ipc_incidents_date ON ipc_incidents(detection_date DESC);
CREATE INDEX IF NOT EXISTS idx_ipc_incidents_category ON ipc_incidents(incident_category);
CREATE INDEX IF NOT EXISTS idx_ipc_incidents_status ON ipc_incidents(status);
-- ═══════════════════════════════════════════════════════════════════════════════
-- 4. جدول جولات التفتيش اليومية
CREATE TABLE IF NOT EXISTS ipc_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    inspection_time TIME DEFAULT CURRENT_TIME,
    shift TEXT CHECK (shift IN ('صباحي', 'مسائي', 'ليلي')),
    -- المفتش والموقع
    inspector_name TEXT NOT NULL,
    location_id UUID REFERENCES locations(id) NOT NULL,
    -- بيانات قائمة التحقق
    checklist_template_id UUID REFERENCES ipc_checklist_templates(id),
    checklist_data JSONB NOT NULL DEFAULT '{}',
    -- النتائج المحسوبة
    total_items INTEGER DEFAULT 0,
    compliant_items INTEGER DEFAULT 0,
    compliance_score DECIMAL(5, 2) DEFAULT 0,
    -- المخالفات والإجراءات
    non_compliance_details TEXT,
    corrective_actions TEXT,
    corrective_action_deadline DATE,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    follow_up_completed BOOLEAN DEFAULT false,
    -- التوثيق المرئي
    evidence_photos TEXT [],
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ipc_inspections_date ON ipc_inspections(inspection_date DESC);
CREATE INDEX IF NOT EXISTS idx_ipc_inspections_location ON ipc_inspections(location_id);
CREATE INDEX IF NOT EXISTS idx_ipc_inspections_score ON ipc_inspections(compliance_score);
-- ═══════════════════════════════════════════════════════════════════════════════
-- 5. جدول التحصينات والمناعة
CREATE TABLE IF NOT EXISTS immunizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- الشخص المُحصّن
    person_type TEXT NOT NULL CHECK (person_type IN ('beneficiary', 'staff')),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    staff_name TEXT,
    -- بيانات التطعيم
    vaccine_code TEXT NOT NULL,
    vaccine_name TEXT NOT NULL,
    vaccine_name_ar TEXT,
    dose_number INTEGER DEFAULT 1,
    total_doses INTEGER DEFAULT 1,
    -- التواريخ
    date_administered DATE NOT NULL,
    next_due_date DATE,
    expiry_date DATE,
    -- بيانات التشغيلة
    batch_number TEXT,
    manufacturer TEXT,
    administered_by TEXT,
    administration_site TEXT,
    -- حالة المناعة
    immunity_status TEXT DEFAULT 'pending' CHECK (
        immunity_status IN (
            'pending',
            'immune',
            'non_responder',
            'expired',
            'contraindicated',
            'declined'
        )
    ),
    -- ردود الفعل السلبية
    adverse_reaction BOOLEAN DEFAULT false,
    reaction_type TEXT,
    reaction_severity TEXT CHECK (
        reaction_severity IN ('mild', 'moderate', 'severe')
    ),
    reaction_details TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_immunizations_person ON immunizations(person_type, beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_immunizations_vaccine ON immunizations(vaccine_code);
CREATE INDEX IF NOT EXISTS idx_immunizations_due ON immunizations(next_due_date);
-- ═══════════════════════════════════════════════════════════════════════════════
-- الجزء الثاني: وحدة التمكين والتأهيل | RICE: 680
-- ═══════════════════════════════════════════════════════════════════════════════
-- 6. جدول الأهداف التأهيلية الذكية (SMART Goals)
CREATE TABLE IF NOT EXISTS rehab_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL,
    -- المجال التأهيلي
    domain TEXT NOT NULL CHECK (
        domain IN (
            'medical',
            'physical',
            'occupational',
            'speech',
            'psychological',
            'social',
            'educational',
            'self_care',
            'vocational'
        )
    ),
    -- الهدف (S.M.A.R.T)
    goal_title TEXT NOT NULL,
    goal_description TEXT NOT NULL,
    -- Measurable: القياس
    measurement_type TEXT CHECK (
        measurement_type IN (
            'numeric',
            'frequency',
            'duration',
            'percentage',
            'milestone',
            'scale'
        )
    ),
    measurement_unit TEXT,
    baseline_value DECIMAL(10, 2),
    target_value DECIMAL(10, 2),
    current_value DECIMAL(10, 2),
    -- Relevant: جودة الحياة
    quality_of_life_dimension TEXT CHECK (
        quality_of_life_dimension IN (
            'physical_wellbeing',
            'emotional_wellbeing',
            'social_inclusion',
            'interpersonal_relations',
            'personal_development',
            'self_determination',
            'material_wellbeing',
            'rights'
        )
    ),
    -- Time-bound
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_date DATE NOT NULL,
    -- المسؤولية
    assigned_to TEXT,
    assigned_department TEXT,
    -- الحالة والتقدم
    status TEXT DEFAULT 'planned' CHECK (
        status IN (
            'planned',
            'in_progress',
            'achieved',
            'partially_achieved',
            'on_hold',
            'abandoned',
            'revised'
        )
    ),
    progress_percentage INTEGER DEFAULT 0 CHECK (
        progress_percentage BETWEEN 0 AND 100
    ),
    -- التوثيق
    achievement_evidence TEXT,
    barriers_notes TEXT,
    family_involvement TEXT,
    -- الربط بالخيط الذهبي
    linked_national_goal TEXT,
    linked_kpi TEXT DEFAULT 'goal_achievement_rate',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT
);
CREATE INDEX IF NOT EXISTS idx_rehab_goals_beneficiary ON rehab_goals(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_rehab_goals_domain ON rehab_goals(domain);
CREATE INDEX IF NOT EXISTS idx_rehab_goals_status ON rehab_goals(status);
-- ═══════════════════════════════════════════════════════════════════════════════
-- 7. جدول سجل تقدم الأهداف
CREATE TABLE IF NOT EXISTS goal_progress_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES rehab_goals(id) ON DELETE CASCADE NOT NULL,
    recorded_value DECIMAL(10, 2),
    previous_value DECIMAL(10, 2),
    progress_note TEXT,
    session_type TEXT CHECK (
        session_type IN ('individual', 'group', 'home', 'community')
    ),
    session_duration_minutes INTEGER,
    beneficiary_feedback TEXT,
    family_feedback TEXT,
    recorded_by TEXT NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_goal_progress_goal ON goal_progress_logs(goal_id);
-- ═══════════════════════════════════════════════════════════════════════════════
-- 8. مكتبة الأهداف المعيارية
CREATE TABLE IF NOT EXISTS goal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT NOT NULL,
    goal_title TEXT NOT NULL,
    goal_description TEXT NOT NULL,
    measurement_type TEXT,
    measurement_unit TEXT,
    typical_duration_weeks INTEGER,
    difficulty_level TEXT CHECK (
        difficulty_level IN ('easy', 'moderate', 'challenging')
    ),
    age_group TEXT CHECK (
        age_group IN ('child', 'adolescent', 'adult', 'elderly', 'all')
    ),
    disability_types TEXT [],
    prerequisites TEXT [],
    success_criteria TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- إدراج أهداف معيارية
INSERT INTO goal_templates (
        domain,
        goal_title,
        goal_description,
        measurement_type,
        measurement_unit,
        typical_duration_weeks,
        difficulty_level,
        age_group
    )
VALUES (
        'physical',
        'المشي باستقلالية',
        'المشي لمسافة محددة بدون مساعدة',
        'numeric',
        'متر',
        12,
        'moderate',
        'all'
    ),
    (
        'physical',
        'صعود الدرج',
        'صعود ونزول 10 درجات بأمان',
        'milestone',
        NULL,
        8,
        'challenging',
        'all'
    ),
    (
        'self_care',
        'ارتداء الملابس',
        'ارتداء الملابس الخارجية باستقلالية',
        'milestone',
        NULL,
        16,
        'moderate',
        'all'
    ),
    (
        'self_care',
        'تناول الطعام',
        'استخدام أدوات الطعام بشكل مستقل',
        'scale',
        'درجة من 10',
        12,
        'easy',
        'all'
    ),
    (
        'speech',
        'نطق الكلمات',
        'نطق عدد محدد من الكلمات بوضوح',
        'numeric',
        'كلمة',
        24,
        'moderate',
        'child'
    ),
    (
        'social',
        'التفاعل الاجتماعي',
        'المشاركة في نشاط جماعي',
        'duration',
        'دقيقة',
        12,
        'moderate',
        'all'
    ),
    (
        'psychological',
        'إدارة الغضب',
        'استخدام استراتيجيات التهدئة',
        'frequency',
        'مرة/أسبوع',
        16,
        'challenging',
        'all'
    ),
    (
        'educational',
        'التعرف على الحروف',
        'التعرف على 28 حرفاً عربياً',
        'numeric',
        'حرف',
        24,
        'moderate',
        'child'
    ),
    (
        'vocational',
        'مهارة مهنية',
        'إتقان مهارة مهنية للتوظيف',
        'milestone',
        NULL,
        24,
        'challenging',
        'adult'
    ) ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════════════
-- 9. جدول "ملف الكرامة" - التفضيلات الشخصية
CREATE TABLE IF NOT EXISTS beneficiary_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE NOT NULL UNIQUE,
    -- تفضيلات الهوية والتواصل
    preferred_name TEXT,
    preferred_title TEXT,
    communication_style TEXT,
    communication_aids TEXT [],
    language_preference TEXT DEFAULT 'العربية',
    -- تفضيلات الرعاية
    preferred_caregiver_gender TEXT CHECK (
        preferred_caregiver_gender IN ('ذكر', 'أنثى', 'لا تفضيل')
    ),
    wake_up_time TIME,
    sleep_time TIME,
    nap_preferences TEXT,
    -- تفضيلات الأنشطة
    preferred_activities TEXT [],
    disliked_activities TEXT [],
    hobbies TEXT [],
    strengths TEXT [],
    -- تفضيلات الطعام
    favorite_foods TEXT [],
    disliked_foods TEXT [],
    eating_preferences TEXT,
    mealtime_rituals TEXT,
    -- التواصل مع الأسرة
    family_contact_frequency TEXT,
    preferred_visit_days TEXT [],
    preferred_visit_times TEXT,
    -- الاحتياجات الحسية والسلوكية
    sensory_sensitivities TEXT,
    calming_strategies TEXT [],
    triggers_to_avoid TEXT [],
    motivators TEXT [],
    -- التفضيلات الدينية والثقافية
    prayer_support_needed BOOLEAN DEFAULT false,
    religious_preferences TEXT,
    cultural_considerations TEXT,
    -- ملاحظات خاصة
    important_history TEXT,
    what_makes_me_happy TEXT,
    what_makes_me_upset TEXT,
    my_dreams TEXT,
    last_reviewed_date DATE,
    reviewed_by TEXT,
    family_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ═══════════════════════════════════════════════════════════════════════════════
-- الجزء الثالث: Triggers والأتمتة
-- ═══════════════════════════════════════════════════════════════════════════════
-- Trigger 1: حساب نسبة الامتثال لجولات التفتيش
CREATE OR REPLACE FUNCTION calculate_ipc_compliance_score() RETURNS TRIGGER AS $$
DECLARE v_total INT;
v_passed INT;
BEGIN
SELECT COUNT(*),
    COUNT(*) FILTER (
        WHERE value::TEXT = 'true'
    ) INTO v_total,
    v_passed
FROM jsonb_each(NEW.checklist_data);
NEW.total_items := v_total;
NEW.compliant_items := v_passed;
IF v_total > 0 THEN NEW.compliance_score := ROUND((v_passed::DECIMAL / v_total::DECIMAL) * 100, 2);
ELSE NEW.compliance_score := 0;
END IF;
NEW.follow_up_required := (NEW.compliance_score < 80);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_calculate_ipc_compliance ON ipc_inspections;
CREATE TRIGGER trg_calculate_ipc_compliance BEFORE
INSERT
    OR
UPDATE ON ipc_inspections FOR EACH ROW EXECUTE FUNCTION calculate_ipc_compliance_score();
-- ═══════════════════════════════════════════════════════════════════════════════
-- Trigger 2: حساب تقدم الأهداف التأهيلية
CREATE OR REPLACE FUNCTION calculate_goal_progress() RETURNS TRIGGER AS $$ BEGIN IF NEW.measurement_type = 'milestone' THEN NEW.progress_percentage := CASE
        WHEN NEW.status = 'achieved' THEN 100
        ELSE 0
    END;
ELSIF NEW.baseline_value IS NOT NULL
AND NEW.target_value IS NOT NULL
AND NEW.current_value IS NOT NULL THEN IF NEW.target_value != NEW.baseline_value THEN NEW.progress_percentage := LEAST(
    100,
    GREATEST(
        0,
        ROUND(
            (
                (NEW.current_value - NEW.baseline_value) / (NEW.target_value - NEW.baseline_value)
            ) * 100
        )::INTEGER
    )
);
END IF;
END IF;
IF NEW.progress_percentage >= 100
AND NEW.status NOT IN ('achieved', 'partially_achieved') THEN NEW.status := 'achieved';
ELSIF NEW.progress_percentage > 0
AND NEW.status = 'planned' THEN NEW.status := 'in_progress';
END IF;
NEW.updated_at := NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_calculate_goal_progress ON rehab_goals;
CREATE TRIGGER trg_calculate_goal_progress BEFORE
INSERT
    OR
UPDATE ON rehab_goals FOR EACH ROW EXECUTE FUNCTION calculate_goal_progress();
-- ═══════════════════════════════════════════════════════════════════════════════
-- Trigger 3: تحديث updated_at
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_update_ipc_incidents ON ipc_incidents;
CREATE TRIGGER trg_update_ipc_incidents BEFORE
UPDATE ON ipc_incidents FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_update_immunizations ON immunizations;
CREATE TRIGGER trg_update_immunizations BEFORE
UPDATE ON immunizations FOR EACH ROW EXECUTE FUNCTION update_timestamp();
DROP TRIGGER IF EXISTS trg_update_preferences ON beneficiary_preferences;
CREATE TRIGGER trg_update_preferences BEFORE
UPDATE ON beneficiary_preferences FOR EACH ROW EXECUTE FUNCTION update_timestamp();
-- ═══════════════════════════════════════════════════════════════════════════════
-- الجزء الرابع: سياسات الأمان (RLS)
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipc_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipc_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ipc_checklist_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehab_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiary_preferences ENABLE ROW LEVEL SECURITY;
-- سياسات القراءة والكتابة للمستخدمين المصادقين
CREATE POLICY "authenticated_all_locations" ON locations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_ipc_incidents" ON ipc_incidents FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_ipc_inspections" ON ipc_inspections FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_ipc_templates" ON ipc_checklist_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_immunizations" ON immunizations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_rehab_goals" ON rehab_goals FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_goal_progress" ON goal_progress_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_goal_templates" ON goal_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_all_preferences" ON beneficiary_preferences FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- سياسات للوصول المجهول (للقراءة فقط)
CREATE POLICY "anon_read_locations" ON locations FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read_ipc_templates" ON ipc_checklist_templates FOR
SELECT TO anon USING (true);
CREATE POLICY "anon_read_goal_templates" ON goal_templates FOR
SELECT TO anon USING (true);
-- ═══════════════════════════════════════════════════════════════════════════════
-- الجزء الخامس: Views التحليلية
-- ═══════════════════════════════════════════════════════════════════════════════
-- View: ملخص الامتثال الأسبوعي
CREATE OR REPLACE VIEW v_ipc_weekly_compliance AS
SELECT DATE_TRUNC('week', inspection_date) AS week_start,
    COUNT(*) AS total_inspections,
    ROUND(AVG(compliance_score), 2) AS avg_compliance,
    COUNT(*) FILTER (
        WHERE compliance_score >= 85
    ) AS excellent_count,
    COUNT(*) FILTER (
        WHERE compliance_score < 70
    ) AS poor_count
FROM ipc_inspections
GROUP BY DATE_TRUNC('week', inspection_date)
ORDER BY week_start DESC;
-- View: ملخص حالات العدوى
CREATE OR REPLACE VIEW v_ipc_incident_summary AS
SELECT incident_category,
    status,
    COUNT(*) AS count,
    MAX(detection_date) AS latest_date
FROM ipc_incidents
GROUP BY incident_category,
    status;
-- View: تقدم الأهداف التأهيلية
CREATE OR REPLACE VIEW v_rehab_progress_summary AS
SELECT b.id AS beneficiary_id,
    b.full_name,
    COUNT(g.id) AS total_goals,
    COUNT(*) FILTER (
        WHERE g.status = 'achieved'
    ) AS achieved_goals,
    COUNT(*) FILTER (
        WHERE g.status = 'in_progress'
    ) AS in_progress_goals,
    ROUND(AVG(g.progress_percentage), 0) AS avg_progress
FROM beneficiaries b
    LEFT JOIN rehab_goals g ON b.id = g.beneficiary_id
GROUP BY b.id,
    b.full_name;
-- ═══════════════════════════════════════════════════════════════════════════════
-- نهاية الـ Schema - بصيرة 2.0
-- ═══════════════════════════════════════════════════════════════════════════════