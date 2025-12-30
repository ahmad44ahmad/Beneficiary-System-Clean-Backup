-- =====================================================
-- Extended GRC Schema: Independence & Services Tracking
-- مركز التأهيل الشامل بالباحة
-- =====================================================
-- =====================================================
-- 1. تصنيف المستفيدين (COVID-era Classification)
-- =====================================================
CREATE TABLE IF NOT EXISTS beneficiary_classification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID,
    -- التصنيف حسب مستوى الاستقلالية
    independence_level TEXT CHECK (
        independence_level IN (
            'full_dependency',
            -- اعتماد كامل
            'partial_dependency',
            -- اعتماد جزئي
            'trainable',
            -- قابل للتدريب
            'community_ready',
            -- جاهز للدمج المجتمعي
            'home_care_eligible',
            -- مؤهل للرعاية المنزلية
            'vocational_ready' -- مؤهل للتأهيل المهني
        )
    ),
    -- مسار الدمج المجتمعي
    integration_path TEXT CHECK (
        integration_path IN (
            'family_return',
            -- إعادة للأسرة
            'home_care',
            -- رعاية منزلية
            'day_care',
            -- رعاية نهارية
            'supported_living',
            -- سكن مدعوم
            'vocational_placement',
            -- توظيف مهني
            'long_term_residential' -- إقامة دائمة
        )
    ),
    -- التقييم
    assessment_date DATE DEFAULT CURRENT_DATE,
    assessed_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- 2. فجوة الخدمات (Services Gap)
-- =====================================================
CREATE TABLE IF NOT EXISTS services_gap_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT NOT NULL CHECK (
        service_type IN (
            'home_care',
            -- رعاية منزلية
            'day_care',
            -- رعاية نهارية
            'vocational_rehab',
            -- تأهيل مهني
            'community_integration',
            -- دمج مجتمعي
            'family_counseling',
            -- إرشاد أسري
            'sheltered_workshop' -- ورشة محمية
        )
    ),
    -- الاحتياج
    beneficiaries_needing INT,
    current_capacity INT DEFAULT 0,
    gap_count INT GENERATED ALWAYS AS (beneficiaries_needing - current_capacity) STORED,
    -- السبب
    gap_reason TEXT,
    -- عدم توفر الخدمة بالباحة
    responsible_agency TEXT,
    -- الجهة المسؤولة
    -- الحل المقترح
    proposed_solution TEXT,
    csr_dependency BOOLEAN DEFAULT false,
    -- هل الحل معلق على المسؤولية المجتمعية؟
    -- الوقت
    reported_date DATE DEFAULT CURRENT_DATE,
    expected_resolution DATE,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- 3. ميزانية الاستقلالية vs التبعية
-- =====================================================
CREATE TABLE IF NOT EXISTS independence_budget_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fiscal_year TEXT NOT NULL,
    -- إنفاق التأهيل والتدريب
    rehabilitation_budget DECIMAL(12, 2),
    -- 17 ريال
    training_programs_budget DECIMAL(12, 2),
    vocational_prep_budget DECIMAL(12, 2),
    -- إنفاق الرعاية (يمنع الاستقلالية)
    personal_care_contracts DECIMAL(12, 2),
    -- 6,666 ريال
    catering_contracts DECIMAL(12, 2),
    medical_contracts DECIMAL(12, 2),
    -- النسب
    independence_ratio DECIMAL(5, 2),
    -- نسبة إنفاق الاستقلالية
    dependency_ratio DECIMAL(5, 2),
    -- نسبة إنفاق التبعية
    -- التحليل
    analysis_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- 4. حقوق الإنسان vs رغبات اختيارية
-- =====================================================
CREATE TABLE IF NOT EXISTS human_rights_compliance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    right_category TEXT NOT NULL CHECK (
        right_category IN (
            'clothing_dignity',
            -- كرامة الملبس (سحاب، أزرار، خيط)
            'food_choice',
            -- اختيار الطعام
            'activity_participation',
            -- المشاركة بالأنشطة
            'skill_training',
            -- التدريب على المهارات
            'community_access',
            -- الوصول للمجتمع
            'family_contact',
            -- التواصل مع الأسرة
            'personal_preference' -- التفضيلات الشخصية
        )
    ),
    -- الوضع الحالي
    current_status TEXT,
    -- مثال: "ممنوع السحاب والخيط"
    -- هل يُعامل كحق أم رغبة؟
    treated_as TEXT CHECK (treated_as IN ('right', 'preference')),
    should_be TEXT DEFAULT 'right',
    -- التبرير المستخدم
    agency_justification TEXT,
    -- "تحوط ضد الإصابات"
    -- الحقيقة
    actual_impact TEXT,
    -- "سلب مهارات الاستقلالية"
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- 5. مقارنة الخدمات الخارجية (تمكين، مدينة سلطان)
-- =====================================================
CREATE TABLE IF NOT EXISTS external_services_benchmark (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_name TEXT NOT NULL,
    -- مبادرة تمكين، مدينة سلطان
    service_type TEXT,
    -- ما يقدمونه
    service_description TEXT,
    frequency TEXT,
    -- شهري، أسبوعي
    -- المقارنة مع المركز
    available_at_center BOOLEAN DEFAULT false,
    gap_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =====================================================
-- RLS Policies
-- =====================================================
ALTER TABLE beneficiary_classification ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_gap_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE independence_budget_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE human_rights_compliance ENABLE ROW LEVEL SECURITY;
ALTER TABLE external_services_benchmark ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON beneficiary_classification FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON services_gap_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON independence_budget_analysis FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON human_rights_compliance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON external_services_benchmark FOR ALL USING (true) WITH CHECK (true);
-- =====================================================
-- Seed Data: فجوة الخدمات بالباحة
-- =====================================================
INSERT INTO services_gap_analysis (
        service_type,
        beneficiaries_needing,
        current_capacity,
        gap_reason,
        responsible_agency,
        proposed_solution,
        csr_dependency
    )
VALUES (
        'home_care',
        15,
        0,
        'لا توجد رعاية منزلية لقائمة الانتظار بالباحة',
        'وكالة التأهيل',
        'أفضل وسيلة لإعادة المستفيد لأسرته بطبيعة المنطقة',
        false
    ),
    (
        'day_care',
        20,
        0,
        'لا رعاية نهارية للمستفيدين بداخل المركز، فقط للعائش بمنزله',
        'وكالة التأهيل',
        'توفير برنامج رعاية نهارية داخل المركز',
        false
    ),
    (
        'vocational_rehab',
        25,
        0,
        'لا يوجد تأهيل مهني - الوكالة طلبت من الفرع توفيرها من CSR ولم يقم بها',
        'فرع الوزارة',
        'مقارنة: تمكين الضمان الاجتماعي شهرياً برنامج مهني مختلف',
        true
    );
-- =====================================================
-- Seed Data: ميزانية الاستقلالية
-- =====================================================
INSERT INTO independence_budget_analysis (
        fiscal_year,
        rehabilitation_budget,
        training_programs_budget,
        personal_care_contracts,
        independence_ratio,
        dependency_ratio,
        analysis_notes
    )
VALUES (
        '2024',
        17,
        0,
        6666,
        0.25,
        99.75,
        'يُصرف 6666 ريال لعمال العناية الذين يمنعون الاستقلالية - يُصرف 17 ريال فقط للتأهيل والتدريب'
    );
-- =====================================================
-- Seed Data: حقوق الإنسان
-- =====================================================
INSERT INTO human_rights_compliance (
        right_category,
        current_status,
        treated_as,
        agency_justification,
        actual_impact
    )
VALUES (
        'clothing_dignity',
        'ممنوع: سحاب، خيط بالحذاء، أزرار ملابس',
        'preference',
        'تحوط ضد الإصابات',
        'سلب مهارات الاستقلالية والكرامة'
    ),
    (
        'skill_training',
        'غير مفعّل بسبب خوف من الإصابات أثناء التدريب',
        'preference',
        'منع الإصابات أولوية',
        'حرمان من حق التعلم والتطور'
    ),
    (
        'food_choice',
        'يُكتب "يُراعى رغبة المستفيد" لكن لا يُطبق',
        'preference',
        'معايير التغذية الموحدة',
        'تجاهل التفضيلات الشخصية'
    );