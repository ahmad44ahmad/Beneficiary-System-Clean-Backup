-- =====================================================
-- 013_quality_audit.sql
-- Internal Audit System (ISO 9001:2015)
-- =====================================================

-- 1. Audit Cycles (دورات التدقيق)
CREATE TABLE IF NOT EXISTS internal_audit_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_name TEXT NOT NULL,
    cycle_year INTEGER NOT NULL,
    cycle_quarter INTEGER CHECK (cycle_quarter BETWEEN 1 AND 4),
    planned_start_date DATE NOT NULL,
    planned_end_date DATE NOT NULL,
    actual_start_date DATE,
    actual_end_date DATE,
    lead_auditor TEXT,
    status TEXT DEFAULT 'planned' CHECK (
        status IN ('planned', 'in_progress', 'completed', 'cancelled')
    ),
    scope TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Individual Audits (التدقيقات الفردية)
CREATE TABLE IF NOT EXISTS internal_audits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cycle_id UUID REFERENCES internal_audit_cycles(id) ON DELETE CASCADE,
    audit_code TEXT UNIQUE NOT NULL,
    iso_clause TEXT NOT NULL,
    department TEXT NOT NULL,
    auditor_name TEXT NOT NULL,
    auditee_name TEXT,
    planned_date DATE,
    actual_date DATE,
    duration_hours DECIMAL(4, 1),
    status TEXT DEFAULT 'planned' CHECK (
        status IN ('planned', 'in_progress', 'completed', 'cancelled')
    ),
    overall_result TEXT CHECK (
        overall_result IN ('conforming', 'minor_nc', 'major_nc', 'observation', 'opportunity')
    ),
    checklist_data JSONB DEFAULT '{}',
    summary TEXT,
    strengths TEXT,
    ncr_ids JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_cycle ON internal_audits(cycle_id);
CREATE INDEX IF NOT EXISTS idx_audits_clause ON internal_audits(iso_clause);
CREATE INDEX IF NOT EXISTS idx_audits_status ON internal_audits(status);

-- 3. Audit Findings (نتائج التدقيق)
CREATE TABLE IF NOT EXISTS audit_findings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audit_id UUID REFERENCES internal_audits(id) ON DELETE CASCADE,
    finding_code TEXT NOT NULL,
    finding_type TEXT NOT NULL CHECK (
        finding_type IN ('major_nc', 'minor_nc', 'observation', 'opportunity', 'strength')
    ),
    iso_clause TEXT NOT NULL,
    description TEXT NOT NULL,
    evidence TEXT,
    root_cause TEXT,
    corrective_action TEXT,
    responsible_person TEXT,
    due_date DATE,
    completion_date DATE,
    verification_date DATE,
    verification_result TEXT,
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'action_planned', 'in_progress', 'completed', 'verified', 'closed')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_findings_audit ON audit_findings(audit_id);
CREATE INDEX IF NOT EXISTS idx_findings_type ON audit_findings(finding_type);
CREATE INDEX IF NOT EXISTS idx_findings_status ON audit_findings(status);

-- Enable RLS
ALTER TABLE internal_audit_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_findings ENABLE ROW LEVEL SECURITY;

-- Permissive policies for authenticated users
CREATE POLICY "Enable all access for authenticated users" ON internal_audit_cycles FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON internal_audits FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Enable all access for authenticated users" ON audit_findings FOR ALL TO authenticated USING (true) WITH CHECK (true);
