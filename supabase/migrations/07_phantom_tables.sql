-- ═══════════════════════════════════════════════════════════════════════════════
-- MIGRATION 07: Phantom tables — referenced by code but never authored
-- Authored 2026-05-08 to resolve console 404s on dashboard load.
--   1. medication_schedules    (used by useMedications.ts, MedicationReminderAlert.tsx)
--   2. beneficiary_preferences (used by empowermentService.ts)
--   3. rehab_goals             (used by empowermentService.ts)
-- All idempotent. Safe to re-run.
-- NOTE: beneficiary_id is TEXT (not UUID) — beneficiaries.id is text in this DB.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. medication_schedules ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medication_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT REFERENCES beneficiaries(id) ON DELETE CASCADE,
    medication_name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    times TEXT[],
    scheduled_time TEXT,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    notes TEXT,
    status TEXT DEFAULT 'active' CHECK (
        status IN ('active', 'paused', 'completed', 'pending')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_med_schedules_beneficiary
    ON medication_schedules (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_med_schedules_status
    ON medication_schedules (status);
ALTER TABLE medication_schedules ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for medication_schedules" ON medication_schedules;
CREATE POLICY "Allow all for medication_schedules"
    ON medication_schedules FOR ALL USING (true);

-- ─── 2. beneficiary_preferences ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS beneficiary_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT UNIQUE REFERENCES beneficiaries(id) ON DELETE CASCADE,
    preferred_name TEXT,
    preferred_title TEXT,
    communication_style TEXT,
    preferred_activities TEXT[],
    hobbies TEXT[],
    strengths TEXT[],
    favorite_foods TEXT[],
    calming_strategies TEXT[],
    motivators TEXT[],
    what_makes_me_happy TEXT,
    what_makes_me_upset TEXT,
    my_dreams TEXT,
    wake_up_time TIME,
    sleep_time TIME,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE beneficiary_preferences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for beneficiary_preferences" ON beneficiary_preferences;
CREATE POLICY "Allow all for beneficiary_preferences"
    ON beneficiary_preferences FOR ALL USING (true);

-- ─── 3. rehab_goals ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS rehab_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT REFERENCES beneficiaries(id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    goal_title TEXT NOT NULL,
    goal_description TEXT,
    measurement_type TEXT,
    measurement_unit TEXT,
    baseline_value NUMERIC,
    target_value NUMERIC,
    current_value NUMERIC,
    quality_of_life_dimension TEXT,
    start_date DATE,
    target_date DATE,
    assigned_to TEXT,
    assigned_department TEXT,
    status TEXT DEFAULT 'planned' CHECK (
        status IN (
            'planned', 'in_progress', 'achieved',
            'partially_achieved', 'on_hold', 'abandoned', 'revised'
        )
    ),
    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    achievement_evidence TEXT,
    barriers_notes TEXT,
    family_involvement TEXT,
    linked_national_goal TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_rehab_goals_beneficiary
    ON rehab_goals (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_rehab_goals_status
    ON rehab_goals (status);
ALTER TABLE rehab_goals ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow all for rehab_goals" ON rehab_goals;
CREATE POLICY "Allow all for rehab_goals"
    ON rehab_goals FOR ALL USING (true);
