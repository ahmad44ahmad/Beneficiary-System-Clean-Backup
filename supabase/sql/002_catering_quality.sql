-- 002_catering_quality.sql
-- Schema for Catering Quality Assurance & Contractor Management
-- 1. Suppliers (Contractors) Table
CREATE TABLE IF NOT EXISTS catering_suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_person TEXT,
    phone TEXT,
    email TEXT,
    contract_start DATE,
    contract_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Evaluation Criteria (The Checklist Questions)
CREATE TABLE IF NOT EXISTS evaluation_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category TEXT NOT NULL,
    -- e.g., 'Hygiene', 'Food Quality', 'Staff'
    question TEXT NOT NULL,
    max_score INTEGER DEFAULT 10,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Daily Evaluations (The Audit Record)
CREATE TABLE IF NOT EXISTS contractor_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES catering_suppliers(id),
    evaluator_id UUID REFERENCES auth.users(id),
    -- If using Supabase Auth
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Scores & Penalties
    total_score INTEGER,
    total_penalty_amount DECIMAL(10, 2) DEFAULT 0.00,
    -- Qualitative Data
    notes TEXT,
    staff_observations TEXT,
    -- AI Enhancement
    ai_enhanced_summary TEXT,
    -- Stores the Gemini-polished version
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. Evaluation Items (Individual Answers)
CREATE TABLE IF NOT EXISTS evaluation_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID REFERENCES contractor_evaluations(id) ON DELETE CASCADE,
    criteria_id UUID REFERENCES evaluation_criteria(id),
    status TEXT CHECK (
        status IN ('compliant', 'marketing_note', 'non_compliant')
    ),
    deduction_amount DECIMAL(10, 2) DEFAULT 0.00,
    observation_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS Policies (Enable Read/Write for Authenticated Users)
ALTER TABLE catering_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read suppliers" ON catering_suppliers FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert evaluations" ON contractor_evaluations FOR
INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated read evaluations" ON contractor_evaluations FOR
SELECT TO authenticated USING (true);