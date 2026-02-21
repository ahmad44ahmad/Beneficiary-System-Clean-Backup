-- =====================================================
-- 012_ipc_expansion.sql
-- IPC Module Expansion: BICSL, Occupational Exposure, Outbreaks
-- =====================================================

-- 1. BICSL Certifications (رخصة BICSL)
CREATE TABLE IF NOT EXISTS bicsl_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_name TEXT NOT NULL,
    employee_id UUID,
    department TEXT,
    competencies JSONB NOT NULL DEFAULT '{
        "hand_hygiene": null,
        "ppe_usage": null,
        "waste_management": null,
        "isolation_precautions": null,
        "sharps_safety": null,
        "environmental_cleaning": null,
        "outbreak_response": null
    }'::JSONB,
    competencies_passed INTEGER DEFAULT 0,
    total_competencies INTEGER DEFAULT 7,
    is_certified BOOLEAN DEFAULT false,
    certification_date DATE,
    expiry_date DATE,
    renewal_alert_sent BOOLEAN DEFAULT false,
    assessor_name TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bicsl_employee ON bicsl_certifications(employee_id);
CREATE INDEX IF NOT EXISTS idx_bicsl_expiry ON bicsl_certifications(expiry_date);
CREATE INDEX IF NOT EXISTS idx_bicsl_certified ON bicsl_certifications(is_certified);

-- 2. Occupational Exposures (التعرض المهني)
CREATE TABLE IF NOT EXISTS occupational_exposures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_code TEXT,
    incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
    incident_time TIME DEFAULT CURRENT_TIME,
    employee_name TEXT NOT NULL,
    employee_id UUID,
    department TEXT,
    exposure_type TEXT NOT NULL CHECK (
        exposure_type IN ('needlestick_hollow', 'needlestick_solid', 'splash_mucous', 'splash_skin', 'bite', 'other')
    ),
    body_part_affected TEXT,
    source_known BOOLEAN DEFAULT false,
    source_patient_id UUID,
    source_status TEXT CHECK (
        source_status IN ('positive', 'negative', 'unknown')
    ),
    fluid_type TEXT CHECK (
        fluid_type IN ('blood', 'csf', 'pleural', 'saliva_blood', 'other')
    ),
    first_aid_performed BOOLEAN DEFAULT false,
    first_aid_steps JSONB DEFAULT '[]',
    baseline_labs JSONB DEFAULT '{}',
    followup_labs_6week JSONB DEFAULT '{}',
    followup_labs_3month JSONB DEFAULT '{}',
    followup_labs_6month JSONB DEFAULT '{}',
    pep_recommended BOOLEAN DEFAULT false,
    pep_started BOOLEAN DEFAULT false,
    pep_start_date DATE,
    pep_regimen TEXT,
    pep_completed BOOLEAN DEFAULT false,
    risk_assessment TEXT CHECK (
        risk_assessment IN ('low', 'moderate', 'high')
    ),
    status TEXT DEFAULT 'reported' CHECK (
        status IN ('reported', 'first_aid_done', 'labs_pending', 'pep_started', 'monitoring', 'cleared', 'seroconverted')
    ),
    reported_to_supervisor BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_occ_exp_date ON occupational_exposures(incident_date DESC);
CREATE INDEX IF NOT EXISTS idx_occ_exp_status ON occupational_exposures(status);
CREATE INDEX IF NOT EXISTS idx_occ_exp_employee ON occupational_exposures(employee_id);

-- 3. Outbreaks (التفشي)
CREATE TABLE IF NOT EXISTS outbreaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbreak_code TEXT UNIQUE NOT NULL,
    detection_date DATE NOT NULL DEFAULT CURRENT_DATE,
    detection_method TEXT CHECK (
        detection_method IN ('auto_detected', 'manual_report', 'lab_cluster', 'surveillance')
    ),
    pathogen TEXT,
    infection_type TEXT,
    severity TEXT DEFAULT 'moderate' CHECK (
        severity IN ('low', 'moderate', 'high', 'critical')
    ),
    affected_location_ids JSONB DEFAULT '[]',
    primary_location TEXT,
    initial_case_count INTEGER DEFAULT 1,
    current_case_count INTEGER DEFAULT 1,
    staff_affected INTEGER DEFAULT 0,
    beneficiaries_affected INTEGER DEFAULT 0,
    containment_status TEXT DEFAULT 'active' CHECK (
        containment_status IN ('active', 'contained', 'resolved', 'escalated')
    ),
    containment_measures JSONB DEFAULT '[]',
    moh_notified BOOLEAN DEFAULT false,
    moh_notification_date DATE,
    moh_reference_number TEXT,
    linked_incident_ids JSONB DEFAULT '[]',
    declared_by TEXT,
    resolved_date DATE,
    resolved_by TEXT,
    after_action_report TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_outbreaks_date ON outbreaks(detection_date DESC);
CREATE INDEX IF NOT EXISTS idx_outbreaks_status ON outbreaks(containment_status);

-- 4. Outbreak Contacts (تتبع المخالطين)
CREATE TABLE IF NOT EXISTS outbreak_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outbreak_id UUID REFERENCES outbreaks(id) ON DELETE CASCADE,
    contact_type TEXT CHECK (
        contact_type IN ('beneficiary', 'staff', 'visitor')
    ),
    contact_name TEXT NOT NULL,
    beneficiary_id UUID,
    employee_id UUID,
    exposure_date DATE,
    exposure_level TEXT CHECK (
        exposure_level IN ('close', 'casual', 'indirect')
    ),
    location TEXT,
    monitoring_status TEXT DEFAULT 'active' CHECK (
        monitoring_status IN ('active', 'symptomatic', 'cleared', 'infected')
    ),
    monitoring_end_date DATE,
    symptoms_onset_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ob_contacts_outbreak ON outbreak_contacts(outbreak_id);
CREATE INDEX IF NOT EXISTS idx_ob_contacts_status ON outbreak_contacts(monitoring_status);

-- Enable RLS
ALTER TABLE bicsl_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupational_exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbreaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE outbreak_contacts ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users
CREATE POLICY "Enable all access for authenticated users" ON bicsl_certifications FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON occupational_exposures FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON outbreaks FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON outbreak_contacts FOR ALL TO authenticated USING (true) WITH CHECK (true);
