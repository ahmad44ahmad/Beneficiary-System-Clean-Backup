-- Create shift_handover_items table
CREATE TABLE IF NOT EXISTS shift_handover_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category TEXT NOT NULL CHECK (
        category IN ('critical', 'medication', 'care', 'pending')
    ),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id),
    priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
    shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'evening', 'night')),
    status TEXT NOT NULL CHECK (status IN ('active', 'completed')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT NOT NULL -- Store user name or ID
);
-- Enable Row Level Security
ALTER TABLE shift_handover_items ENABLE ROW LEVEL SECURITY;
-- Create policy to allow authenticated users to read all items
CREATE POLICY "Allow authenticated users to read shift items" ON shift_handover_items FOR
SELECT TO authenticated USING (true);
-- Create policy to allow authenticated users to insert items
CREATE POLICY "Allow authenticated users to insert shift items" ON shift_handover_items FOR
INSERT TO authenticated WITH CHECK (true);
-- Create policy to allow authenticated users to update items
CREATE POLICY "Allow authenticated users to update shift items" ON shift_handover_items FOR
UPDATE TO authenticated USING (true);
-- Create policy to allow authenticated users to delete items
CREATE POLICY "Allow authenticated users to delete shift items" ON shift_handover_items FOR DELETE TO authenticated USING (true);
-- Create real-time subscription
ALTER PUBLICATION supabase_realtime
ADD TABLE shift_handover_items;