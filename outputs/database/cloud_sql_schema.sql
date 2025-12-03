-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users & Roles (Adapted for Firebase Auth)
CREATE TABLE users (
    id VARCHAR(128) PRIMARY KEY, -- Firebase UID
    email VARCHAR(255) NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK (role IN ('admin', 'doctor', 'social_worker', 'nurse', 'specialist', 'director', 'manager')) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Beneficiaries (Core)
CREATE TABLE beneficiaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    national_id TEXT UNIQUE,
    gender TEXT CHECK (gender IN ('male', 'female')),
    dob DATE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'exit', 'transferred')),
    room_number TEXT,
    bed_number TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Medical Profiles
CREATE TABLE medical_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    blood_type TEXT,
    allergies TEXT[],
    chronic_diseases TEXT[],
    disabilities TEXT[],
    dietary_restrictions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Medical Examinations
CREATE TABLE medical_examinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    doctor_id VARCHAR(128) REFERENCES users(id),
    exam_date TIMESTAMPTZ DEFAULT NOW(),
    diagnosis TEXT,
    symptoms TEXT,
    treatment_plan TEXT,
    vital_signs JSONB, -- { bp, pulse, temp, resp }
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vaccinations
CREATE TABLE vaccinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    vaccine_name TEXT NOT NULL,
    dose_number INTEGER,
    date_given DATE,
    next_due_date DATE,
    status TEXT CHECK (status IN ('given', 'pending', 'overdue')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Rehabilitation Plans
CREATE TABLE rehabilitation_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    created_by VARCHAR(128) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Rehabilitation Goals (SMART Goals)
CREATE TABLE rehabilitation_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES rehabilitation_plans(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('medical', 'social', 'psychological', 'physiotherapy', 'occupational')),
    target_date DATE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'achieved', 'delayed')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Interventions
CREATE TABLE interventions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID REFERENCES rehabilitation_goals(id) ON DELETE CASCADE,
    activity_name TEXT NOT NULL,
    frequency TEXT, -- e.g., "Daily", "Weekly"
    duration TEXT, -- e.g., "30 mins"
    assigned_to VARCHAR(128) REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Case Studies
CREATE TABLE case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    researcher_id VARCHAR(128) REFERENCES users(id),
    study_date DATE DEFAULT CURRENT_DATE,
    background_history TEXT,
    social_status TEXT,
    economic_status TEXT,
    housing_condition TEXT,
    recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Social Research
CREATE TABLE social_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    researcher_id VARCHAR(128) REFERENCES users(id),
    research_date DATE DEFAULT CURRENT_DATE,
    family_composition JSONB,
    guardian_info JSONB,
    social_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Visit Logs
CREATE TABLE visit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    visitor_name TEXT NOT NULL,
    relation TEXT,
    visit_date TIMESTAMPTZ DEFAULT NOW(),
    visit_type TEXT CHECK (visit_type IN ('internal', 'external', 'phone', 'behavioral', 'emergency')),
    notes TEXT,
    recorded_by VARCHAR(128) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Leave Requests
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    request_type TEXT CHECK (request_type IN ('home_visit', 'hospital', 'picnic', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    guardian_name TEXT,
    guardian_phone TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'completed', 'overdue')),
    approved_by VARCHAR(128) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Family Case Studies
CREATE TABLE family_case_studies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    study_date DATE DEFAULT CURRENT_DATE,
    family_dynamics TEXT,
    challenges TEXT,
    support_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Inventory
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 10,
    unit TEXT,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Inventory Transactions
CREATE TABLE inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inventory_id UUID REFERENCES inventory(id) ON DELETE CASCADE,
    transaction_type TEXT CHECK (transaction_type IN ('in', 'out', 'adjustment')),
    quantity INTEGER NOT NULL,
    reason TEXT,
    performed_by VARCHAR(128) REFERENCES users(id),
    transaction_date TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Clothing Requests
CREATE TABLE clothing_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    season TEXT CHECK (season IN ('summer', 'winter', 'eid', 'other')),
    request_date DATE DEFAULT CURRENT_DATE,
    items JSONB NOT NULL, -- Array of {item, size, quantity}
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'dispensed')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Assets
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    asset_tag TEXT UNIQUE,
    category TEXT,
    location TEXT,
    condition TEXT CHECK (condition IN ('new', 'good', 'fair', 'poor', 'damaged', 'retired')),
    purchase_date DATE,
    value DECIMAL(10, 2),
    custody_of VARCHAR(128) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Maintenance Tickets
CREATE TABLE maintenance_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    reported_by VARCHAR(128) REFERENCES users(id),
    issue_description TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved')),
    assigned_to VARCHAR(128) REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Daily Shift Records
CREATE TABLE daily_shift_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_date DATE DEFAULT CURRENT_DATE,
    shift_period TEXT CHECK (shift_period IN ('first', 'second', 'third', 'fourth')),
    supervisor_id VARCHAR(128) REFERENCES users(id),
    notes TEXT,
    staff_attendance JSONB,
    meal_records JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Injury Reports
CREATE TABLE injury_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
    incident_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    injury_type TEXT,
    description TEXT,
    first_aid_given TEXT,
    hospital_transfer BOOLEAN DEFAULT FALSE,
    reported_by VARCHAR(128) REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Risks
CREATE TABLE risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    description TEXT NOT NULL,
    category TEXT,
    likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER CHECK (impact BETWEEN 1 AND 5),
    mitigation_plan TEXT,
    owner_id VARCHAR(128) REFERENCES users(id),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Audit Records
CREATE TABLE audit_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_date DATE DEFAULT CURRENT_DATE,
    auditor_id VARCHAR(128) REFERENCES users(id),
    scope TEXT,
    findings JSONB, -- Array of findings
    status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Activity Logs (Audit Trail)
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(128) REFERENCES users(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Views
CREATE VIEW active_beneficiaries_summary AS
SELECT 
    b.id,
    b.full_name,
    b.room_number,
    mp.diagnosis,
    rp.status as plan_status
FROM beneficiaries b
LEFT JOIN medical_examinations mp ON b.id = mp.beneficiary_id
LEFT JOIN rehabilitation_plans rp ON b.id = rp.beneficiary_id AND rp.status = 'active'
WHERE b.status = 'active';

CREATE VIEW low_stock_items AS
SELECT * FROM inventory WHERE quantity <= min_quantity;

CREATE VIEW critical_risks AS
SELECT * FROM risks WHERE (likelihood * impact) >= 15;
