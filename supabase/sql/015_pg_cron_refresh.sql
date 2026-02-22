-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 015: pg_cron Scheduled Refresh for Materialized Views
-- Project: Basira (نظام بصيرة)
-- Date: 2026-02-22
-- Purpose: Automatic periodic refresh of wellbeing materialized views
--
-- PREREQUISITE: Enable pg_cron extension in Supabase Dashboard:
--   Dashboard > Database > Extensions > search "pg_cron" > Enable
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- STEP 1: Enable pg_cron extension
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage to postgres role
GRANT USAGE ON SCHEMA cron TO postgres;

-- ============================================================================
-- STEP 2: Schedule wellbeing views refresh every 5 minutes
-- Uses the function created in migration 014
-- ============================================================================
SELECT cron.schedule(
    'refresh-wellbeing-views',           -- job name
    '*/5 * * * *',                       -- every 5 minutes
    $$SELECT refresh_wellbeing_materialized_views()$$
);

-- ============================================================================
-- STEP 3: Schedule daily full ANALYZE on key tables (2 AM Saudi time = 23:00 UTC)
-- Keeps query planner statistics fresh
-- ============================================================================
SELECT cron.schedule(
    'analyze-key-tables',
    '0 23 * * *',                        -- daily at 23:00 UTC (2 AM AST)
    $$
    ANALYZE beneficiaries;
    ANALYZE daily_care_logs;
    ANALYZE daily_meals;
    ANALYZE fall_risk_assessments;
    ANALYZE incident_reports;
    ANALYZE audit_logs;
    $$
);

-- ============================================================================
-- STEP 4: Schedule weekly cleanup of old cron job logs (Sunday 3 AM AST)
-- ============================================================================
SELECT cron.schedule(
    'cleanup-cron-logs',
    '0 0 * * 0',                         -- every Sunday at midnight UTC
    $$DELETE FROM cron.job_run_details WHERE end_time < NOW() - INTERVAL '7 days'$$
);

-- ============================================================================
-- Verification: List all scheduled jobs
-- ============================================================================
DO $$ BEGIN
    RAISE NOTICE 'Migration 015: pg_cron jobs scheduled. Verify with: SELECT * FROM cron.job;';
END $$;
