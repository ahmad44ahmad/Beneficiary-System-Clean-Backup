-- ═══════════════════════════════════════════════════════════════════════════════
-- COMPREHENSIVE MIGRATION: All Missing Tables for Basira System
-- Run this in Supabase SQL Editor to create all missing tables and seed data
-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. DIGNITY FILES (ملف الكرامة)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS dignity_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    preferences JSONB DEFAULT '{}',
    care_tips TEXT,
    communication_style TEXT,
    daily_routine TEXT,
    likes TEXT [],
    dislikes TEXT [],
    motivators TEXT [],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE dignity_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for dignity_files" ON dignity_files FOR ALL USING (true);
-- 2. DAILY CARE LOGS (سجل الرعاية اليومية)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS daily_care_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    log_time TIME,
    category TEXT CHECK (
        category IN (
            'hygiene',
            'nutrition',
            'medication',
            'mobility',
            'social',
            'other'
        )
    ),
    description TEXT NOT NULL,
    notes TEXT,
    staff_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE daily_care_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for daily_care_logs" ON daily_care_logs FOR ALL USING (true);
-- 3. FALL RISK ASSESSMENTS (تقييم مخاطر السقوط)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS fall_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    risk_score INTEGER CHECK (
        risk_score >= 0
        AND risk_score <= 100
    ),
    mobility_score INTEGER DEFAULT 0,
    vision_score INTEGER DEFAULT 0,
    medication_score INTEGER DEFAULT 0,
    environment_score INTEGER DEFAULT 0,
    recommendations TEXT,
    assessed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE fall_risk_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for fall_risk_assessments" ON fall_risk_assessments FOR ALL USING (true);
-- 4. OM ASSETS (الأصول والمعدات)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS om_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    category TEXT,
    status TEXT CHECK (
        status IN (
            'operational',
            'maintenance',
            'retired',
            'pending'
        )
    ) DEFAULT 'operational',
    location TEXT,
    purchase_date DATE,
    warranty_expiry DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE om_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for om_assets" ON om_assets FOR ALL USING (true);
-- 5. OM MAINTENANCE REQUESTS (طلبات الصيانة)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS om_maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE,
    asset_id UUID REFERENCES om_assets(id),
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (
        priority IN ('critical', 'high', 'medium', 'low')
    ) DEFAULT 'medium',
    status TEXT CHECK (
        status IN (
            'pending',
            'in_progress',
            'completed',
            'cancelled'
        )
    ) DEFAULT 'pending',
    requested_by TEXT,
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
ALTER TABLE om_maintenance_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for om_maintenance_requests" ON om_maintenance_requests FOR ALL USING (true);
-- 6. ACCOUNTABILITY GAPS (فجوات المساءلة)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS accountability_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_code TEXT UNIQUE,
    issue_title TEXT NOT NULL,
    issue_description TEXT,
    responsible_agency TEXT,
    redirected_to TEXT,
    is_misdirected BOOLEAN DEFAULT FALSE,
    official_response TEXT,
    actual_delivery TEXT,
    evasion_type TEXT CHECK (
        evasion_type IN (
            'forward_escape',
            'misdirection',
            'false_promise',
            'silence',
            'partial_delivery'
        )
    ),
    severity TEXT CHECK (
        severity IN ('critical', 'high', 'medium', 'low')
    ) DEFAULT 'medium',
    days_pending INTEGER DEFAULT 0,
    evidence_quote TEXT,
    requires_attention BOOLEAN DEFAULT TRUE,
    acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE accountability_gaps ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS "Allow all for accountability_gaps" ON accountability_gaps FOR ALL USING (true);
-- ═══════════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════════
-- Seed OM Assets
INSERT INTO om_assets (asset_code, name_ar, category, status, location)
VALUES (
        'BED-001',
        'سرير طبي كهربائي',
        'أثاث طبي',
        'operational',
        'الجناح أ - غرفة 101'
    ),
    (
        'BED-002',
        'سرير طبي كهربائي',
        'أثاث طبي',
        'operational',
        'الجناح أ - غرفة 102'
    ),
    (
        'WC-001',
        'كرسي متحرك يدوي',
        'أجهزة تنقل',
        'operational',
        'المستودع الرئيسي'
    ),
    (
        'WC-002',
        'كرسي متحرك كهربائي',
        'أجهزة تنقل',
        'maintenance',
        'ورشة الصيانة'
    ),
    (
        'AC-001',
        'مكيف سبليت 24000 وحدة',
        'تكييف',
        'operational',
        'الجناح أ'
    ),
    (
        'AC-002',
        'مكيف سبليت 18000 وحدة',
        'تكييف',
        'operational',
        'الجناح ب'
    ),
    (
        'GEN-001',
        'مولد كهربائي 100 كيلوواط',
        'طاقة',
        'operational',
        'غرفة المولدات'
    ),
    (
        'LIFT-001',
        'رافعة مريض هيدروليكية',
        'أجهزة طبية',
        'operational',
        'الطابق الثاني'
    ),
    (
        'OXY-001',
        'جهاز أكسجين متنقل',
        'أجهزة طبية',
        'operational',
        'غرفة الطوارئ'
    ),
    (
        'PUMP-001',
        'مضخة سوائل IV',
        'أجهزة طبية',
        'operational',
        'الجناح الطبي'
    ) ON CONFLICT (asset_code) DO NOTHING;
-- Seed Accountability Gaps
INSERT INTO accountability_gaps (
        issue_code,
        issue_title,
        issue_description,
        responsible_agency,
        evasion_type,
        severity,
        days_pending,
        requires_attention,
        acknowledged
    )
VALUES (
        'GAP-2025-001',
        'تأخر في توفير الأجهزة الطبية',
        'تأخر شركة المستلزمات الطبية في تسليم الأجهزة المطلوبة منذ 15 يوم',
        'شركة المستلزمات الطبية',
        'false_promise',
        'high',
        15,
        true,
        false
    ),
    (
        'GAP-2025-002',
        'نقص في الكوادر التمريضية',
        'عدم اكتمال الكادر التمريضي حسب المعايير المطلوبة',
        'إدارة الموارد البشرية',
        'partial_delivery',
        'medium',
        30,
        true,
        false
    ),
    (
        'GAP-2025-003',
        'تأخر صيانة المصاعد',
        'المصعد الرئيسي معطل منذ أسبوع',
        'شركة الصيانة',
        'silence',
        'critical',
        7,
        true,
        false
    ) ON CONFLICT (issue_code) DO NOTHING;
-- Seed Fall Risk Assessments (using first 3 beneficiaries)
INSERT INTO fall_risk_assessments (
        beneficiary_id,
        risk_score,
        mobility_score,
        vision_score,
        medication_score,
        recommendations,
        assessed_by
    )
SELECT id,
    (RANDOM() * 60 + 20)::INTEGER,
    -- risk_score 20-80
    (RANDOM() * 3 + 1)::INTEGER,
    -- mobility 1-4
    (RANDOM() * 3 + 1)::INTEGER,
    -- vision 1-4
    (RANDOM() * 2 + 1)::INTEGER,
    -- medication 1-3
    CASE
        (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'توفير مساعدة عند المشي والتنقل'
        WHEN 1 THEN 'إضاءة كافية في الغرفة والممرات'
        ELSE 'ارتداء حذاء مانع للانزلاق'
    END,
    'د. سارة أحمد'
FROM beneficiaries
LIMIT 5;
-- Seed Daily Care Logs
INSERT INTO daily_care_logs (
        beneficiary_id,
        log_date,
        log_time,
        category,
        description,
        staff_name
    )
SELECT id,
    CURRENT_DATE,
    '08:00',
    'hygiene',
    'استحمام صباحي بمساعدة - تعاون جيد',
    'أحمد محمد'
FROM beneficiaries
LIMIT 3;
INSERT INTO daily_care_logs (
        beneficiary_id,
        log_date,
        log_time,
        category,
        description,
        staff_name
    )
SELECT id,
    CURRENT_DATE,
    '12:00',
    'nutrition',
    'تناول وجبة الغداء كاملة - شهية جيدة',
    'فاطمة علي'
FROM beneficiaries
LIMIT 3;
INSERT INTO daily_care_logs (
        beneficiary_id,
        log_date,
        log_time,
        category,
        description,
        staff_name
    )
SELECT id,
    CURRENT_DATE,
    '14:00',
    'medication',
    'تناول الأدوية المقررة في موعدها',
    'نورة سعد'
FROM beneficiaries
LIMIT 3;
-- Seed Dignity Files
INSERT INTO dignity_files (
        beneficiary_id,
        care_tips,
        communication_style,
        likes,
        dislikes,
        motivators
    )
SELECT id,
    'يفضل الهدوء في الصباح ويستجيب جيداً للموسيقى الهادئة',
    'التحدث ببطء والتواصل البصري',
    ARRAY ['القراءة', 'المشي الصباحي', 'الحديث مع الأصدقاء'],
    ARRAY ['الضوضاء العالية', 'الأماكن المزدحمة'],
    ARRAY ['الثناء اللفظي', 'المكالمات العائلية', 'الهدايا البسيطة']
FROM beneficiaries
LIMIT 5;
-- ═══════════════════════════════════════════════════════════════════════════════
-- DONE! All tables created and seeded
-- ═══════════════════════════════════════════════════════════════════════════════