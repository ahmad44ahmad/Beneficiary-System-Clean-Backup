-- ========================================
-- BASIRA DEMO ENVIRONMENT - FULL SCHEMA & SEED
-- ========================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
-- If supported
-- ========================================
-- 1. DROPPING EXISTING TABLES (CLEAN SLATE)
-- ========================================
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS conscience_log CASCADE;
DROP TABLE IF EXISTS wisdom_entries CASCADE;
DROP TABLE IF EXISTS quality_checks CASCADE;
DROP TABLE IF EXISTS catering_violations CASCADE;
DROP TABLE IF EXISTS meals CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS rehabilitation_plans CASCADE;
DROP TABLE IF EXISTS social_services CASCADE;
DROP TABLE IF EXISTS medical_records CASCADE;
DROP TABLE IF EXISTS staff CASCADE;
DROP TABLE IF EXISTS beneficiaries CASCADE;
-- ========================================
-- 2. SCHEMA CREATION
-- ========================================
-- 2.1 Beneficiaries
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_number TEXT UNIQUE NOT NULL,
    national_id TEXT,
    full_name TEXT NOT NULL,
    full_name_en TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    -- age calculated in application or via generated column if PG version supports it standardly
    nationality TEXT DEFAULT 'سعودي',
    -- Disability Info
    disability_type TEXT,
    disability_degree TEXT CHECK (
        disability_degree IN ('simple', 'moderate', 'severe', 'profound')
    ),
    mobility_status TEXT CHECK (
        mobility_status IN (
            'independent',
            'assisted',
            'wheelchair',
            'bedridden'
        )
    ),
    -- Admission Info
    admission_date DATE,
    admission_type TEXT CHECK (
        admission_type IN ('permanent', 'temporary', 'daycare')
    ),
    building TEXT,
    room_number TEXT,
    bed_number TEXT,
    -- Status
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'discharged',
            'transferred',
            'deceased',
            'on_leave'
        )
    ),
    -- Contact
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_relation TEXT,
    emergency_contact TEXT,
    -- Media
    photo_url TEXT,
    -- Meta
    notes TEXT,
    tags TEXT [],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- 2.2 Staff
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT CHECK (
        role IN (
            'admin',
            'director',
            'supervisor',
            'specialist',
            'staff'
        )
    ),
    email TEXT,
    phone TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'terminated')),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.3 Medical Records
CREATE TABLE medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    record_type TEXT NOT NULL CHECK (
        record_type IN (
            'diagnosis',
            'medication',
            'vital_signs',
            'assessment',
            'procedure'
        )
    ),
    -- Diagnosis
    diagnosis_code TEXT,
    diagnosis_name TEXT,
    diagnosis_date DATE,
    diagnosing_doctor TEXT,
    -- Medication
    medication_name TEXT,
    dosage TEXT,
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    prescribing_doctor TEXT,
    -- Vitals
    vital_type TEXT,
    vital_value TEXT,
    vital_unit TEXT,
    measured_at TIMESTAMP,
    measured_by UUID REFERENCES staff(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
-- 2.4 Social Services
CREATE TABLE social_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL CHECK (
        service_type IN (
            'family_visit',
            'phone_call',
            'outing',
            'therapy_session',
            'skill_training',
            'social_research',
            'family_meeting',
            'external_activity'
        )
    ),
    service_date DATE NOT NULL,
    duration_minutes INTEGER,
    description TEXT,
    outcome TEXT,
    next_action TEXT,
    staff_id UUID REFERENCES staff(id),
    -- Family Visits
    visitor_name TEXT,
    visitor_relation TEXT,
    visitor_phone TEXT,
    status TEXT DEFAULT 'completed' CHECK (
        status IN ('scheduled', 'completed', 'cancelled', 'no_show')
    ),
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.5 Rehabilitation Plans
CREATE TABLE rehabilitation_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    plan_type TEXT CHECK (
        plan_type IN (
            'iep',
            'behavioral',
            'vocational',
            'social',
            'medical'
        )
    ),
    start_date DATE NOT NULL,
    target_date DATE,
    status TEXT DEFAULT 'active' CHECK (
        status IN ('draft', 'active', 'completed', 'suspended')
    ),
    -- Goals Structure
    goals JSONB,
    -- Team
    team_members JSONB,
    review_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
-- 2.6 Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (
        alert_type IN (
            'medical_emergency',
            'behavioral',
            'medication_due',
            'appointment',
            'family_concern',
            'safety',
            'quality',
            'compliance'
        )
    ),
    severity TEXT NOT NULL CHECK (
        severity IN ('low', 'medium', 'high', 'critical')
    ),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'open' CHECK (
        status IN (
            'open',
            'acknowledged',
            'in_progress',
            'resolved',
            'escalated'
        )
    ),
    -- Escalation
    escalation_level INTEGER DEFAULT 1,
    escalated_at TIMESTAMP,
    escalated_to UUID REFERENCES staff(id),
    -- Resolution
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES staff(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
-- 2.7 Catering (Meals)
CREATE TABLE meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type TEXT NOT NULL CHECK (
        meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')
    ),
    meal_name TEXT NOT NULL,
    description TEXT,
    calories INTEGER,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'served', 'cancelled')),
    served_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.8 Catering (Violations)
CREATE TABLE catering_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (
        severity IN ('low', 'medium', 'high', 'critical')
    ),
    description TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    reported_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'investigating', 'resolved', 'escalated')
    ),
    resolved_at TIMESTAMP,
    resolution_notes TEXT
);
-- 2.9 Catering (Quality Checks)
CREATE TABLE quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('morning', 'evening', 'night')),
    inspector_name TEXT,
    checklist JSONB NOT NULL,
    score INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.10 Wisdom Institutional Memory
CREATE TABLE wisdom_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    source TEXT,
    source_role TEXT,
    context TEXT,
    category TEXT CHECK (
        category IN (
            'crisis',
            'staffing',
            'ramadan',
            'operations',
            'quality',
            'families',
            'general'
        )
    ),
    tags TEXT [],
    useful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.11 Conscience Log
CREATE TABLE conscience_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id),
    proposed_action TEXT NOT NULL,
    action_type TEXT NOT NULL,
    ethical_score INTEGER NOT NULL,
    dignity_impact TEXT CHECK (
        dignity_impact IN ('positive', 'neutral', 'negative')
    ),
    autonomy_impact TEXT CHECK (
        autonomy_impact IN ('preserved', 'limited', 'violated')
    ),
    requires_human_approval BOOLEAN DEFAULT false,
    alternatives JSONB,
    decision TEXT CHECK (
        decision IN (
            'approved',
            'modified',
            'rejected',
            'escalated',
            'auto_approved'
        )
    ),
    final_action TEXT,
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
-- 2.12 Activity Log
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    performed_by TEXT,
    performed_at TIMESTAMP DEFAULT NOW()
);
-- ========================================
-- 3. ROW LEVEL SECURITY (RLS) - PUBLIC ACCESS FOR DEMO
-- ========================================
-- Enable RLS on all tables
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE rehabilitation_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE wisdom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE conscience_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
-- Create Schema "public" READ policy for all tables
DO $$
DECLARE tbl text;
BEGIN FOR tbl IN
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public' LOOP EXECUTE format(
        'DROP POLICY IF EXISTS "public_read_%I" ON %I',
        tbl,
        tbl
    );
EXECUTE format(
    'CREATE POLICY "public_read_%I" ON %I FOR SELECT USING (true)',
    tbl,
    tbl
);
-- WARNING: WRITE POLICY FOR DEMO (Allow anyone to write)
EXECUTE format(
    'DROP POLICY IF EXISTS "public_write_%I" ON %I',
    tbl,
    tbl
);
EXECUTE format(
    'CREATE POLICY "public_write_%I" ON %I FOR ALL USING (true) WITH CHECK (true)',
    tbl,
    tbl
);
END LOOP;
END $$;
-- ========================================
-- 4. SEED DATA (MOCK DATA)
-- ========================================
-- 4.1 Staff
INSERT INTO staff (
        employee_id,
        full_name,
        job_title,
        department,
        role,
        email,
        phone,
        hire_date,
        status
    )
VALUES (
        'EMP-001',
        'أحمد محمد الشهري',
        'مدير المركز',
        'الإدارة',
        'director',
        'director@demo.basira.app',
        '0555000001',
        '2015-03-15',
        'active'
    ),
    (
        'EMP-002',
        'فاطمة علي القحطاني',
        'مديرة الخدمات الاجتماعية',
        'الخدمات الاجتماعية',
        'supervisor',
        'social@demo.basira.app',
        '0555000002',
        '2016-07-01',
        'active'
    ),
    (
        'EMP-003',
        'خالد سعد الغامدي',
        'مدير الخدمات الطبية',
        'الخدمات الطبية',
        'supervisor',
        'medical@demo.basira.app',
        '0555000003',
        '2017-01-10',
        'active'
    ),
    (
        'EMP-004',
        'نورة عبدالله الزهراني',
        'ممرضة أولى',
        'الخدمات الطبية',
        'specialist',
        'nurse1@demo.basira.app',
        '0555000004',
        '2018-03-20',
        'active'
    ),
    (
        'EMP-005',
        'محمد حسن العمري',
        'معالج طبيعي',
        'الخدمات الطبية',
        'specialist',
        'pt@demo.basira.app',
        '0555000005',
        '2019-06-15',
        'active'
    ),
    (
        'EMP-010',
        'يوسف أحمد المالكي',
        'مشرف الإعاشة',
        'الخدمات المساندة',
        'supervisor',
        'catering@demo.basira.app',
        '0555000010',
        '2017-04-01',
        'active'
    ),
    (
        'EMP-015',
        'ريم عبدالله الجعيد',
        'منسقة الجودة',
        'الجودة',
        'specialist',
        'quality@demo.basira.app',
        '0555000015',
        '2021-06-01',
        'active'
    );
-- 4.2 Beneficiaries (Rich Data subset)
INSERT INTO beneficiaries (
        file_number,
        national_id,
        full_name,
        gender,
        birth_date,
        nationality,
        disability_type,
        disability_degree,
        mobility_status,
        admission_date,
        admission_type,
        building,
        room_number,
        bed_number,
        status,
        guardian_name,
        guardian_phone,
        guardian_relation,
        notes,
        tags
    )
VALUES (
        'RC-2024-041',
        '1088888903',
        'محمد علي الشهري',
        'male',
        '1994-02-14',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2019-05-01',
        'permanent',
        'أ',
        '106',
        '1',
        'active',
        'علي الشهري',
        '0555111041',
        'أب',
        '⚠️ سيناريو: تنبيه سلوكي نشط',
        ARRAY ['سيناريو', 'تنبيه سلوكي']
    ),
    (
        'RC-2024-042',
        '2088888899',
        'هيفاء عبدالرحمن الأسمري',
        'female',
        '1996-08-30',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-02-15',
        'permanent',
        'ج',
        '305',
        '2',
        'active',
        'عبدالرحمن الأسمري',
        '0555111042',
        'أب',
        '⚠️ سيناريو: موعد طبي قادم',
        ARRAY ['سيناريو', 'موعد طبي']
    ),
    (
        'RC-2024-043',
        '1088888904',
        'سامي خالد البيشي',
        'male',
        '1990-04-12',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2018-07-01',
        'permanent',
        'أ',
        '106',
        '2',
        'active',
        'خالد البيشي',
        '0555111043',
        'أب',
        '⭐ سيناريو: مرشح للتأهيل المجتمعي',
        ARRAY ['سيناريو', 'تخريج', 'ناجح']
    ),
    (
        'RC-2024-044',
        '2088888900',
        'رنا سالم الغامدي',
        'female',
        '1998-11-25',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2021-04-01',
        'permanent',
        'ج',
        '306',
        '1',
        'active',
        'سالم الغامدي',
        '0555111044',
        'أب',
        '👨👩👧 سيناريو: زيارة عائلية مجدولة',
        ARRAY ['سيناريو', 'زيارة عائلية']
    ),
    (
        'RC-2024-047',
        '1088888906',
        'ياسر عبدالله الثقفي',
        'male',
        '1989-09-22',
        'سعودي',
        'متعددة',
        'severe',
        'wheelchair',
        '2015-01-10',
        'permanent',
        'ب',
        '206',
        '1',
        'active',
        'عبدالله الثقفي',
        '0555111047',
        'أب',
        '🚨 سيناريو: حالة طوارئ طبية',
        ARRAY ['سيناريو', 'طوارئ', 'حرج']
    ),
    (
        'RC-2024-050',
        '2088888903',
        'عزيزة حمد الحربي',
        'female',
        '1994-07-14',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-12-01',
        'permanent',
        'ج',
        '307',
        '1',
        'active',
        'حمد الحربي',
        '0555111050',
        'أب',
        '🤖 سيناريو: قرار آلي يحتاج مراجعة الضمير',
        ARRAY ['سيناريو', 'ضمير', 'مراجعة أخلاقية']
    );
-- 4.3 Alerts
INSERT INTO alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        status,
        escalation_level,
        created_at
    )
SELECT id,
    'behavioral',
    'medium',
    'سلوك عدواني متكرر',
    'لوحظ سلوك عدواني تجاه الزملاء في الأسبوع الماضي (3 حوادث). يُنصح بمراجعة الأخصائي النفسي.',
    'open',
    1,
    NOW() - INTERVAL '3 days'
FROM beneficiaries
WHERE file_number = 'RC-2024-041';
INSERT INTO alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        status,
        created_at
    )
SELECT id,
    'appointment',
    'low',
    'موعد طبي قادم',
    'موعد مع طبيب الأعصاب في مستشفى الملك فهد - الثلاثاء القادم الساعة 10 صباحاً',
    'open',
    NOW() - INTERVAL '1 day'
FROM beneficiaries
WHERE file_number = 'RC-2024-042';
INSERT INTO alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        status,
        escalation_level,
        created_at
    )
SELECT id,
    'medical_emergency',
    'critical',
    '⚠️ حالة طوارئ طبية',
    'ارتفاع في درجة الحرارة مع صعوبة في التنفس. تم استدعاء الطبيب المناوب.',
    'in_progress',
    3,
    NOW() - INTERVAL '2 hours'
FROM beneficiaries
WHERE file_number = 'RC-2024-047';
INSERT INTO alerts (
        beneficiary_id,
        alert_type,
        severity,
        title,
        description,
        status,
        created_at
    )
SELECT id,
    'behavioral',
    'high',
    '🤖 قرار آلي معلق',
    'النظام يقترح عزل المستفيدة مؤقتاً بسبب سلوك متكرر. يحتاج مراجعة طبقة الضمير قبل التنفيذ.',
    'open',
    NOW() - INTERVAL '6 hours'
FROM beneficiaries
WHERE file_number = 'RC-2024-050';
-- 4.4 Catering
INSERT INTO meals (
        meal_type,
        meal_name,
        description,
        calories,
        scheduled_date,
        scheduled_time,
        status,
        served_count
    )
VALUES (
        'breakfast',
        'فول بالزيت والخبز',
        'فول مدمس مع زيت زيتون وخبز عربي وخضار',
        450,
        CURRENT_DATE,
        '07:00',
        'served',
        47
    ),
    (
        'lunch',
        'كبسة دجاج',
        'أرز بالدجاج والبهارات السعودية مع سلطة',
        650,
        CURRENT_DATE,
        '12:30',
        'scheduled',
        0
    ),
    (
        'dinner',
        'شوربة خضار مع خبز',
        'شوربة خضار طازجة مع خبز عربي',
        300,
        CURRENT_DATE,
        '18:00',
        'scheduled',
        0
    ),
    (
        'snack',
        'فواكه موسمية',
        'تفاح وموز وبرتقال',
        150,
        CURRENT_DATE,
        '15:00',
        'scheduled',
        0
    );
INSERT INTO quality_checks (
        check_date,
        shift,
        inspector_name,
        checklist,
        score,
        notes
    )
VALUES (
        CURRENT_DATE - 1,
        'morning',
        'يوسف المالكي',
        '[
  {"item": "نظافة المطبخ", "passed": true},
  {"item": "درجة حرارة الثلاجات", "passed": false},
  {"item": "نظافة أدوات الطبخ", "passed": true},
  {"item": "ارتداء الزي الموحد", "passed": true},
  {"item": "غسل اليدين", "passed": true},
  {"item": "فصل الأطعمة النيئة", "passed": true},
  {"item": "تاريخ الصلاحية", "passed": true},
  {"item": "نظافة صالة الطعام", "passed": true}
]'::jsonb,
        87,
        'يجب معالجة مشكلة الثلاجة فوراً'
    );
-- 4.5 Wisdom
INSERT INTO wisdom_entries (
        question,
        answer,
        source,
        source_role,
        context,
        category,
        tags,
        useful_count
    )
VALUES (
        'كيف نتعامل مع نقص الكوادر في رمضان؟',
        'في رمضان 2019، واجهنا نقصاً حاداً في الكوادر. الحل كان: 1) تقسيم الورديات لفترات أقصر (6 ساعات بدلاً من 8)، 2) إشراك المتطوعين من الجمعيات الخيرية للأنشطة غير الطبية، 3) تأجيل الإجازات غير الضرورية مع تعويض مالي. المهم: لا تضحي بجودة الرعاية - قلل الأنشطة الثانوية أولاً.',
        'المدير السابق رحمه الله',
        'مدير المركز',
        'رمضان 2019 - نقص 40% من الكوادر',
        'staffing',
        ARRAY ['رمضان', 'نقص كوادر', 'تطوع', 'ورديات'],
        24
    ),
    (
        'كيف نتعامل مع إفلاس شركة الإعاشة؟',
        'عندما أفلست شركة الإعاشة فجأة في 2018، اتخذنا إجراءات طوارئ: 1) تواصل فوري مع المطاعم المحلية لعقود مؤقتة، 2) طلب دعم من فرع الوزارة لتسريع التعاقد البديل، 3) إشراك أسر المستفيدين في توفير وجبات مؤقتة مع تعويض رمزي. الدرس: دائماً احتفظ بقائمة موردين بديلين.',
        'مدير الخدمات المساندة',
        'مدير قسم',
        'أزمة إفلاس شركة الإعاشة 2018',
        'crisis',
        ARRAY ['إعاشة', 'أزمة', 'موردين', 'طوارئ'],
        18
    );
-- 4.6 Conscience Log (Example)
INSERT INTO conscience_log (
        beneficiary_id,
        proposed_action,
        action_type,
        ethical_score,
        dignity_impact,
        autonomy_impact,
        requires_human_approval,
        alternatives,
        decision,
        final_action,
        context,
        created_at
    )
SELECT b.id,
    'عزل المستفيد في غرفة منفصلة بسبب سلوك عدواني',
    'isolation',
    45,
    'negative',
    'violated',
    true,
    '["مراقبة مكثفة", "جلسة تهدئة مع الأخصائي", "تعيين مرافق شخصي"]'::jsonb,
    'modified',
    'تم اختيار المراقبة المكثفة مع جلسة تهدئة بدلاً من العزل',
    '{"isRamadan": false, "isNight": false, "hasFamily": true}'::jsonb,
    NOW() - INTERVAL '2 weeks'
FROM beneficiaries b
WHERE file_number = 'RC-2024-041';