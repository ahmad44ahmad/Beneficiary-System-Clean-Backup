-- =====================================================
-- Accountability Tracking Schema
-- تتبع المساءلة والتنصل من المسؤولية
-- =====================================================
CREATE TABLE IF NOT EXISTS accountability_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- التحدي/الملاحظة
    issue_code TEXT UNIQUE,
    -- ACC-2024-001
    issue_title TEXT NOT NULL,
    issue_description TEXT,
    source_document TEXT,
    -- اسم ملف Excel المصدر
    source_date DATE,
    -- الجهات
    responsible_agency TEXT,
    -- الجهة المختصة فعلياً
    redirected_to TEXT,
    -- الجهة التي أُحيل إليها (إن وجد)
    is_misdirected BOOLEAN DEFAULT false,
    -- هل أُحيل لجهة غير مختصة؟
    -- الاستجابة
    official_response TEXT,
    -- الرد الرسمي
    actual_delivery TEXT,
    -- ما تم تنفيذه فعلياً
    delivery_date DATE,
    -- تاريخ التنفيذ (إن وجد)
    -- التصنيف
    evasion_type TEXT CHECK (
        evasion_type IN (
            'forward_escape',
            -- هروب للأمام (وعود مستقبلية)
            'misdirection',
            -- تحويل لجهة أخرى
            'false_promise',
            -- وعد كاذب
            'silence',
            -- صمت وتجاهل
            'partial_delivery',
            -- تنفيذ جزئي
            'delivered' -- تم التنفيذ
        )
    ) DEFAULT 'silence',
    -- الخطورة
    severity TEXT CHECK (
        severity IN ('critical', 'high', 'medium', 'low')
    ) DEFAULT 'medium',
    days_pending INT,
    -- عدد الأيام بدون حل
    -- الدليل
    evidence_quote TEXT,
    -- اقتباس مباشر
    evidence_url TEXT,
    -- رابط الملف
    -- للتنبيهات
    requires_attention BOOLEAN DEFAULT true,
    acknowledged BOOLEAN DEFAULT false,
    acknowledged_by TEXT,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- جدول اللجان غير الفاعلة
CREATE TABLE IF NOT EXISTS inactive_committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    committee_name TEXT NOT NULL,
    formation_decision TEXT,
    -- رقم القرار المنشئ
    formation_date DATE,
    -- المهام
    assigned_tasks TEXT [],
    -- المهام المكتوبة
    completed_tasks TEXT [],
    -- المهام المنجزة
    -- النشاط
    expected_meetings INT,
    -- الاجتماعات المتوقعة سنوياً
    actual_meetings INT DEFAULT 0,
    -- الاجتماعات الفعلية
    last_meeting_date DATE,
    -- التقييم
    effectiveness_score INT CHECK (
        effectiveness_score BETWEEN 0 AND 100
    ),
    status TEXT CHECK (
        status IN ('active', 'inactive', 'dormant', 'dissolved')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS
ALTER TABLE accountability_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE inactive_committees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON accountability_gaps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON inactive_committees FOR ALL USING (true) WITH CHECK (true);
-- Seed Data: أمثلة من التحديات المذكورة
INSERT INTO accountability_gaps (
        issue_code,
        issue_title,
        issue_description,
        responsible_agency,
        redirected_to,
        is_misdirected,
        official_response,
        actual_delivery,
        evasion_type,
        severity,
        days_pending,
        evidence_quote,
        requires_attention
    )
VALUES (
        'ACC-2024-001',
        'عدم وجود نظام إطفاء آلي',
        'المبنى بدون رشاشات آلية للحريق منذ إنشائه',
        'الوكالة المساعدة للشؤون الفنية',
        NULL,
        false,
        'مرتبط بمشروع الأمن والسلامة',
        'لا شيء',
        'forward_escape',
        'critical',
        730,
        'بتاريخ إنجاز 30-3-2025م - لم يُنفذ',
        true
    ),
    (
        'ACC-2024-002',
        'نقص الكوادر النسائية المتخصصة',
        'لا يوجد: أخصائية اجتماعية، طبيبة، أخصائية نفسية',
        'إدارة الموارد البشرية',
        NULL,
        false,
        'جاري العمل وفق مسطرة القياس',
        'إعلانات متكررة بدون تقدم أحد',
        'forward_escape',
        'high',
        540,
        'هذه النقطة قديمة جداً ونعاني منها منذ افتتاح المركز',
        true
    ),
    (
        'ACC-2024-003',
        'التأهيل المهني',
        'لا يوجد تأهيل مهني بالمركز',
        'وكالة التأهيل والتوجيه الاجتماعي',
        'فرع الوزارة - المسؤولية المجتمعية',
        true,
        'توفيرها من CSR',
        'الفرع لم يقم بشيء',
        'misdirection',
        'high',
        365,
        'وكالة التوجيه طلبت من الفرع يوفرها من المسؤولية المجتمعية ولم يقم بها',
        true
    ),
    (
        'ACC-2024-004',
        'التزام الإمارة - برامج تدريب مهني',
        'الإمارة التزمت بتقديم برامج تدريب مهني عبر CSR',
        'إمارة المنطقة',
        NULL,
        false,
        'برامج تدريب مهني عبر المسؤولية المجتمعية',
        'كرسي أسنان بدون طبيب + أفران 360V غير صالحة',
        'false_promise',
        'medium',
        540,
        'أتوا بكرسي أسنان لا يوجد طبيب - أفران 360V للدول الاسكندنافية قذفوها بالمستودع',
        true
    ),
    (
        'ACC-2024-005',
        'الزيارات الإشرافية خارج الاختصاص',
        'الاجتماعي يعلق على المرافق، والفني يعلق على الكوادر',
        'الإشراف الاجتماعي',
        'جهات غير مختصة',
        true,
        'ملاحظات متعددة الوكالات',
        'خلط الاختصاصات وتشتيت المسؤولية',
        'misdirection',
        'medium',
        365,
        'الاجتماعي يذهب إلى المرافق وإدارة المرافق تعود على فرع الوزارة',
        true
    );
INSERT INTO inactive_committees (
        committee_name,
        formation_decision,
        assigned_tasks,
        completed_tasks,
        expected_meetings,
        actual_meetings,
        effectiveness_score,
        status,
        notes
    )
VALUES (
        'لجنة تحسين الجودة من الإشراف الاجتماعي',
        'قرار داخلي 2023',
        ARRAY ['تقديم برامج ومناهج', 'إرشاد أسري', 'برامج تدريبية'],
        ARRAY []::TEXT [],
        12,
        0,
        0,
        'dormant',
        'لم تقم بشيء - سنة كاملة'
    ),
    (
        'لجنة معالجة ملاحظات مراكز التأهيل',
        'قرار وزاري',
        ARRAY ['متابعة الملاحظات', 'رفع التوصيات'],
        ARRAY []::TEXT [],
        6,
        2,
        15,
        'inactive',
        'اجتماعان فقط بدون مخرجات ملموسة'
    );