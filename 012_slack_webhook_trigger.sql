-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 012: Slack Webhook Trigger for Critical Incidents
-- Project: Basira (نظام بصيرة)
-- Date: 2026-02-22
-- Purpose: Automatically notify Slack #medical-emergencies channel
--          when a critical incident is inserted into incident_reports.
--
-- Dependencies:
--   - pg_net extension (available on Supabase) for async HTTP calls
--   - Edge Function: supabase/functions/slack-incident-alert
--   - App settings: app.supabase_url, app.service_role_key
--
-- Notes:
--   - Only triggers for severity = 'CRITICAL'
--   - Uses net.http_post() for non-blocking async HTTP POST
--   - SECURITY DEFINER to ensure the function has sufficient privileges
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- STEP 1: Ensure pg_net extension is enabled
-- pg_net provides async HTTP functions (net.http_post, net.http_get)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ============================================================================
-- STEP 2: Create the trigger function
-- Called AFTER INSERT on incident_reports when severity is CRITICAL.
-- Makes an async HTTP POST to the slack-incident-alert Edge Function.
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_critical_incident()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for CRITICAL severity incidents
    IF NEW.severity = 'CRITICAL' THEN
        PERFORM net.http_post(
            url := current_setting('app.supabase_url') || '/functions/v1/slack-incident-alert',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer ' || current_setting('app.service_role_key')
            ),
            body := jsonb_build_object(
                'record', row_to_json(NEW),
                'type', 'INSERT'
            )
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- STEP 3: Create the trigger on incident_reports
-- Fires AFTER INSERT for each row, so the record is already committed
-- before the Edge Function is invoked asynchronously.
-- ============================================================================
DROP TRIGGER IF EXISTS on_critical_incident_insert ON incident_reports;

CREATE TRIGGER on_critical_incident_insert
    AFTER INSERT ON incident_reports
    FOR EACH ROW
    EXECUTE FUNCTION notify_critical_incident();

-- ============================================================================
-- STEP 4: Grant execute permission on the trigger function
-- The authenticator and service_role need to invoke this function.
-- ============================================================================
GRANT EXECUTE ON FUNCTION notify_critical_incident() TO postgres;
GRANT EXECUTE ON FUNCTION notify_critical_incident() TO service_role;

-- ============================================================================
-- STEP 5: Add severity column to incident_reports if it does not exist
-- The partitioned table from migration 016 may not have a severity column.
-- This ensures the trigger condition (NEW.severity = 'CRITICAL') works.
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'incident_reports'
          AND column_name = 'severity'
    ) THEN
        ALTER TABLE incident_reports ADD COLUMN severity TEXT DEFAULT 'LOW';
        RAISE NOTICE 'Added severity column to incident_reports';
    END IF;
END $$;

-- ============================================================================
-- STEP 6: Add location column to incident_reports if it does not exist
-- Used by the Slack alert to include the location of the incident.
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'incident_reports'
          AND column_name = 'location'
    ) THEN
        ALTER TABLE incident_reports ADD COLUMN location TEXT;
        RAISE NOTICE 'Added location column to incident_reports';
    END IF;
END $$;

-- ============================================================================
-- STEP 7: Create index on severity for efficient trigger evaluation
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_incident_reports_severity
    ON incident_reports (severity)
    WHERE severity = 'CRITICAL';

-- ============================================================================
-- Verification
-- ============================================================================
DO $$ BEGIN
    RAISE NOTICE 'Migration 012: Slack webhook trigger for critical incidents created successfully';
    RAISE NOTICE 'Ensure the following are configured:';
    RAISE NOTICE '  1. Edge Function deployed: supabase functions deploy slack-incident-alert';
    RAISE NOTICE '  2. SLACK_WEBHOOK_URL secret set: supabase secrets set SLACK_WEBHOOK_URL=https://hooks.slack.com/...';
    RAISE NOTICE '  3. App settings configured in Supabase Dashboard > Settings > Database';
    RAISE NOTICE '     ALTER DATABASE postgres SET app.supabase_url = ''https://<project>.supabase.co''';
    RAISE NOTICE '     ALTER DATABASE postgres SET app.service_role_key = ''<service-role-key>''';
END $$;
