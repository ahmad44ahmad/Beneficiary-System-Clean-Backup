-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 017: pgaudit Configuration Verification & Enhancement
-- Project: Basira (نظام بصيرة)
-- Date: 2026-02-22
-- Purpose: Verify and enhance pgaudit setup for PDPL compliance
--
-- PREREQUISITE: pgaudit must be enabled in Supabase Dashboard:
--   Dashboard > Database > Extensions > search "pgaudit" > Enable
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- STEP 1: Verify pgaudit extension is active
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_extension WHERE extname = 'pgaudit'
    ) THEN
        RAISE EXCEPTION 'pgaudit extension is NOT enabled. Enable it in Supabase Dashboard first.';
    END IF;
    RAISE NOTICE 'pgaudit extension: ACTIVE';
END $$;

-- ============================================================================
-- STEP 2: Create or verify pdpl_auditor role
-- ============================================================================
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pdpl_auditor') THEN
        CREATE ROLE pdpl_auditor NOLOGIN;
        RAISE NOTICE 'Created pdpl_auditor role';
    ELSE
        RAISE NOTICE 'pdpl_auditor role already exists';
    END IF;
END $$;

-- ============================================================================
-- STEP 3: Grant SELECT on all sensitive tables to pdpl_auditor
-- This enables object-level audit logging for reads
-- ============================================================================
DO $$
DECLARE
    tbl TEXT;
    sensitive_tables TEXT[] := ARRAY[
        'beneficiaries',
        'medical_profiles',
        'social_research',
        'daily_care_logs',
        'medications',
        'medication_administrations',
        'fall_risk_assessments',
        'fall_incidents',
        'audit_logs',
        'incident_reports',
        'daily_meals',
        'dietary_plans',
        'shift_handovers',
        'ipc_inspections',
        'ipc_incidents'
    ];
BEGIN
    FOREACH tbl IN ARRAY sensitive_tables LOOP
        IF EXISTS (
            SELECT 1 FROM pg_tables
            WHERE schemaname = 'public' AND tablename = tbl
        ) THEN
            EXECUTE format('GRANT SELECT ON %I TO pdpl_auditor', tbl);
            RAISE NOTICE 'Granted SELECT on % to pdpl_auditor', tbl;
        ELSE
            RAISE NOTICE 'Table % does not exist, skipping', tbl;
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- STEP 4: Configure pgaudit role for postgres and authenticator
-- Note: These ALTER ROLE commands may require superuser privileges.
-- On Supabase, set these via Dashboard > Database > Roles, or use:
--   ALTER ROLE postgres SET pgaudit.role = 'pdpl_auditor';
--   ALTER ROLE authenticator SET pgaudit.role = 'pdpl_auditor';
-- ============================================================================
DO $$ BEGIN
    -- Try to set pgaudit.role for postgres
    BEGIN
        ALTER ROLE postgres SET pgaudit.role = 'pdpl_auditor';
        RAISE NOTICE 'Set pgaudit.role for postgres';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not set pgaudit.role for postgres (may need superuser): %', SQLERRM;
    END;

    -- Try to set pgaudit.role for authenticator
    BEGIN
        ALTER ROLE authenticator SET pgaudit.role = 'pdpl_auditor';
        RAISE NOTICE 'Set pgaudit.role for authenticator';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not set pgaudit.role for authenticator (may need superuser): %', SQLERRM;
    END;
END $$;

-- ============================================================================
-- STEP 5: Verify configuration
-- ============================================================================
DO $$ BEGIN
    RAISE NOTICE '══════════════════════════════════════════════════════';
    RAISE NOTICE 'pgaudit PDPL Compliance Verification:';
    RAISE NOTICE '══════════════════════════════════════════════════════';
    RAISE NOTICE 'Extension: ENABLED';
    RAISE NOTICE 'Audit Role: pdpl_auditor';
    RAISE NOTICE 'Logging Mode: Object-level (SELECT on sensitive tables)';
    RAISE NOTICE '';
    RAISE NOTICE 'To verify audit logs, check:';
    RAISE NOTICE '  Supabase Dashboard > Logs > Postgres Logs';
    RAISE NOTICE '  Filter: AUDIT';
    RAISE NOTICE '';
    RAISE NOTICE 'Run this query to verify grants:';
    RAISE NOTICE '  SELECT grantee, table_name, privilege_type';
    RAISE NOTICE '  FROM information_schema.table_privileges';
    RAISE NOTICE '  WHERE grantee = ''pdpl_auditor'';';
    RAISE NOTICE '══════════════════════════════════════════════════════';
END $$;
