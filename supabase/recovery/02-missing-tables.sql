-- ═══════════════════════════════════════════════════════════════════════════
-- Missing Tables — referenced by the deployed app but not recreated by v3
-- ═══════════════════════════════════════════════════════════════════════════
-- The basira_v3_* migrations dropped and recreated ~37 tables but never
-- recreated these domain tables. The production frontend bundle issues
-- .from('<table>') queries against all of them, so they must exist even as
-- empty stubs or the corresponding views show a spinner forever.
-- ═══════════════════════════════════════════════════════════════════════════

-- Operations & Maintenance (from 005_operations_maintenance.sql, FK-free stubs)
CREATE TABLE IF NOT EXISTS om_asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE,
    name_ar TEXT,
    name_en TEXT,
    parent_id UUID,
    color_code TEXT DEFAULT '#14415A',
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT,
    barcode TEXT,
    name_ar TEXT,
    name_en TEXT,
    description TEXT,
    category_id UUID,
    asset_type TEXT,
    building TEXT,
    floor TEXT,
    room TEXT,
    acquisition_date DATE,
    acquisition_cost DECIMAL(12, 2),
    current_book_value DECIMAL(12, 2),
    depreciation_rate DECIMAL(5, 2) DEFAULT 10.00,
    useful_life_years INT,
    salvage_value DECIMAL(12, 2),
    supplier_name TEXT,
    warranty_start DATE,
    warranty_end DATE,
    status TEXT DEFAULT 'active',
    condition TEXT,
    last_inspection_date DATE,
    next_inspection_date DATE,
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT,
    asset_id UUID,
    request_type TEXT,
    priority TEXT DEFAULT 'medium',
    title TEXT,
    description TEXT,
    assigned_to TEXT,
    status TEXT DEFAULT 'pending',
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    target_completion DATE,
    actual_completion DATE,
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    quality_rating INT,
    completion_notes TEXT,
    approved_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS om_preventive_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID,
    task_name TEXT,
    task_description TEXT,
    frequency TEXT,
    next_due_date DATE,
    last_completed_date DATE,
    assigned_team TEXT,
    estimated_duration_hours DECIMAL(5, 2),
    is_mandatory BOOLEAN DEFAULT FALSE,
    compliance_standard TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Catering
CREATE TABLE IF NOT EXISTS daily_meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT,
    national_id TEXT,
    meal_date DATE NOT NULL,
    meal_type TEXT,
    meal_items JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'pending',
    delivered_at TIMESTAMPTZ,
    served_by TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dietary_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT,
    national_id TEXT,
    plan_name TEXT,
    dietary_restrictions JSONB DEFAULT '[]'::jsonb,
    allergies JSONB DEFAULT '[]'::jsonb,
    special_requirements TEXT,
    calories_per_day INTEGER,
    protein_grams DECIMAL(6,2),
    carbs_grams DECIMAL(6,2),
    fats_grams DECIMAL(6,2),
    meals_per_day INTEGER DEFAULT 3,
    notes TEXT,
    effective_from DATE,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT,
    national_id TEXT,
    record_type TEXT,
    record_date DATE,
    diagnosis TEXT,
    symptoms TEXT,
    treatment TEXT,
    medications JSONB DEFAULT '[]'::jsonb,
    vital_signs JSONB,
    physician_name TEXT,
    follow_up_date DATE,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Rehabilitation
CREATE TABLE IF NOT EXISTS rehab_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT,
    national_id TEXT,
    plan_type TEXT,
    start_date DATE,
    end_date DATE,
    goals JSONB DEFAULT '[]'::jsonb,
    therapy_types JSONB DEFAULT '[]'::jsonb,
    frequency_per_week INTEGER,
    responsible_therapist TEXT,
    progress_notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Research
CREATE TABLE IF NOT EXISTS social_research (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id TEXT,
    national_id TEXT,
    research_date DATE,
    family_background TEXT,
    economic_situation TEXT,
    housing_conditions TEXT,
    family_members JSONB DEFAULT '[]'::jsonb,
    social_support TEXT,
    recommendations TEXT,
    social_worker TEXT,
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
