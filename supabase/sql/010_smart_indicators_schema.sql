-- =====================================================
-- Smart Indicators Schema (المؤشرات الذكية)
-- مركز التأهيل الشامل بالباحة
-- Version: 1.0 | Date: 2026-01-09
-- =====================================================
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              جدول 1: تتبع الحضور (HR Attendance)                            │
-- └─────────────────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS hr_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES employees(id),
    attendance_date DATE NOT NULL,
    status TEXT CHECK (
        status IN ('حاضر', 'غائب', 'إجازة', 'مهمة', 'مرضي')
    ) DEFAULT 'حاضر',
    shift TEXT CHECK (shift IN ('صباحي', 'مسائي', 'ليلي')),
    check_in_time TIME,
    check_out_time TIME,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, attendance_date, shift)
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              جدول 2: تتبع التكاليف (Cost Tracking)                           │
-- └─────────────────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS cost_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cost_month DATE NOT NULL,
    -- أول يوم في الشهر
    cost_category TEXT NOT NULL CHECK (
        cost_category IN (
            'رواتب',
            'غذاء',
            'كهرباء',
            'مياه',
            'صيانة',
            'أدوات_نظافة',
            'ملابس',
            'طبي',
            'نقل',
            'أخرى'
        )
    ),
    amount DECIMAL(12, 2) NOT NULL,
    beneficiary_count INT,
    -- عدد المستفيدين في ذلك الشهر
    notes TEXT,
    entered_by UUID REFERENCES employees(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(cost_month, cost_category)
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              جدول 3: معايير المقارنة المرجعية (Benchmark Standards)          │
-- └─────────────────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS benchmark_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    indicator_name TEXT NOT NULL,
    indicator_code TEXT UNIQUE NOT NULL,
    ministry_target DECIMAL(6, 2),
    -- المعيار الوزاري
    excellent_threshold DECIMAL(6, 2),
    -- ممتاز
    good_threshold DECIMAL(6, 2),
    -- جيد
    acceptable_threshold DECIMAL(6, 2),
    -- مقبول
    unit TEXT,
    -- نسبة، عدد، يوم، دقيقة
    category TEXT CHECK (
        category IN ('جودة', 'سلامة', 'IPC', 'استجابة', 'رضا', 'مالي')
    ),
    description TEXT,
    is_higher_better BOOLEAN DEFAULT true,
    -- هل الأعلى أفضل؟
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              جدول 4: قائمة الامتثال ISO (ISO Compliance Checklist)            │
-- └─────────────────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS iso_compliance_checklist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    iso_clause TEXT NOT NULL,
    -- مثل: "8.4.1"
    requirement_ar TEXT NOT NULL,
    requirement_en TEXT,
    category TEXT CHECK (
        category IN (
            'Leadership',
            'Planning',
            'Support',
            'Operation',
            'Evaluation',
            'Improvement'
        )
    ),
    -- الحالة
    status TEXT DEFAULT 'not_started' CHECK (
        status IN (
            'not_started',
            'in_progress',
            'implemented',
            'verified',
            'non_conformity'
        )
    ),
    compliance_percentage INT DEFAULT 0 CHECK (
        compliance_percentage BETWEEN 0 AND 100
    ),
    -- الأدلة
    evidence_description TEXT,
    evidence_url TEXT,
    last_audit_date DATE,
    next_audit_date DATE,
    -- المسؤولية
    responsible_department TEXT,
    responsible_person TEXT,
    priority TEXT DEFAULT 'medium' CHECK (
        priority IN ('low', 'medium', 'high', 'critical')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- ┌─────────────────────────────────────────────────────────────────────────────┐
-- │              جدول 5: سجل نقاط الخطر (Risk Score Log)                          │
-- └─────────────────────────────────────────────────────────────────────────────┘
CREATE TABLE IF NOT EXISTS risk_score_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    score_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- مكونات النقاط
    overdue_maintenance_count INT DEFAULT 0,
    fall_incidents_week INT DEFAULT 0,
    active_critical_alerts INT DEFAULT 0,
    critical_accountability_gaps INT DEFAULT 0,
    poor_condition_assets INT DEFAULT 0,
    -- النقاط المحسوبة
    total_risk_score INT GENERATED ALWAYS AS (
        (overdue_maintenance_count * 5) + (fall_incidents_week * 10) + (active_critical_alerts * 15) + (critical_accountability_gaps * 20) + (poor_condition_assets * 3)
    ) STORED,
    risk_level TEXT GENERATED ALWAYS AS (
        CASE
            WHEN (overdue_maintenance_count * 5) + (fall_incidents_week * 10) + (active_critical_alerts * 15) + (critical_accountability_gaps * 20) + (poor_condition_assets * 3) > 90 THEN 'أحمر'
            WHEN (overdue_maintenance_count * 5) + (fall_incidents_week * 10) + (active_critical_alerts * 15) + (critical_accountability_gaps * 20) + (poor_condition_assets * 3) > 60 THEN 'برتقالي'
            WHEN (overdue_maintenance_count * 5) + (fall_incidents_week * 10) + (active_critical_alerts * 15) + (critical_accountability_gaps * 20) + (poor_condition_assets * 3) > 30 THEN 'أصفر'
            ELSE 'أخضر'
        END
    ) STORED,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(score_date)
);
-- ═══════════════════════════════════════════════════════════════════════════════
--                              البيانات الأولية (Seed Data)
-- ═══════════════════════════════════════════════════════════════════════════════
-- معايير المقارنة المرجعية
INSERT INTO benchmark_standards (
        indicator_name,
        indicator_code,
        ministry_target,
        excellent_threshold,
        good_threshold,
        acceptable_threshold,
        unit,
        category,
        description,
        is_higher_better
    )
VALUES (
        'نسبة إكمال العناية اليومية',
        'CARE_COMPLETION',
        95,
        95,
        85,
        75,
        'نسبة',
        'جودة',
        'نسبة سجلات العناية المكتملة يومياً',
        true
    ),
    (
        'معدل حوادث السقوط/1000 يوم',
        'FALL_RATE',
        2,
        1,
        3,
        5,
        'معدل',
        'سلامة',
        'عدد حوادث السقوط لكل 1000 يوم مستفيد',
        false
    ),
    (
        'نسبة الامتثال لنظافة اليدين',
        'HAND_HYGIENE',
        90,
        95,
        85,
        75,
        'نسبة',
        'IPC',
        'نسبة الالتزام ببروتوكول نظافة اليدين',
        true
    ),
    (
        'زمن الاستجابة للتنبيهات',
        'ALERT_RESPONSE',
        15,
        10,
        20,
        30,
        'دقيقة',
        'استجابة',
        'متوسط زمن الاستجابة للتنبيهات الحرجة',
        false
    ),
    (
        'نسبة رضا الأسر',
        'FAMILY_SATISFACTION',
        85,
        90,
        80,
        70,
        'نسبة',
        'رضا',
        'نسبة رضا أسر المستفيدين',
        true
    ),
    (
        'تكلفة المستفيد اليومية',
        'DAILY_COST',
        350,
        300,
        400,
        500,
        'ريال',
        'مالي',
        'تكلفة المستفيد الواحد يومياً',
        false
    ),
    (
        'نسبة التسليم في الوقت',
        'ON_TIME_HANDOVER',
        95,
        98,
        90,
        80,
        'نسبة',
        'جودة',
        'نسبة تقارير التسليم المكتملة في وقتها',
        true
    ),
    (
        'نسبة الصيانة الوقائية المنجزة',
        'PREVENTIVE_MAINTENANCE',
        90,
        95,
        85,
        75,
        'نسبة',
        'سلامة',
        'نسبة مهام الصيانة الوقائية المنجزة',
        true
    ) ON CONFLICT (indicator_code) DO NOTHING;
-- قائمة الامتثال ISO 22301
INSERT INTO iso_compliance_checklist (
        iso_clause,
        requirement_ar,
        requirement_en,
        category,
        status,
        compliance_percentage,
        priority,
        responsible_department
    )
VALUES (
        '4.1',
        'فهم المنظمة وسياقها',
        'Understanding the organization and its context',
        'Leadership',
        'implemented',
        80,
        'high',
        'الإدارة'
    ),
    (
        '4.2',
        'فهم احتياجات الأطراف المعنية',
        'Understanding needs of interested parties',
        'Leadership',
        'implemented',
        75,
        'high',
        'الإدارة'
    ),
    (
        '5.1',
        'القيادة والالتزام',
        'Leadership and commitment',
        'Leadership',
        'in_progress',
        60,
        'critical',
        'مدير المركز'
    ),
    (
        '5.2',
        'السياسة',
        'Policy',
        'Leadership',
        'implemented',
        90,
        'high',
        'الجودة'
    ),
    (
        '6.1',
        'الإجراءات لمعالجة المخاطر والفرص',
        'Actions to address risks and opportunities',
        'Planning',
        'in_progress',
        50,
        'critical',
        'الجودة'
    ),
    (
        '7.1',
        'الموارد',
        'Resources',
        'Support',
        'not_started',
        30,
        'high',
        'الموارد البشرية'
    ),
    (
        '7.2',
        'الكفاءة',
        'Competence',
        'Support',
        'in_progress',
        45,
        'medium',
        'التدريب'
    ),
    (
        '8.1',
        'التخطيط والتحكم التشغيلي',
        'Operational planning and control',
        'Operation',
        'in_progress',
        55,
        'high',
        'التشغيل'
    ),
    (
        '8.4',
        'خطط استمرارية الأعمال',
        'Business continuity plans',
        'Operation',
        'not_started',
        20,
        'critical',
        'الطوارئ'
    ),
    (
        '9.1',
        'المراقبة والقياس والتحليل',
        'Monitoring, measurement, analysis',
        'Evaluation',
        'in_progress',
        40,
        'medium',
        'الجودة'
    ),
    (
        '10.1',
        'عدم المطابقة والإجراء التصحيحي',
        'Nonconformity and corrective action',
        'Improvement',
        'not_started',
        15,
        'high',
        'الجودة'
    ) ON CONFLICT DO NOTHING;
-- بيانات تكاليف تجريبية
INSERT INTO cost_tracking (
        cost_month,
        cost_category,
        amount,
        beneficiary_count,
        notes
    )
VALUES (
        '2025-10-01',
        'رواتب',
        450000,
        120,
        'رواتب الربع الرابع'
    ),
    (
        '2025-10-01',
        'غذاء',
        85000,
        120,
        'تعاقد الإعاشة'
    ),
    (
        '2025-10-01',
        'كهرباء',
        35000,
        120,
        'فاتورة الكهرباء'
    ),
    ('2025-10-01', 'مياه', 8000, 120, 'فاتورة المياه'),
    ('2025-10-01', 'صيانة', 25000, 120, 'صيانة دورية'),
    ('2025-11-01', 'رواتب', 450000, 118, NULL),
    ('2025-11-01', 'غذاء', 82000, 118, NULL),
    (
        '2025-11-01',
        'كهرباء',
        38000,
        118,
        'ارتفاع بسبب التكييف'
    ),
    ('2025-11-01', 'مياه', 7500, 118, NULL),
    (
        '2025-11-01',
        'صيانة',
        42000,
        118,
        'إصلاح مكيفات'
    ),
    ('2025-12-01', 'رواتب', 455000, 122, 'زيادة موظف'),
    ('2025-12-01', 'غذاء', 88000, 122, NULL),
    ('2025-12-01', 'كهرباء', 32000, 122, NULL),
    ('2025-12-01', 'مياه', 8500, 122, NULL),
    ('2025-12-01', 'صيانة', 18000, 122, NULL) ON CONFLICT DO NOTHING;
-- سجل نقاط الخطر
INSERT INTO risk_score_log (
        score_date,
        overdue_maintenance_count,
        fall_incidents_week,
        active_critical_alerts,
        critical_accountability_gaps,
        poor_condition_assets,
        notes
    )
VALUES ('2026-01-01', 3, 1, 2, 4, 5, 'بداية السنة'),
    ('2026-01-02', 4, 0, 2, 4, 5, NULL),
    ('2026-01-03', 4, 1, 3, 4, 5, 'حادثة سقوط جديدة'),
    ('2026-01-04', 5, 1, 3, 4, 5, NULL),
    ('2026-01-05', 5, 2, 4, 4, 5, 'ارتفاع الخطر'),
    ('2026-01-06', 6, 2, 4, 4, 6, NULL),
    ('2026-01-07', 6, 0, 3, 4, 6, 'تحسن'),
    ('2026-01-08', 5, 0, 2, 3, 6, 'معالجة فجوة'),
    ('2026-01-09', 4, 1, 2, 3, 5, 'الوضع الحالي') ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════════════
--                              الفهارس والأمان
-- ═══════════════════════════════════════════════════════════════════════════════
-- Indexes
CREATE INDEX IF NOT EXISTS idx_hr_attendance_date ON hr_attendance(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_hr_attendance_employee ON hr_attendance(employee_id, attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_cost_tracking_month ON cost_tracking(cost_month DESC);
CREATE INDEX IF NOT EXISTS idx_iso_compliance_status ON iso_compliance_checklist(status, priority);
CREATE INDEX IF NOT EXISTS idx_risk_score_date ON risk_score_log(score_date DESC);
-- RLS Policies
ALTER TABLE hr_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmark_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE iso_compliance_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_score_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON hr_attendance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON cost_tracking FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON benchmark_standards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON iso_compliance_checklist FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON risk_score_log FOR ALL USING (true) WITH CHECK (true);
-- Enable Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE risk_score_log;
ALTER PUBLICATION supabase_realtime
ADD TABLE iso_compliance_checklist;