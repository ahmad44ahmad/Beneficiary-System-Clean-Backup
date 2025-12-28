-- 003_catering_inventory.sql
-- Catering Inventory Management Schema (Zero Paper Foundation)
-- 1. Inventory Categories (e.g., Vegetables, Meat)
CREATE TABLE IF NOT EXISTS catering_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    name_en TEXT,
    color_code TEXT DEFAULT '#000000',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Units of Measurement (e.g., Kg, Box)
CREATE TABLE IF NOT EXISTS catering_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    symbol TEXT NOT NULL,
    -- e.g. 'kg'
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Raw Materials (The Items)
CREATE TABLE IF NOT EXISTS catering_raw_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    -- SKU or Barcode
    name_ar TEXT NOT NULL,
    name_en TEXT,
    category_id UUID REFERENCES catering_categories(id),
    unit_id UUID REFERENCES catering_units(id),
    min_stock DECIMAL(10, 2) DEFAULT 0,
    max_stock DECIMAL(10, 2),
    daily_quota DECIMAL(10, 2) DEFAULT 0,
    -- Expected daily consumption per resident
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 4. Inventory Transactions (Unified Log for Receipts, Waste, Usage)
CREATE TABLE IF NOT EXISTS catering_inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES catering_raw_materials(id),
    transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
    transaction_type TEXT CHECK (
        transaction_type IN (
            'receipt',
            'waste',
            'consumption',
            'opening_balance',
            'substitution',
            'audit_adjustment'
        )
    ),
    quantity DECIMAL(12, 2) NOT NULL,
    -- Positive for add, Negative for remove? Or strictly absolute and logic handles it? 
    -- Let's stick to: Inputs are positive (receipts), Outputs are recorded as positive but subtracted in logic, OR simplified:
    -- Standard: All quantities absolute. Type determines arithmetic.
    supplier_id UUID REFERENCES catering_suppliers(id),
    -- For receipts
    invoice_number TEXT,
    -- For receipts
    reason TEXT,
    -- For waste/substitution
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 5. Daily Inventory Snapshot (Closing Balance)
CREATE TABLE IF NOT EXISTS catering_daily_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_id UUID REFERENCES catering_raw_materials(id),
    inventory_date DATE NOT NULL DEFAULT CURRENT_DATE,
    opening_balance DECIMAL(12, 2) DEFAULT 0,
    total_in DECIMAL(12, 2) DEFAULT 0,
    -- Receipts
    total_out DECIMAL(12, 2) DEFAULT 0,
    -- Consumption + Waste
    closing_balance DECIMAL(12, 2) GENERATED ALWAYS AS (opening_balance + total_in - total_out) STORED,
    physical_count DECIMAL(12, 2),
    -- Actual count if different
    variance DECIMAL(12, 2) GENERATED ALWAYS AS (
        physical_count - (opening_balance + total_in - total_out)
    ) STORED,
    status TEXT DEFAULT 'draft',
    -- draft, locked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(material_id, inventory_date)
);
-- 6. Alerts View (Low Stock)
CREATE OR REPLACE VIEW v_catering_low_stock AS
SELECT m.id,
    m.name_ar,
    m.min_stock,
    latest.closing_balance
FROM catering_raw_materials m
    JOIN (
        SELECT material_id,
            closing_balance
        FROM catering_daily_inventory
        WHERE inventory_date = CURRENT_DATE
    ) latest ON m.id = latest.material_id
WHERE latest.closing_balance <= m.min_stock;
-- RLS
ALTER TABLE catering_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_raw_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_daily_inventory ENABLE ROW LEVEL SECURITY;
-- Policies (Simplified for prototype)
CREATE POLICY "Allow all auth users" ON catering_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth users" ON catering_units FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth users" ON catering_raw_materials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth users" ON catering_inventory_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow all auth users" ON catering_daily_inventory FOR ALL TO authenticated USING (true) WITH CHECK (true);