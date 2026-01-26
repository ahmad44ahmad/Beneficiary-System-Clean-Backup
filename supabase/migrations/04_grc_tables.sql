-- ========================================
-- GRC (Governance, Risk, Compliance) Tables
-- ========================================
-- GRC Risks Table
CREATE TABLE IF NOT EXISTS grc_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (
        category IN (
            'clinical',
            'safety',
            'social',
            'infrastructure',
            'contractual',
            'operational'
        )
    ),
    risk_score INTEGER DEFAULT 0,
    probability INTEGER DEFAULT 1 CHECK (
        probability BETWEEN 1 AND 5
    ),
    impact INTEGER DEFAULT 1 CHECK (
        impact BETWEEN 1 AND 5
    ),
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'mitigating', 'closed', 'accepted')
    ),
    owner TEXT,
    mitigation_plan TEXT,
    review_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
-- GRC NCRs (Non-Conformance Reports) Table
CREATE TABLE IF NOT EXISTS grc_ncrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    severity TEXT CHECK (severity IN ('minor', 'major', 'critical')),
    status TEXT DEFAULT 'open' CHECK (
        status IN (
            'open',
            'investigating',
            'corrective_action',
            'closed'
        )
    ),
    progress INTEGER DEFAULT 0 CHECK (
        progress BETWEEN 0 AND 100
    ),
    root_cause TEXT,
    corrective_action TEXT,
    due_date DATE,
    assigned_to TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    closed_at TIMESTAMP
);
-- GRC Compliance Table
CREATE TABLE IF NOT EXISTS grc_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requirement TEXT NOT NULL,
    standard TEXT,
    category TEXT,
    status TEXT DEFAULT 'in_progress' CHECK (
        status IN (
            'compliant',
            'partial',
            'non_compliant',
            'in_progress'
        )
    ),
    evidence TEXT,
    notes TEXT,
    last_audit_date DATE,
    next_audit_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);
-- RLS Policies
ALTER TABLE grc_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_ncrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_compliance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_grc_risks" ON grc_risks FOR
SELECT USING (true);
CREATE POLICY "public_read_grc_ncrs" ON grc_ncrs FOR
SELECT USING (true);
CREATE POLICY "public_read_grc_compliance" ON grc_compliance FOR
SELECT USING (true);
-- INSERT POLICIES for anon users
CREATE POLICY "anon_insert_grc_risks" ON grc_risks FOR
INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_grc_ncrs" ON grc_ncrs FOR
INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_grc_compliance" ON grc_compliance FOR
INSERT WITH CHECK (true);
-- UPDATE POLICIES
CREATE POLICY "anon_update_grc_risks" ON grc_risks FOR
UPDATE USING (true);
CREATE POLICY "anon_update_grc_ncrs" ON grc_ncrs FOR
UPDATE USING (true);
CREATE POLICY "anon_update_grc_compliance" ON grc_compliance FOR
UPDATE USING (true);
-- Seed GRC Data
INSERT INTO grc_risks (
        title,
        description,
        category,
        risk_score,
        probability,
        impact,
        status,
        owner,
        mitigation_plan
    )
VALUES (
        'مخاطر السقوط للمستفيدين',
        'خطر سقوط المستفيدين ذوي الإعاقة الحركية',
        'safety',
        15,
        3,
        5,
        'mitigating',
        'مدير الرعاية',
        'تركيب قضبان أمان في جميع الممرات'
    ),
    (
        'عدوى الجهاز التنفسي',
        'خطر انتشار العدوى التنفسية بين المستفيدين',
        'clinical',
        16,
        4,
        4,
        'mitigating',
        'مدير الخدمات الطبية',
        'بروتوكول عزل وتطعيم'
    ),
    (
        'نقص الكوادر التمريضية',
        'عدم كفاية عدد الممرضين لتغطية الورديات',
        'operational',
        12,
        3,
        4,
        'open',
        'مدير الموارد البشرية',
        'التعاقد مع شركة توظيف'
    ),
    (
        'تأخر صيانة المعدات الطبية',
        'تأخر في صيانة أجهزة الأكسجين والمراقبة',
        'infrastructure',
        12,
        3,
        4,
        'mitigating',
        'مدير الصيانة',
        'عقد صيانة سنوي'
    ),
    (
        'مخاطر الحريق',
        'احتمال نشوب حريق في المبنى القديم',
        'safety',
        14,
        2,
        5,
        'mitigating',
        'مسؤول السلامة',
        'تحديث نظام الإنذار'
    ),
    (
        'انقطاع التواصل مع الأسر',
        'عدم متابعة بعض الأسر لأبنائهم',
        'social',
        10,
        4,
        3,
        'open',
        'مدير الخدمات الاجتماعية',
        'برنامج تواصل شهري'
    ),
    (
        'مخاطر الإعاشة',
        'جودة الطعام والنظافة',
        'clinical',
        9,
        3,
        3,
        'mitigating',
        'مشرف الإعاشة',
        'فحوصات يومية'
    ),
    (
        'تسريب بيانات',
        'خطر تسريب البيانات الشخصية للمستفيدين',
        'operational',
        15,
        2,
        5,
        'mitigating',
        'مسؤول تقنية المعلومات',
        'تشفير البيانات وتدريب الموظفين'
    ),
    (
        'نقص الأدوية',
        'احتمال نفاد بعض الأدوية الأساسية',
        'clinical',
        12,
        3,
        4,
        'open',
        'مدير الصيدلية',
        'نظام إنذار مبكر للمخزون'
    ),
    (
        'حوادث العنف',
        'سلوك عدواني بين بعض المستفيدين',
        'safety',
        14,
        3,
        4,
        'mitigating',
        'الأخصائي النفسي',
        'خطط تدخل سلوكي'
    ),
    (
        'عدم الامتثال لمعايير الجودة',
        'فجوات في الامتثال لمعايير ISO',
        'operational',
        8,
        2,
        4,
        'mitigating',
        'منسق الجودة',
        'مراجعات دورية'
    ),
    (
        'مخاطر الإخلاء الطارئ',
        'صعوبة إخلاء المستفيدين في حالات الطوارئ',
        'safety',
        15,
        2,
        5,
        'open',
        'مسؤول السلامة',
        'تدريبات إخلاء ربع سنوية'
    );
INSERT INTO grc_ncrs (
        title,
        description,
        category,
        severity,
        status,
        progress,
        due_date,
        assigned_to
    )
VALUES (
        'توثيق غير مكتمل للخطط التأهيلية',
        'وجود خطط تأهيلية بدون توقيع المدير',
        'documentation',
        'major',
        'corrective_action',
        60,
        '2024-02-15',
        'منسق الجودة'
    ),
    (
        'تأخر في تحديث السجلات الطبية',
        'سجلات 5 مستفيدين لم تُحدث منذ 3 أشهر',
        'medical',
        'major',
        'investigating',
        30,
        '2024-02-20',
        'مدير الخدمات الطبية'
    ),
    (
        'مخالفة نظافة في المطبخ',
        'وجود مخالفة نظافة خلال الفحص الدوري',
        'catering',
        'minor',
        'corrective_action',
        80,
        '2024-02-10',
        'مشرف الإعاشة'
    );
INSERT INTO grc_compliance (
        requirement,
        standard,
        category,
        status,
        notes,
        last_audit_date,
        next_audit_date
    )
VALUES (
        'توثيق جميع الحوادث خلال 24 ساعة',
        'ISO 9001:2015',
        'documentation',
        'compliant',
        'نظام إلكتروني مفعل',
        '2024-01-15',
        '2024-04-15'
    ),
    (
        'خطة تأهيلية لكل مستفيد',
        'معايير الوزارة',
        'care',
        'partial',
        '85% من المستفيدين لديهم خطط',
        '2024-01-10',
        '2024-04-10'
    ),
    (
        'تدريب الموظفين على السلامة',
        'OSHA',
        'safety',
        'compliant',
        'تم تدريب جميع الموظفين',
        '2024-01-20',
        '2024-07-20'
    ),
    (
        'فحص معدات الإطفاء',
        'كود البناء السعودي',
        'safety',
        'compliant',
        'فحص شهري',
        '2024-01-25',
        '2024-02-25'
    ),
    (
        'سرية البيانات الشخصية',
        'نظام حماية البيانات',
        'privacy',
        'partial',
        'جاري تحديث السياسات',
        '2024-01-05',
        '2024-04-05'
    ),
    (
        'فحص جودة الطعام',
        'هيئة الغذاء والدواء',
        'catering',
        'compliant',
        'فحوصات أسبوعية',
        '2024-01-28',
        '2024-02-28'
    ),
    (
        'إجراءات العزل الصحي',
        'CDC Guidelines',
        'medical',
        'in_progress',
        'جاري تحديث البروتوكول',
        '2024-01-12',
        '2024-03-12'
    ),
    (
        'تقييم المخاطر السنوي',
        'ISO 31000',
        'risk',
        'partial',
        'تم تقييم 70% من المخاطر',
        '2024-01-08',
        '2025-01-08'
    ),
    (
        'خطة الاستجابة للطوارئ',
        'الدفاع المدني',
        'emergency',
        'compliant',
        'خطة معتمدة ومفعلة',
        '2024-01-18',
        '2024-07-18'
    );