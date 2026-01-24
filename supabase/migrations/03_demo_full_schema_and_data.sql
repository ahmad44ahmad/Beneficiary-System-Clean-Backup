-- ========================================
-- BASIRA DEMO ENVIRONMENT - FULL SCHEMA & SEED (PART 1)
-- ========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
-- 1. CLEANUP
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
-- 2. SCHEMA
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_number TEXT UNIQUE NOT NULL,
    national_id TEXT,
    full_name TEXT NOT NULL,
    full_name_en TEXT,
    gender TEXT CHECK (gender IN ('male', 'female')),
    birth_date DATE,
    age INTEGER GENERATED ALWAYS AS (
        EXTRACT(
            YEAR
            FROM AGE(COALESCE(birth_date, CURRENT_DATE))
        )
    ) STORED,
    nationality TEXT DEFAULT 'سعودي',
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
    admission_date DATE,
    admission_type TEXT CHECK (
        admission_type IN ('permanent', 'temporary', 'daycare')
    ),
    building TEXT,
    room_number TEXT,
    bed_number TEXT,
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'discharged',
            'transferred',
            'deceased',
            'on_leave'
        )
    ),
    guardian_name TEXT,
    guardian_phone TEXT,
    guardian_relation TEXT,
    emergency_contact TEXT,
    photo_url TEXT,
    notes TEXT,
    tags TEXT [],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
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
    diagnosis_code TEXT,
    diagnosis_name TEXT,
    diagnosis_date DATE,
    diagnosing_doctor TEXT,
    medication_name TEXT,
    dosage TEXT,
    frequency TEXT,
    start_date DATE,
    end_date DATE,
    prescribing_doctor TEXT,
    vital_type TEXT,
    vital_value TEXT,
    vital_unit TEXT,
    measured_at TIMESTAMP,
    measured_by UUID REFERENCES staff(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
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
    visitor_name TEXT,
    visitor_relation TEXT,
    visitor_phone TEXT,
    status TEXT DEFAULT 'completed' CHECK (
        status IN ('scheduled', 'completed', 'cancelled', 'no_show')
    ),
    created_at TIMESTAMP DEFAULT NOW()
);
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
    goals JSONB,
    team_members JSONB,
    review_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
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
    escalation_level INTEGER DEFAULT 1,
    escalated_at TIMESTAMP,
    escalated_to UUID REFERENCES staff(id),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES staff(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES staff(id)
);
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
        decision IN ('approved', 'modified', 'rejected', 'escalated')
    ),
    final_action TEXT,
    context JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
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
-- 3. RLS
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
CREATE POLICY "public_read_b" ON beneficiaries FOR
SELECT USING (true);
CREATE POLICY "public_read_s" ON staff FOR
SELECT USING (true);
CREATE POLICY "public_read_m" ON medical_records FOR
SELECT USING (true);
CREATE POLICY "public_read_ss" ON social_services FOR
SELECT USING (true);
CREATE POLICY "public_read_r" ON rehabilitation_plans FOR
SELECT USING (true);
CREATE POLICY "public_read_a" ON alerts FOR
SELECT USING (true);
CREATE POLICY "public_read_ml" ON meals FOR
SELECT USING (true);
CREATE POLICY "public_read_cv" ON catering_violations FOR
SELECT USING (true);
CREATE POLICY "public_read_qc" ON quality_checks FOR
SELECT USING (true);
CREATE POLICY "public_read_w" ON wisdom_entries FOR
SELECT USING (true);
CREATE POLICY "public_read_c" ON conscience_log FOR
SELECT USING (true);
CREATE POLICY "public_read_al" ON activity_log FOR
SELECT USING (true);
-- Indexes
CREATE INDEX idx_beneficiaries_status ON beneficiaries(status);
CREATE INDEX idx_beneficiaries_file_number ON beneficiaries(file_number);
CREATE INDEX idx_medical_records_beneficiary ON medical_records(beneficiary_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_meals_date ON meals(scheduled_date);
-- 4. SEED - STAFF
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
        'EMP-006',
        'سارة خالد الأسمري',
        'أخصائية تغذية',
        'الخدمات الطبية',
        'specialist',
        'nutrition@demo.basira.app',
        '0555000006',
        '2020-01-01',
        'active'
    ),
    (
        'EMP-007',
        'عبدالرحمن محمد الشمراني',
        'أخصائي اجتماعي',
        'الخدمات الاجتماعية',
        'specialist',
        'social1@demo.basira.app',
        '0555000007',
        '2018-09-01',
        'active'
    ),
    (
        'EMP-008',
        'هند سعيد الحربي',
        'أخصائية نفسية',
        'الخدمات الاجتماعية',
        'specialist',
        'psych@demo.basira.app',
        '0555000008',
        '2019-02-15',
        'active'
    ),
    (
        'EMP-009',
        'ماجد علي البيشي',
        'مدرب تأهيل مهني',
        'الخدمات الاجتماعية',
        'specialist',
        'vocational@demo.basira.app',
        '0555000009',
        '2020-07-01',
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
        'EMP-011',
        'منيرة حمد الدوسري',
        'مشرفة النظافة',
        'الخدمات المساندة',
        'staff',
        'cleaning@demo.basira.app',
        '0555000011',
        '2018-01-15',
        'active'
    ),
    (
        'EMP-012',
        'سلطان فهد الأحمري',
        'مشرف رعاية - وردية صباحية',
        'الرعاية',
        'staff',
        'care1@demo.basira.app',
        '0555000012',
        '2019-03-01',
        'active'
    ),
    (
        'EMP-013',
        'عائشة محمد الثقفي',
        'مشرفة رعاية - وردية مسائية',
        'الرعاية',
        'staff',
        'care2@demo.basira.app',
        '0555000013',
        '2019-03-01',
        'active'
    ),
    (
        'EMP-014',
        'بندر سالم الشيباني',
        'مشرف رعاية - وردية ليلية',
        'الرعاية',
        'staff',
        'care3@demo.basira.app',
        '0555000014',
        '2020-01-01',
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
-- 4. SEED - BENEFICIARIES (PART 1)
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
        'RC-2024-001',
        '1088888881',
        'عبدالله محمد الشهري',
        'male',
        '1995-03-15',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-01-15',
        'permanent',
        'أ',
        '101',
        '1',
        'active',
        'محمد الشهري',
        '0555111001',
        'أب',
        'يحب الرسم والأنشطة الفنية',
        ARRAY ['فني', 'اجتماعي', 'مستقل']
    ),
    (
        'RC-2024-002',
        '1088888882',
        'فهد سعد القحطاني',
        'male',
        '1998-07-22',
        'سعودي',
        'ذهنية',
        'severe',
        'assisted',
        '2019-06-01',
        'permanent',
        'أ',
        '101',
        '2',
        'active',
        'سعد القحطاني',
        '0555111002',
        'أب',
        'يحتاج مساعدة في الأنشطة اليومية',
        ARRAY ['رعاية مكثفة', 'علاج طبيعي']
    ),
    (
        'RC-2024-003',
        '1088888883',
        'سلمان خالد الغامدي',
        'male',
        '1990-11-08',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2018-03-20',
        'permanent',
        'أ',
        '102',
        '1',
        'active',
        'خالد الغامدي',
        '0555111003',
        'أب',
        'ماهر في الأعمال اليدوية',
        ARRAY ['تأهيل مهني', 'مستقل']
    ),
    (
        'RC-2024-004',
        '1088888884',
        'تركي عبدالرحمن الزهراني',
        'male',
        '2000-02-14',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2021-09-01',
        'permanent',
        'أ',
        '102',
        '2',
        'active',
        'عبدالرحمن الزهراني',
        '0555111004',
        'أب',
        'مرشح للتأهيل المجتمعي',
        ARRAY ['تأهيل مجتمعي', 'واعد']
    ),
    (
        'RC-2024-005',
        '1088888885',
        'نواف حمد العتيبي',
        'male',
        '1992-05-30',
        'سعودي',
        'ذهنية',
        'moderate',
        'assisted',
        '2017-11-15',
        'permanent',
        'أ',
        '103',
        '1',
        'active',
        'حمد العتيبي',
        '0555111005',
        'أب',
        'يعاني من نوبات صرع متحكم بها',
        ARRAY ['صرع', 'متابعة طبية']
    ),
    (
        'RC-2024-006',
        '1088888886',
        'ماجد سالم الحربي',
        'male',
        '1988-09-12',
        'سعودي',
        'ذهنية',
        'severe',
        'wheelchair',
        '2015-04-01',
        'permanent',
        'ب',
        '201',
        '1',
        'active',
        'سالم الحربي',
        '0555111006',
        'أب',
        'يحتاج كرسي متحرك ورعاية شاملة',
        ARRAY ['كرسي متحرك', 'رعاية شاملة']
    ),
    (
        'RC-2024-007',
        '1088888887',
        'بدر فيصل الدوسري',
        'male',
        '1996-12-25',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-08-10',
        'permanent',
        'أ',
        '103',
        '2',
        'active',
        'فيصل الدوسري',
        '0555111007',
        'أب',
        'يحب الرياضة وكرة القدم',
        ARRAY ['رياضي', 'اجتماعي']
    ),
    (
        'RC-2024-008',
        '1088888888',
        'عمر ناصر الأحمري',
        'male',
        '1993-04-18',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2019-02-28',
        'permanent',
        'أ',
        '104',
        '1',
        'active',
        'ناصر الأحمري',
        '0555111008',
        'أب',
        'مهارات تواصل جيدة',
        ARRAY ['تواصل', 'اجتماعي']
    ),
    (
        'RC-2024-009',
        '1088888889',
        'سعود محمد المالكي',
        'male',
        '1999-08-05',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2022-01-15',
        'permanent',
        'أ',
        '104',
        '2',
        'active',
        'محمد المالكي',
        '0555111009',
        'أب',
        'التحق حديثاً ببرنامج التأهيل',
        ARRAY ['جديد', 'تأهيل مهني']
    ),
    (
        'RC-2024-010',
        '1088888890',
        'خالد علي الشمراني',
        'male',
        '1991-01-20',
        'سعودي',
        'ذهنية',
        'profound',
        'bedridden',
        '2014-07-01',
        'permanent',
        'ب',
        '201',
        '2',
        'active',
        'علي الشمراني',
        '0555111010',
        'أب',
        'يحتاج رعاية طبية مستمرة',
        ARRAY ['طريح الفراش', 'رعاية طبية']
    ),
    (
        'RC-2024-011',
        '2088888881',
        'نورة أحمد العسيري',
        'female',
        '1997-06-10',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-03-01',
        'permanent',
        'ج',
        '301',
        '1',
        'active',
        'أحمد العسيري',
        '0555111011',
        'أب',
        'ماهرة في الأشغال اليدوية',
        ARRAY ['فني', 'مستقلة']
    ),
    (
        'RC-2024-012',
        '2088888882',
        'سارة سعيد البيشي',
        'female',
        '1994-10-28',
        'سعودي',
        'ذهنية',
        'severe',
        'assisted',
        '2018-06-15',
        'permanent',
        'ج',
        '301',
        '2',
        'active',
        'سعيد البيشي',
        '0555111012',
        'أب',
        'تحتاج إشراف مستمر',
        ARRAY ['إشراف', 'رعاية']
    ),
    (
        'RC-2024-013',
        '2088888883',
        'منيرة خالد الثقفي',
        'female',
        '2001-03-05',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2022-09-01',
        'permanent',
        'ج',
        '302',
        '1',
        'active',
        'خالد الثقفي',
        '0555111013',
        'أب',
        'في برنامج التأهيل المجتمعي',
        ARRAY ['تأهيل مجتمعي', 'واعدة']
    ),
    (
        'RC-2024-014',
        '2088888884',
        'هند محمد الجعيد',
        'female',
        '1989-12-15',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2016-01-10',
        'permanent',
        'ج',
        '302',
        '2',
        'active',
        'محمد الجعيد',
        '0555111014',
        'أب',
        'تحب الطبخ والأنشطة المنزلية',
        ARRAY ['مهارات منزلية', 'اجتماعية']
    ),
    (
        'RC-2024-015',
        '2088888885',
        'فاطمة علي الشيباني',
        'female',
        '1996-07-22',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2019-11-01',
        'permanent',
        'ج',
        '303',
        '1',
        'active',
        'علي الشيباني',
        '0555111015',
        'أب',
        'مهارات فنية مميزة',
        ARRAY ['فني', 'مبدعة']
    ),
    (
        'RC-2024-016',
        '2088888886',
        'عائشة سالم القرني',
        'female',
        '1993-04-08',
        'سعودي',
        'ذهنية',
        'severe',
        'wheelchair',
        '2017-05-20',
        'permanent',
        'د',
        '401',
        '1',
        'active',
        'سالم القرني',
        '0555111016',
        'أب',
        'تحتاج كرسي متحرك',
        ARRAY ['كرسي متحرك', 'رعاية']
    ),
    (
        'RC-2024-017',
        '2088888887',
        'ريم عبدالله الأسمري',
        'female',
        '1998-09-30',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2021-02-15',
        'permanent',
        'ج',
        '303',
        '2',
        'active',
        'عبدالله الأسمري',
        '0555111017',
        'أب',
        'تشارك في الأنشطة الرياضية',
        ARRAY ['رياضية', 'نشيطة']
    ),
    (
        'RC-2024-018',
        '2088888888',
        'لمياء حسن الغامدي',
        'female',
        '1990-11-12',
        'سعودي',
        'ذهنية',
        'profound',
        'bedridden',
        '2013-08-01',
        'permanent',
        'د',
        '401',
        '2',
        'active',
        'حسن الغامدي',
        '0555111018',
        'أب',
        'رعاية طبية مكثفة',
        ARRAY ['طريحة الفراش', 'رعاية طبية']
    ),
    (
        'RC-2024-019',
        '2088888889',
        'أمل فهد الزهراني',
        'female',
        '2002-01-25',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2023-03-01',
        'permanent',
        'ج',
        '304',
        '1',
        'active',
        'فهد الزهراني',
        '0555111019',
        'أب',
        'حديثة الالتحاق',
        ARRAY ['جديدة', 'واعدة']
    ),
    (
        'RC-2024-020',
        '2088888890',
        'شيماء ناصر الحربي',
        'female',
        '1995-05-18',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2020-07-01',
        'permanent',
        'ج',
        '304',
        '2',
        'active',
        'ناصر الحربي',
        '0555111020',
        'أب',
        'تحب القراءة والقصص',
        ARRAY ['ثقافية', 'هادئة']
    );INSERT INTO beneficiaries (
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
        'RC-2024-021',
        '1088888891',
        'يوسف سعد العمري',
        'male',
        '1985-08-14',
        'سعودي',
        'حركية',
        'severe',
        'wheelchair',
        '2012-03-01',
        'permanent',
        'ب',
        '202',
        '1',
        'active',
        'سعد العمري',
        '0555111021',
        'أب',
        'إصابة حادث - شلل سفلي',
        ARRAY ['شلل سفلي', 'كرسي متحرك']
    ),
    (
        'RC-2024-022',
        '1088888892',
        'فواز محمد الدوسري',
        'male',
        '1992-02-28',
        'سعودي',
        'حركية',
        'moderate',
        'assisted',
        '2019-09-15',
        'permanent',
        'ب',
        '202',
        '2',
        'active',
        'محمد الدوسري',
        '0555111022',
        'أب',
        'يستخدم عكازات',
        ARRAY ['عكازات', 'شبه مستقل']
    ),
    (
        'RC-2024-023',
        '1088888893',
        'عادل خالد الأحمري',
        'male',
        '1988-06-05',
        'سعودي',
        'حركية',
        'severe',
        'wheelchair',
        '2016-12-01',
        'permanent',
        'ب',
        '203',
        '1',
        'active',
        'خالد الأحمري',
        '0555111023',
        'أب',
        'ضمور عضلي',
        ARRAY ['ضمور عضلي', 'علاج طبيعي']
    ),
    (
        'RC-2024-024',
        '2088888891',
        'حنان علي القحطاني',
        'female',
        '1990-10-20',
        'سعودي',
        'حركية',
        'moderate',
        'wheelchair',
        '2018-04-10',
        'permanent',
        'د',
        '402',
        '1',
        'active',
        'علي القحطاني',
        '0555111024',
        'أب',
        'شلل دماغي',
        ARRAY ['شلل دماغي', 'علاج طبيعي']
    ),
    (
        'RC-2024-025',
        '2088888892',
        'مها سالم الشهري',
        'female',
        '1995-07-12',
        'سعودي',
        'حركية',
        'severe',
        'bedridden',
        '2017-01-15',
        'permanent',
        'د',
        '402',
        '2',
        'active',
        'سالم الشهري',
        '0555111025',
        'أب',
        'ضمور عضلي شديد',
        ARRAY ['طريحة الفراش', 'رعاية شاملة']
    ),
    (
        'RC-2024-026',
        '1088888894',
        'راشد حمد البيشي',
        'male',
        '1987-04-25',
        'سعودي',
        'متعددة',
        'severe',
        'wheelchair',
        '2014-09-01',
        'permanent',
        'ب',
        '203',
        '2',
        'active',
        'حمد البيشي',
        '0555111026',
        'أب',
        'إعاقة ذهنية وحركية',
        ARRAY ['متعدد', 'رعاية شاملة']
    ),
    (
        'RC-2024-027',
        '1088888895',
        'ناصر فهد الغامدي',
        'male',
        '1994-11-08',
        'سعودي',
        'متعددة',
        'moderate',
        'assisted',
        '2020-05-01',
        'permanent',
        'ب',
        '204',
        '1',
        'active',
        'فهد الغامدي',
        '0555111027',
        'أب',
        'إعاقة سمعية وذهنية',
        ARRAY ['سمعي', 'ذهني', 'لغة إشارة']
    ),
    (
        'RC-2024-028',
        '2088888893',
        'وفاء أحمد الزهراني',
        'female',
        '1991-03-16',
        'سعودي',
        'متعددة',
        'severe',
        'wheelchair',
        '2016-07-20',
        'permanent',
        'د',
        '403',
        '1',
        'active',
        'أحمد الزهراني',
        '0555111028',
        'أب',
        'شلل دماغي مع إعاقة ذهنية',
        ARRAY ['شلل دماغي', 'ذهني', 'رعاية شاملة']
    ),
    (
        'RC-2024-029',
        '2088888894',
        'دلال محمد العتيبي',
        'female',
        '1998-09-02',
        'سعودي',
        'متعددة',
        'moderate',
        'assisted',
        '2021-11-01',
        'permanent',
        'د',
        '403',
        '2',
        'active',
        'محمد العتيبي',
        '0555111029',
        'أب',
        'إعاقة بصرية وذهنية',
        ARRAY ['بصري', 'ذهني']
    ),
    (
        'RC-2024-030',
        '1088888896',
        'مشاري سعود الحربي',
        'male',
        '1986-01-30',
        'سعودي',
        'متعددة',
        'profound',
        'bedridden',
        '2011-02-15',
        'permanent',
        'ب',
        '204',
        '2',
        'active',
        'سعود الحربي',
        '0555111030',
        'أب',
        'حالة معقدة تحتاج رعاية مكثفة',
        ARRAY ['طريح الفراش', 'رعاية مكثفة']
    ),
    (
        'RC-2024-031',
        '1088888897',
        'طلال عبدالله المالكي',
        'male',
        '2005-05-20',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2023-09-01',
        'daycare',
        NULL,
        NULL,
        NULL,
        'active',
        'عبدالله المالكي',
        '0555111031',
        'أب',
        'طالب في برنامج الرعاية النهارية',
        ARRAY ['رعاية نهارية', 'تعليم']
    ),
    (
        'RC-2024-032',
        '1088888898',
        'فيصل ماجد الشمراني',
        'male',
        '2003-08-12',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2022-09-01',
        'daycare',
        NULL,
        NULL,
        NULL,
        'active',
        'ماجد الشمراني',
        '0555111032',
        'أب',
        'تدريب مهني صباحي',
        ARRAY ['رعاية نهارية', 'تأهيل مهني']
    ),
    (
        'RC-2024-033',
        '2088888895',
        'غادة سلطان العسيري',
        'female',
        '2004-02-28',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2023-09-01',
        'daycare',
        NULL,
        NULL,
        NULL,
        'active',
        'سلطان العسيري',
        '0555111033',
        'أب',
        'برنامج المهارات الحياتية',
        ARRAY ['رعاية نهارية', 'مهارات حياتية']
    ),
    (
        'RC-2024-034',
        '2088888896',
        'نوف خالد الدوسري',
        'female',
        '2006-11-15',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2024-01-15',
        'daycare',
        NULL,
        NULL,
        NULL,
        'active',
        'خالد الدوسري',
        '0555111034',
        'أب',
        'طالبة جديدة',
        ARRAY ['رعاية نهارية', 'جديدة']
    ),
    (
        'RC-2024-035',
        '1088888899',
        'عبدالعزيز ناصر الأحمري',
        'male',
        '2002-04-08',
        'سعودي',
        'حركية',
        'moderate',
        'wheelchair',
        '2021-09-01',
        'daycare',
        NULL,
        NULL,
        NULL,
        'active',
        'ناصر الأحمري',
        '0555111035',
        'أب',
        'برنامج العلاج الطبيعي',
        ARRAY ['رعاية نهارية', 'علاج طبيعي']
    ),
    (
        'RC-2024-036',
        '1088888900',
        'حمد فواز الشهري',
        'male',
        '1995-07-10',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2024-12-01',
        'temporary',
        'أ',
        '105',
        '1',
        'active',
        'فواز الشهري',
        '0555111036',
        'أب',
        'إقامة مؤقتة - 3 أشهر',
        ARRAY ['مؤقت', 'تقييم']
    ),
    (
        'RC-2024-037',
        '2088888897',
        'لطيفة بندر القحطاني',
        'female',
        '1999-03-22',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2024-11-15',
        'temporary',
        'ج',
        '305',
        '1',
        'active',
        'بندر القحطاني',
        '0555111037',
        'أب',
        'برنامج تأهيلي قصير',
        ARRAY ['مؤقت', 'تأهيل']
    ),
    (
        'RC-2024-038',
        '1088888901',
        'سلمان يوسف الغامدي',
        'male',
        '1993-09-05',
        'سعودي',
        'حركية',
        'moderate',
        'assisted',
        '2024-12-10',
        'temporary',
        'ب',
        '205',
        '1',
        'active',
        'يوسف الغامدي',
        '0555111038',
        'أب',
        'تأهيل بعد عملية',
        ARRAY ['مؤقت', 'ما بعد العملية']
    ),
    (
        'RC-2024-039',
        '2088888898',
        'سمية حسن الزهراني',
        'female',
        '1997-12-18',
        'سعودي',
        'متعددة',
        'moderate',
        'wheelchair',
        '2024-10-01',
        'temporary',
        'د',
        '404',
        '1',
        'active',
        'حسن الزهراني',
        '0555111039',
        'أب',
        'إقامة للراحة الأسرية',
        ARRAY ['مؤقت', 'راحة أسرية']
    ),
    (
        'RC-2024-040',
        '1088888902',
        'عبدالمجيد سعد الحربي',
        'male',
        '1991-06-25',
        'سعودي',
        'ذهنية',
        'severe',
        'assisted',
        '2024-11-01',
        'temporary',
        'أ',
        '105',
        '2',
        'active',
        'سعد الحربي',
        '0555111040',
        'أب',
        'تقييم شامل',
        ARRAY ['مؤقت', 'تقييم']
    ),
    (
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
        'RC-2024-045',
        '1088888905',
        'تميم فهد الدوسري',
        'male',
        '1992-06-08',
        'سعودي',
        'ذهنية',
        'severe',
        'assisted',
        '2017-09-15',
        'permanent',
        'ب',
        '205',
        '2',
        'active',
        'فهد الدوسري',
        '0555111045',
        'أب',
        '💊 سيناريو: تعديل دواء مطلوب',
        ARRAY ['سيناريو', 'دواء', 'متابعة طبية']
    ),
    (
        'RC-2024-046',
        '2088888901',
        'بشرى ماجد العتيبي',
        'female',
        '1995-01-18',
        'سعودي',
        'حركية',
        'moderate',
        'wheelchair',
        '2020-10-01',
        'permanent',
        'د',
        '404',
        '2',
        'active',
        'ماجد العتيبي',
        '0555111046',
        'أب',
        '🏃 سيناريو: تقدم في العلاج الطبيعي',
        ARRAY ['سيناريو', 'علاج طبيعي', 'تحسن']
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
        'RC-2024-048',
        '2088888902',
        'سحر محمد الشمراني',
        'female',
        '1997-05-05',
        'سعودي',
        'ذهنية',
        'simple',
        'independent',
        '2022-06-01',
        'permanent',
        'ج',
        '306',
        '2',
        'active',
        'محمد الشمراني',
        '0555111048',
        'أب',
        '📋 سيناريو: مراجعة خطة تأهيل',
        ARRAY ['سيناريو', 'خطة تأهيل']
    ),
    (
        'RC-2024-049',
        '1088888907',
        'وليد سعود الأحمري',
        'male',
        '1993-12-30',
        'سعودي',
        'ذهنية',
        'moderate',
        'independent',
        '2019-08-20',
        'permanent',
        'أ',
        '107',
        '1',
        'active',
        'سعود الأحمري',
        '0555111049',
        'أب',
        '🔔 سيناريو: تنبيه متصاعد (30+ يوم)',
        ARRAY ['سيناريو', 'تنبيه متصاعد', 'متأخر']
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
-- 4.3 MEDICAL RECORDS
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        diagnosis_code,
        diagnosis_name,
        diagnosis_date,
        diagnosing_doctor
    )
SELECT id,
    'diagnosis',
    'F70',
    'إعاقة ذهنية خفيفة',
    admission_date,
    'د. خالد الغامدي'
FROM beneficiaries
WHERE disability_type = 'ذهنية'
    AND disability_degree = 'simple';
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        diagnosis_code,
        diagnosis_name,
        diagnosis_date,
        diagnosing_doctor
    )
SELECT id,
    'diagnosis',
    'F71',
    'إعاقة ذهنية متوسطة',
    admission_date,
    'د. خالد الغامدي'
FROM beneficiaries
WHERE disability_type = 'ذهنية'
    AND disability_degree = 'moderate';
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        diagnosis_code,
        diagnosis_name,
        diagnosis_date,
        diagnosing_doctor
    )
SELECT id,
    'diagnosis',
    'F72',
    'إعاقة ذهنية شديدة',
    admission_date,
    'د. خالد الغامدي'
FROM beneficiaries
WHERE disability_type = 'ذهنية'
    AND disability_degree IN ('severe', 'profound');
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        diagnosis_code,
        diagnosis_name,
        diagnosis_date,
        diagnosing_doctor
    )
SELECT id,
    'diagnosis',
    'G80',
    'شلل دماغي',
    admission_date,
    'د. خالد الغامدي'
FROM beneficiaries
WHERE notes LIKE '%شلل دماغي%';
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        medication_name,
        dosage,
        frequency,
        start_date,
        prescribing_doctor
    )
SELECT id,
    'medication',
    'ديباكين (Depakine)',
    '500mg',
    'مرتين يومياً',
    CURRENT_DATE - INTERVAL '6 months',
    'د. خالد الغامدي'
FROM beneficiaries
WHERE 'صرع' = ANY(tags);
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        medication_name,
        dosage,
        frequency,
        start_date,
        prescribing_doctor
    )
SELECT id,
    'medication',
    'ريسبردال (Risperdal)',
    '2mg',
    'مرة يومياً مساءً',
    CURRENT_DATE - INTERVAL '3 months',
    'د. خالد الغامدي'
FROM beneficiaries
WHERE disability_degree IN ('severe', 'profound')
LIMIT 10;
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        vital_type,
        vital_value,
        vital_unit,
        measured_at
    )
SELECT id,
    'vital_signs',
    'blood_pressure',
    CASE
        WHEN RANDOM() > 0.3 THEN '120/80'
        ELSE (110 + FLOOR(RANDOM() * 30))::TEXT || '/' || (70 + FLOOR(RANDOM() * 20))::TEXT
    END,
    'mmHg',
    NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 7)
FROM beneficiaries
WHERE status = 'active';
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        vital_type,
        vital_value,
        vital_unit,
        measured_at
    )
SELECT id,
    'vital_signs',
    'temperature',
    CASE
        WHEN RANDOM() > 0.1 THEN '36.8'
        ELSE (36 + RANDOM() * 2)::NUMERIC(3, 1)::TEXT
    END,
    '°C',
    NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 3)
FROM beneficiaries
WHERE status = 'active';
INSERT INTO medical_records (
        beneficiary_id,
        record_type,
        vital_type,
        vital_value,
        vital_unit,
        measured_at
    )
SELECT id,
    'vital_signs',
    'weight',
    (50 + FLOOR(RANDOM() * 40))::TEXT,
    'kg',
    NOW() - INTERVAL '1 week'
FROM beneficiaries
WHERE status = 'active';
-- 4.4 SOCIAL SERVICES
INSERT INTO social_services (
        beneficiary_id,
        service_type,
        service_date,
        duration_minutes,
        description,
        visitor_name,
        visitor_relation,
        visitor_phone,
        status
    )
SELECT id,
    'family_visit',
    CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 90),
    60 + FLOOR(RANDOM() * 60),
    'زيارة عائلية روتينية',
    guardian_name,
    guardian_relation,
    guardian_phone,
    'completed'
FROM beneficiaries
WHERE admission_type = 'permanent'
    AND status = 'active'
LIMIT 40;
INSERT INTO social_services (
        beneficiary_id,
        service_type,
        service_date,
        duration_minutes,
        description,
        outcome,
        status
    )
SELECT id,
    'therapy_session',
    CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 30),
    45,
    'جلسة تأهيل نفسي',
    'تقدم ملحوظ في التفاعل الاجتماعي',
    'completed'
FROM beneficiaries
WHERE disability_type = 'ذهنية'
    AND status = 'active'
LIMIT 30;
INSERT INTO social_services (
        beneficiary_id,
        service_type,
        service_date,
        duration_minutes,
        description,
        outcome,
        status
    )
SELECT id,
    'skill_training',
    CURRENT_DATE - INTERVAL '1 day' * FLOOR(RANDOM() * 14),
    120,
    'تدريب على مهارات الطباعة والحاسب',
    'إتقان الأساسيات',
    'completed'
FROM beneficiaries
WHERE 'تأهيل مهني' = ANY(tags)
    OR 'واعد' = ANY(tags)
LIMIT 15;
INSERT INTO social_services (
        beneficiary_id,
        service_type,
        service_date,
        duration_minutes,
        description,
        visitor_name,
        visitor_relation,
        status
    )
SELECT id,
    'family_visit',
    CURRENT_DATE + INTERVAL '2 days',
    90,
    'زيارة عائلية مجدولة - يرجى تجهيز الغرفة',
    guardian_name,
    guardian_relation,
    'scheduled'
FROM beneficiaries
WHERE file_number = 'RC-2024-044';
-- 4.5 ALERTS
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
        created_at
    )
SELECT id,
    'medication_due',
    'high',
    'مراجعة جرعة الدواء مطلوبة',
    'انتهت صلاحية وصفة ديباكين. يجب مراجعة الطبيب لتجديد الوصفة.',
    'open',
    NOW() - INTERVAL '5 days'
FROM beneficiaries
WHERE file_number = 'RC-2024-045';
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
        escalation_level,
        escalated_at,
        created_at
    )
SELECT id,
    'quality',
    'medium',
    'عدم اكتمال خطة التأهيل',
    'لم يتم تحديث خطة التأهيل الفردية منذ 45 يوماً. يجب المراجعة الفورية.',
    'escalated',
    2,
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '35 days'
FROM beneficiaries
WHERE file_number = 'RC-2024-049';
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
-- 4.6 PLANS
INSERT INTO rehabilitation_plans (
        beneficiary_id,
        plan_name,
        plan_type,
        start_date,
        target_date,
        status,
        goals,
        review_date
    )
SELECT id,
    'خطة التأهيل المجتمعي',
    'social',
    CURRENT_DATE - INTERVAL '3 months',
    CURRENT_DATE + INTERVAL '6 months',
    'active',
    '[{"goal": "الاعتماد على النفس في النظافة الشخصية", "target": "100%", "progress": 85, "status": "in_progress"}, {"goal": "التعامل مع النقود", "target": "عمليات بسيطة", "progress": 60, "status": "in_progress"}, {"goal": "استخدام المواصلات العامة", "target": "بمرافق", "progress": 30, "status": "not_started"}]'::jsonb,
    CURRENT_DATE + INTERVAL '1 month'
FROM beneficiaries
WHERE file_number = 'RC-2024-043';
INSERT INTO rehabilitation_plans (
        beneficiary_id,
        plan_name,
        plan_type,
        start_date,
        target_date,
        status,
        goals,
        review_date
    )
SELECT id,
    'خطة التأهيل السلوكي',
    'behavioral',
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '3 months',
    'active',
    '[{"goal": "تقليل نوبات الغضب", "target": "أقل من 2 أسبوعياً", "progress": 40, "status": "at_risk"}, {"goal": "تحسين التفاعل الاجتماعي", "target": "مشاركة في 3 أنشطة", "progress": 70, "status": "in_progress"}]'::jsonb,
    CURRENT_DATE - INTERVAL '15 days'
FROM beneficiaries
WHERE file_number = 'RC-2024-048';
-- 4.7 MEALS
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
    ),
    (
        'breakfast',
        'بيض مسلوق مع جبن',
        'بيضتان مسلوقتان مع جبن أبيض وزيتون',
        380,
        CURRENT_DATE + 1,
        '07:00',
        'scheduled',
        0
    ),
    (
        'lunch',
        'مندي لحم',
        'لحم مندي مع أرز بسمتي',
        700,
        CURRENT_DATE + 1,
        '12:30',
        'scheduled',
        0
    ),
    (
        'dinner',
        'سلطة مع تونا',
        'سلطة خضراء مع تونا وخبز',
        350,
        CURRENT_DATE + 1,
        '18:00',
        'scheduled',
        0
    ),
    (
        'breakfast',
        'فلافل مع حمص',
        'فلافل طازجة مع حمص وخضار',
        420,
        CURRENT_DATE + 2,
        '07:00',
        'scheduled',
        0
    ),
    (
        'lunch',
        'مكرونة بالدجاج',
        'مكرونة بالصوص الأبيض والدجاج',
        550,
        CURRENT_DATE + 2,
        '12:30',
        'scheduled',
        0
    ),
    (
        'dinner',
        'ساندويتش جبن',
        'ساندويتش جبن مع خس وطماطم',
        320,
        CURRENT_DATE + 2,
        '18:00',
        'scheduled',
        0
    );
INSERT INTO catering_violations (
        violation_type,
        severity,
        description,
        location,
        status,
        reported_at
    )
VALUES (
        'نظافة',
        'medium',
        'وجود بقايا طعام على الأرضية بعد وجبة الغداء',
        'صالة الطعام - القسم أ',
        'open',
        NOW() - INTERVAL '1 day'
    ),
    (
        'درجة حرارة',
        'high',
        'ثلاجة حفظ اللحوم أعلى من الحد المسموح (8°C بدلاً من 4°C)',
        'المطبخ الرئيسي',
        'investigating',
        NOW() - INTERVAL '3 days'
    ),
    (
        'نظافة',
        'low',
        'عدم ارتداء القفازات أثناء التقديم',
        'خط التقديم',
        'resolved',
        NOW() - INTERVAL '1 week'
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
        '[{"item": "نظافة المطبخ", "passed": true}, {"item": "درجة حرارة الثلاجات", "passed": false}, {"item": "نظافة أدوات الطبخ", "passed": true}]'::jsonb,
        87,
        'يجب معالجة مشكلة الثلاجة فوراً'
    ),
    (
        CURRENT_DATE - 2,
        'morning',
        'يوسف المالكي',
        '[{"item": "نظافة المطبخ", "passed": true}, {"item": "درجة حرارة الثلاجات", "passed": true}]'::jsonb,
        100,
        'ممتاز'
    );
-- 4.8 WISDOM
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
        'في رمضان 2019، واجهنا نقصاً حاداً في الكوادر. الحل كان تقسيم الورديات.',
        'المدير السابق رحمه الله',
        'مدير المركز',
        'رمضان 2019',
        'staffing',
        ARRAY ['رمضان', 'نقص كوادر'],
        24
    ),
    (
        'كيف نتعامل مع إفلاس شركة الإعاشة؟',
        'إجراءات طوارئ: تواصل مع المطاعم المحلية.',
        'مدير الخدمات المساندة',
        'مدير قسم',
        'أزمة 2018',
        'crisis',
        ARRAY ['إعاشة', 'أزمة'],
        18
    ),
    (
        'كيف نحافظ على معنويات الموظفين؟',
        'الاجتماع الصباحي القصير والاعتراف بالإنجازات.',
        'المدير السابق رحمه الله',
        'مدير المركز',
        'خبرة 20 سنة',
        'staffing',
        ARRAY ['معنويات'],
        27
    );
-- 4.9 CONSCIENCE
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
    'عزل المستفيد بسبب سلوك عدواني',
    'isolation',
    45,
    'negative',
    'violated',
    true,
    '["مراقبة مكثفة"]'::jsonb,
    'modified',
    'مراقبة مكثفة',
    '{"isRamadan": false}'::jsonb,
    NOW() - INTERVAL '2 weeks'
FROM beneficiaries b
WHERE file_number = 'RC-2024-041';
