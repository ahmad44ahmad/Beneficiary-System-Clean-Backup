-- Create incident_reports table
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id),
    type TEXT NOT NULL,
    shift TEXT NOT NULL,
    description TEXT,
    action_taken TEXT,
    witnesses TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
-- Create policies (allow all for now for development simplicity, matching other tables)
CREATE POLICY "Enable read/write for all users" ON incident_reports FOR ALL USING (true) WITH CHECK (true);
-- Grant permissions
GRANT ALL ON incident_reports TO anon;
GRANT ALL ON incident_reports TO authenticated;
GRANT ALL ON incident_reports TO service_role;