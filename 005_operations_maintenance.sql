-- 005_operations_maintenance.sql
-- Operations & Maintenance Module Schema (وحدة التشغيل والصيانة)
-- Aligned with هيئة عقارات الدولة Asset Management Standards
-- 1. Asset Categories (فئات الأصول)
CREATE TABLE IF NOT EXISTS om_asset_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    parent_id UUID REFERENCES om_asset_categories(id),
    color_code TEXT DEFAULT '#14415A',
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Asset Registry (سجل الأصول - aligned with نظام أصول)
CREATE TABLE IF NOT EXISTS om_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_code TEXT UNIQUE NOT NULL,
    -- Code format: CAT-YYYY-NNNN
    barcode TEXT,
    name_ar TEXT NOT NULL,
    name_en TEXT,
    description TEXT,
    -- Classification
    category_id UUID REFERENCES om_asset_categories(id),
    asset_type TEXT CHECK (asset_type IN ('fixed', 'movable', 'consumable')),
    -- Location
    building TEXT,
    floor TEXT,
    room TEXT,
    -- Financial (IPSAS Compliant)
    acquisition_date DATE,
    acquisition_cost DECIMAL(12, 2),
    current_book_value DECIMAL(12, 2),
    depreciation_rate DECIMAL(5, 2) DEFAULT 10.00,
    -- Annual %
    useful_life_years INT,
    salvage_value DECIMAL(12, 2),
    -- Warranty & Supplier
    supplier_name TEXT,
    warranty_start DATE,
    warranty_end DATE,
    -- Status
    status TEXT DEFAULT 'active' CHECK (
        status IN (
            'active',
            'under_maintenance',
            'out_of_service',
            'disposed',
            'transferred'
        )
    ),
    condition TEXT CHECK (
        condition IN ('excellent', 'good', 'fair', 'poor', 'unusable')
    ),
    -- Audit
    last_inspection_date DATE,
    next_inspection_date DATE,
    notes TEXT,
    photo_url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Maintenance Requests (طلبات الصيانة)
CREATE TABLE IF NOT EXISTS om_maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_number TEXT UNIQUE NOT NULL,
    -- Auto-generated: MR-YYYY-NNNN
    asset_id UUID REFERENCES om_assets(id),
    -- Request Details
    request_type TEXT CHECK (
        request_type IN (
            'corrective',
            'preventive',
            'emergency',
            'improvement'
        )
    ),
    priority TEXT DEFAULT 'medium' CHECK (
        priority IN ('low', 'medium', 'high', 'critical')
    ),
    title TEXT NOT NULL,
    description TEXT,
    -- Workflow
    reported_by UUID REFERENCES auth.users(id),
    assigned_to TEXT,
    assigned_contractor UUID REFERENCES catering_suppliers(id),
    -- Reusing suppliers table
    status TEXT DEFAULT 'pending' CHECK (
        status IN (
            'pending',
            'approved',
            'in_progress',
            'on_hold',
            'completed',
            'cancelled',
            'rejected'
        )
    ),
    -- Dates
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    target_completion DATE,
    actual_completion DATE,
    -- Cost
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    -- Quality
    quality_rating INT CHECK (
        quality_rating BETWEEN 1 AND 5
    ),
    completion_notes TEXT,
    -- Signatures
    approved_by UUID REFERENCES auth.users(id),
    approved_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. Preventive Maintenance Schedule (جدول الصيانة الوقائية)
CREATE TABLE IF NOT EXISTS om_preventive_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES om_assets(id),
    task_name TEXT NOT NULL,
    task_description TEXT,
    frequency TEXT CHECK (
        frequency IN (
            'daily',
            'weekly',
            'monthly',
            'quarterly',
            'semi_annual',
            'annual'
        )
    ),
    -- Schedule
    next_due_date DATE NOT NULL,
    last_completed_date DATE,
    -- Assignment
    assigned_team TEXT,
    estimated_duration_hours DECIMAL(5, 2),
    -- Compliance
    is_mandatory BOOLEAN DEFAULT FALSE,
    compliance_standard TEXT,
    -- e.g., 'OSHA', 'ISO', 'هيئة عقارات الدولة'
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. Waste Management Records (سجلات إدارة المخلفات)
CREATE TABLE IF NOT EXISTS om_waste_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Waste Classification
    waste_type TEXT CHECK (
        waste_type IN (
            'general',
            'recyclable',
            'hazardous',
            'medical',
            'electronic',
            'confidential'
        )
    ),
    waste_category TEXT,
    -- Source
    source_department TEXT,
    source_location TEXT,
    -- Quantity
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT DEFAULT 'kg',
    -- Disposal
    disposal_method TEXT CHECK (
        disposal_method IN (
            'landfill',
            'recycling',
            'incineration',
            'special_treatment',
            'reuse'
        )
    ),
    disposal_date DATE,
    contractor_name TEXT,
    contractor_license TEXT,
    -- Compliance
    ewc_code TEXT,
    -- European Waste Classification code
    manifest_number TEXT,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 6. Maintenance Evaluations (تقييم أداء الصيانة)
CREATE TABLE IF NOT EXISTS om_maintenance_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    -- Scope
    evaluation_period_start DATE,
    evaluation_period_end DATE,
    contractor_id UUID REFERENCES catering_suppliers(id),
    -- Criteria (من نموذج تقييم أداء الصيانة)
    response_time_score INT CHECK (
        response_time_score BETWEEN 1 AND 5
    ),
    quality_score INT CHECK (
        quality_score BETWEEN 1 AND 5
    ),
    safety_compliance_score INT CHECK (
        safety_compliance_score BETWEEN 1 AND 5
    ),
    documentation_score INT CHECK (
        documentation_score BETWEEN 1 AND 5
    ),
    cost_efficiency_score INT CHECK (
        cost_efficiency_score BETWEEN 1 AND 5
    ),
    overall_score DECIMAL(3, 2) GENERATED ALWAYS AS (
        (
            response_time_score + quality_score + safety_compliance_score + documentation_score + cost_efficiency_score
        ) / 5.0
    ) STORED,
    -- Findings
    strengths TEXT,
    areas_for_improvement TEXT,
    recommendations TEXT,
    -- Penalties (linked to Quality module)
    penalty_amount DECIMAL(10, 2) DEFAULT 0,
    evaluated_by UUID REFERENCES auth.users(id),
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 7. Skills Matrix (مصفوفة متطلبات المهارات)
CREATE TABLE IF NOT EXISTS om_skills_matrix (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    system_category TEXT NOT NULL,
    -- e.g., 'HVAC', 'Electrical', 'Plumbing'
    skill_name TEXT NOT NULL,
    skill_level INT CHECK (
        skill_level BETWEEN 1 AND 4
    ),
    -- 1=Basic, 2=Intermediate, 3=Advanced, 4=Expert
    skill_source TEXT CHECK (
        skill_source IN ('internal', 'contractor', 'specialist')
    ),
    certification_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- INDEXES for Performance
CREATE INDEX IF NOT EXISTS idx_assets_category ON om_assets(category_id);
CREATE INDEX IF NOT EXISTS idx_assets_status ON om_assets(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON om_maintenance_requests(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_asset ON om_maintenance_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_preventive_due ON om_preventive_schedules(next_due_date);
CREATE INDEX IF NOT EXISTS idx_waste_date ON om_waste_records(record_date);
-- RLS Policies
ALTER TABLE om_asset_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_preventive_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_waste_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_maintenance_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE om_skills_matrix ENABLE ROW LEVEL SECURITY;
-- Allow authenticated users
CREATE POLICY "Allow authenticated" ON om_asset_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_maintenance_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_preventive_schedules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_waste_records FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_maintenance_evaluations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated" ON om_skills_matrix FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- Enable Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE om_maintenance_requests;