CREATE TABLE IF NOT EXISTS public.catering_daily_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (
        status IN (
            'draft',
            'pending_approval',
            'approved',
            'rejected'
        )
    ),
    signatures JSONB DEFAULT '{}'::jsonb,
    general_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(report_date)
);
ALTER TABLE public.catering_daily_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated full access" ON public.catering_daily_reports FOR ALL TO authenticated USING (true) WITH CHECK (true);