-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 016: Declarative Range Partitioning for incident_reports
-- Project: Basira (نظام بصيرة)
-- Date: 2026-02-22
-- Purpose: Partition incident_reports by month for scalability
--
-- Strategy:
--   1. Rename old table to _old
--   2. Create new partitioned table with same schema
--   3. Create monthly partitions (past 6 months + next 6 months)
--   4. Migrate data from old table
--   5. Drop old table
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- STEP 1: Safety check — only proceed if old table exists
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'incident_reports'
    ) THEN
        RAISE NOTICE 'incident_reports table does not exist. Skipping migration.';
        RETURN;
    END IF;

    -- Check if already partitioned
    IF EXISTS (
        SELECT 1 FROM pg_partitioned_table pt
        JOIN pg_class c ON pt.partrelid = c.oid
        WHERE c.relname = 'incident_reports'
    ) THEN
        RAISE NOTICE 'incident_reports is already partitioned. Skipping.';
        RETURN;
    END IF;

    RAISE NOTICE 'Starting incident_reports partitioning...';
END $$;

-- ============================================================================
-- STEP 2: Rename existing table
-- ============================================================================
ALTER TABLE IF EXISTS incident_reports RENAME TO incident_reports_old;

-- ============================================================================
-- STEP 3: Create partitioned table with same schema
-- ============================================================================
CREATE TABLE incident_reports (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    beneficiary_id UUID REFERENCES beneficiaries(id),
    type TEXT NOT NULL,
    shift TEXT NOT NULL,
    description TEXT,
    action_taken TEXT,
    witnesses TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id, date)
) PARTITION BY RANGE (date);

-- ============================================================================
-- STEP 4: Create monthly partitions
-- Past 6 months + current + next 6 months = 13 partitions
-- ============================================================================
DO $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
    i INTEGER;
BEGIN
    FOR i IN -6..6 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' months')::INTERVAL)::DATE;
        end_date := (start_date + INTERVAL '1 month')::DATE;
        partition_name := 'incident_reports_' || to_char(start_date, 'YYYY_MM');

        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS %I PARTITION OF incident_reports FOR VALUES FROM (%L) TO (%L)',
            partition_name, start_date, end_date
        );

        RAISE NOTICE 'Created partition: % (% to %)', partition_name, start_date, end_date;
    END LOOP;
END $$;

-- Default partition for out-of-range dates
CREATE TABLE IF NOT EXISTS incident_reports_default
    PARTITION OF incident_reports DEFAULT;

-- ============================================================================
-- STEP 5: Migrate data from old table
-- ============================================================================
INSERT INTO incident_reports (id, date, beneficiary_id, type, shift, description, action_taken, witnesses, created_at, updated_at)
SELECT id, date, beneficiary_id, type, shift, description, action_taken, witnesses, created_at, updated_at
FROM incident_reports_old;

-- ============================================================================
-- STEP 6: Recreate indexes on partitioned table
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_incident_reports_date ON incident_reports (date);
CREATE INDEX IF NOT EXISTS idx_incident_reports_beneficiary ON incident_reports (beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_incident_reports_type ON incident_reports (type);

-- ============================================================================
-- STEP 7: Re-enable RLS and policies
-- ============================================================================
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read/write for all users"
    ON incident_reports FOR ALL USING (true) WITH CHECK (true);

GRANT ALL ON incident_reports TO anon;
GRANT ALL ON incident_reports TO authenticated;
GRANT ALL ON incident_reports TO service_role;

-- ============================================================================
-- STEP 8: Drop old table
-- ============================================================================
DROP TABLE IF EXISTS incident_reports_old;

-- ============================================================================
-- STEP 9: Create function to auto-create future partitions
-- Meant to be called by pg_cron monthly
-- ============================================================================
CREATE OR REPLACE FUNCTION create_incident_partitions_ahead()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
    i INTEGER;
BEGIN
    -- Create partitions for next 3 months ahead
    FOR i IN 1..3 LOOP
        start_date := date_trunc('month', CURRENT_DATE + (i || ' months')::INTERVAL)::DATE;
        end_date := (start_date + INTERVAL '1 month')::DATE;
        partition_name := 'incident_reports_' || to_char(start_date, 'YYYY_MM');

        IF NOT EXISTS (
            SELECT 1 FROM pg_class WHERE relname = partition_name
        ) THEN
            EXECUTE format(
                'CREATE TABLE %I PARTITION OF incident_reports FOR VALUES FROM (%L) TO (%L)',
                partition_name, start_date, end_date
            );
            RAISE NOTICE 'Created new partition: %', partition_name;
        END IF;
    END LOOP;
END;
$$;

-- Schedule monthly partition creation (1st of each month at 1 AM AST = 22:00 UTC)
-- Requires pg_cron from migration 015
DO $$ BEGIN
    PERFORM cron.schedule(
        'create-incident-partitions',
        '0 22 1 * *',
        $$SELECT create_incident_partitions_ahead()$$
    );
EXCEPTION
    WHEN undefined_function THEN
        RAISE NOTICE 'pg_cron not available. Run migration 015 first, then schedule manually.';
END $$;

DO $$ BEGIN
    RAISE NOTICE 'Migration 016: incident_reports partitioned by month successfully';
END $$;
