-- 006_grc_schema.sql
-- Governance, Risk & Compliance (GRC) Module
-- Based on documents: Risk Matrix, OSH Framework, Tamkeen Initiative
-- =========================================
-- 1. RISK MANAGEMENT (إدارة المخاطر)
-- =========================================
-- Risk Categories (فئات المخاطر)
CREATE TABLE IF NOT EXISTS grc_risk_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    color_code TEXT DEFAULT '#F59630',
    -- HRSD Orange
    icon TEXT,
    parent_id UUID REFERENCES grc_risk_categories(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Risk Register (سجل المخاطر)
CREATE TABLE IF NOT EXISTS grc_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_code TEXT UNIQUE NOT NULL,
    -- Format: RISK-YYYY-NNN
    -- Risk Details
    title_ar TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    category_id UUID REFERENCES grc_risk_categories(id),
    -- Assessment (5x5 Matrix)
    likelihood INT CHECK (
        likelihood BETWEEN 1 AND 5
    ) DEFAULT 3,
    impact INT CHECK (
        impact BETWEEN 1 AND 5
    ) DEFAULT 3,
    risk_score INT GENERATED ALWAYS AS (likelihood * impact) STORED,
    -- Classification
    risk_level TEXT GENERATED ALWAYS AS (
        CASE
            WHEN likelihood * impact >= 20 THEN 'critical'
            WHEN likelihood * impact >= 12 THEN 'high'
            WHEN likelihood * impact >= 6 THEN 'medium'
            ELSE 'low'
        END
    ) STORED,
    -- Ownership
    risk_owner TEXT,
    department TEXT,
    -- Response
    response_strategy TEXT CHECK (
        response_strategy IN ('avoid', 'mitigate', 'transfer', 'accept')
    ),
    mitigation_action TEXT,
    contingency_plan TEXT,
    -- Status & Tracking
    status TEXT DEFAULT 'identified' CHECK (
        status IN (
            'identified',
            'analyzing',
            'mitigating',
            'monitoring',
            'closed',
            'escalated'
        )
    ),
    review_frequency TEXT CHECK (
        review_frequency IN ('weekly', 'monthly', 'quarterly', 'annual')
    ),
    next_review_date DATE,
    last_review_date DATE,
    -- Audit
    identified_by UUID,
    identified_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Risk Assessments (تقييمات المخاطر)
CREATE TABLE IF NOT EXISTS grc_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_id UUID REFERENCES grc_risks(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Previous/Current State
    previous_score INT,
    new_score INT,
    -- Findings
    findings TEXT,
    recommendations TEXT,
    action_items JSONB,
    -- Array of action items
    assessed_by UUID,
    approved_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =========================================
-- 2. COMPLIANCE (الامتثال)
-- =========================================
-- Compliance Standards (المعايير)
CREATE TABLE IF NOT EXISTS grc_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    -- e.g., 'ISO-9001', 'OSH-HRSD', 'HIPAA'
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    issuing_body TEXT,
    version TEXT,
    effective_date DATE,
    expiry_date DATE,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Compliance Requirements (متطلبات الامتثال)
CREATE TABLE IF NOT EXISTS grc_compliance_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    standard_id UUID REFERENCES grc_standards(id),
    requirement_code TEXT,
    title_ar TEXT NOT NULL,
    description TEXT,
    -- Category within standard
    section TEXT,
    article TEXT,
    -- Assessment
    compliance_status TEXT DEFAULT 'pending' CHECK (
        compliance_status IN (
            'pending',
            'compliant',
            'partial',
            'non_compliant',
            'not_applicable'
        )
    ),
    compliance_score INT CHECK (
        compliance_score BETWEEN 0 AND 100
    ),
    -- Evidence
    evidence_required TEXT,
    evidence_url TEXT,
    evidence_notes TEXT,
    -- Responsibility
    responsible_person TEXT,
    responsible_department TEXT,
    due_date DATE,
    -- Gap & Remediation
    gap_description TEXT,
    remediation_plan TEXT,
    remediation_deadline DATE,
    last_audit_date DATE,
    next_audit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Compliance Audits (التدقيقات)
CREATE TABLE IF NOT EXISTS grc_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_code TEXT UNIQUE NOT NULL,
    standard_id UUID REFERENCES grc_standards(id),
    audit_type TEXT CHECK (
        audit_type IN ('internal', 'external', 'regulatory')
    ),
    audit_date DATE NOT NULL,
    scope TEXT,
    findings TEXT,
    non_conformities INT DEFAULT 0,
    observations INT DEFAULT 0,
    opportunities_for_improvement INT DEFAULT 0,
    overall_score INT,
    auditor_name TEXT,
    auditor_organization TEXT,
    report_url TEXT,
    next_audit_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =========================================
-- 3. BUSINESS CONTINUITY (استمرارية الأعمال)
-- =========================================
-- BCP Scenarios (سيناريوهات استمرارية الأعمال)
CREATE TABLE IF NOT EXISTS grc_bcp_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_code TEXT UNIQUE NOT NULL,
    title_ar TEXT NOT NULL,
    title_en TEXT,
    description TEXT,
    -- Impact & Classification
    impact_category TEXT CHECK (
        impact_category IN (
            'operational',
            'financial',
            'reputational',
            'regulatory'
        )
    ),
    impact_level TEXT CHECK (
        impact_level IN (
            'catastrophic',
            'major',
            'moderate',
            'minor',
            'insignificant'
        )
    ),
    -- Recovery Objectives
    rto_hours INT,
    -- Recovery Time Objective
    rpo_hours INT,
    -- Recovery Point Objective
    mtpd_hours INT,
    -- Maximum Tolerable Period of Disruption
    -- Response Plan
    activation_criteria TEXT,
    recovery_steps JSONB,
    -- Array of steps
    required_resources JSONB,
    key_contacts JSONB,
    -- Testing
    last_test_date DATE,
    test_result TEXT CHECK (
        test_result IN ('passed', 'partial', 'failed', 'not_tested')
    ),
    next_test_date DATE,
    -- Status
    status TEXT DEFAULT 'draft' CHECK (
        status IN ('draft', 'active', 'under_review', 'archived')
    ),
    owner TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- BCP Test Records (سجلات اختبار الخطة)
CREATE TABLE IF NOT EXISTS grc_bcp_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scenario_id UUID REFERENCES grc_bcp_scenarios(id),
    test_type TEXT CHECK (
        test_type IN (
            'tabletop',
            'walkthrough',
            'simulation',
            'full_exercise'
        )
    ),
    test_date DATE NOT NULL,
    participants TEXT [],
    test_scope TEXT,
    -- Results
    objectives_met BOOLEAN,
    actual_recovery_time INT,
    -- minutes
    issues_identified TEXT,
    lessons_learned TEXT,
    recommendations TEXT,
    next_test_date DATE,
    conducted_by TEXT,
    approved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =========================================
-- 4. OSH FRAMEWORK (إطار السلامة المهنية)
-- =========================================
-- Safety Incidents (حوادث السلامة)
CREATE TABLE IF NOT EXISTS grc_safety_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code TEXT UNIQUE NOT NULL,
    incident_date TIMESTAMPTZ NOT NULL,
    incident_type TEXT CHECK (
        incident_type IN (
            'injury',
            'near_miss',
            'property_damage',
            'environmental',
            'fire',
            'other'
        )
    ),
    location TEXT,
    description TEXT,
    -- Severity
    severity TEXT CHECK (
        severity IN (
            'minor',
            'moderate',
            'major',
            'critical',
            'fatal'
        )
    ),
    lost_time_days INT DEFAULT 0,
    -- Investigation
    root_cause TEXT,
    corrective_actions TEXT,
    preventive_actions TEXT,
    -- Status
    status TEXT DEFAULT 'reported' CHECK (
        status IN (
            'reported',
            'investigating',
            'action_required',
            'closed'
        )
    ),
    reported_by UUID,
    investigated_by UUID,
    closed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Safety Inspections (فحوصات السلامة)
CREATE TABLE IF NOT EXISTS grc_safety_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_date DATE NOT NULL,
    inspection_type TEXT CHECK (
        inspection_type IN (
            'routine',
            'announced',
            'unannounced',
            'follow_up'
        )
    ),
    area_inspected TEXT,
    inspector_name TEXT,
    findings TEXT,
    hazards_identified INT DEFAULT 0,
    immediate_actions_taken TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    overall_rating TEXT CHECK (
        overall_rating IN (
            'excellent',
            'satisfactory',
            'needs_improvement',
            'unsatisfactory'
        )
    ),
    next_inspection_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =========================================
-- 5. DISABILITY CLASSIFICATION (تصنيف الإعاقات)
-- =========================================
CREATE TABLE IF NOT EXISTS grc_disability_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    -- e.g., '1000', '1100', '1110'
    parent_code TEXT,
    category TEXT,
    -- 'physical', 'sensory', 'intellectual', 'psychiatric'
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    -- Requirements
    assistive_devices TEXT [],
    facility_requirements TEXT [],
    traffic_entitlements TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- =========================================
-- INDEXES & SECURITY
-- =========================================
-- Indexes
CREATE INDEX IF NOT EXISTS idx_risks_level ON grc_risks(risk_level);
CREATE INDEX IF NOT EXISTS idx_risks_status ON grc_risks(status);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON grc_compliance_requirements(compliance_status);
CREATE INDEX IF NOT EXISTS idx_incidents_date ON grc_safety_incidents(incident_date);
CREATE INDEX IF NOT EXISTS idx_bcp_status ON grc_bcp_scenarios(status);
-- RLS
ALTER TABLE grc_risk_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_standards ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_bcp_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_bcp_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_safety_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_safety_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_disability_codes ENABLE ROW LEVEL SECURITY;
-- Policies
CREATE POLICY "Allow all" ON grc_risk_categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_risks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_risk_assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_standards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_compliance_requirements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_audits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_bcp_scenarios FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_bcp_tests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_safety_incidents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_safety_inspections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON grc_disability_codes FOR ALL USING (true) WITH CHECK (true);
-- Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE grc_risks;
ALTER PUBLICATION supabase_realtime
ADD TABLE grc_safety_incidents;