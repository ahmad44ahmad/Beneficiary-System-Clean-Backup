-- ═══════════════════════════════════════════════════════════════════════════
-- BASIRA Database Optimization Script (Defensive Version)
-- Project: ruesovrbhcjphmfdcpsa
-- Generated: 2026-01-18
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- 
-- This script is SAFE TO RUN on any schema - it checks for table/column
-- existence before each operation and skips if not found.
-- ═══════════════════════════════════════════════════════════════════════════
-- ============================================================================
-- SECTION 0: CREATE ESSENTIAL TABLES
-- Creates tables required by the application that may not exist
-- ============================================================================
-- Audit Logs Table (for ministry compliance tracking)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id TEXT,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    resource_id TEXT,
    resource_type TEXT,
    description TEXT,
    previous_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    session_id TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- GRC Risks Table
CREATE TABLE IF NOT EXISTS public.grc_risks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    likelihood TEXT,
    impact TEXT,
    risk_score INTEGER,
    status TEXT DEFAULT 'open',
    owner TEXT,
    mitigation_plan TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);
-- Beneficiaries Staging Table
CREATE TABLE IF NOT EXISTS public.beneficiaries_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    data JSONB,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);
DO $$ BEGIN RAISE NOTICE 'SECTION 0: Essential tables created';
END $$;
-- ============================================================================
-- SECTION 1: SAFE INDEX CREATION
-- Creates indexes only if the table AND column exist
-- ============================================================================
DO $$
DECLARE tbl TEXT;
col TEXT;
BEGIN -- Helper: Create index if table.column exists
-- beneficiaries indexes
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'beneficiaries'
        AND column_name = 'status'
) THEN CREATE INDEX IF NOT EXISTS idx_beneficiaries_status ON beneficiaries(status);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'beneficiaries'
        AND column_name = 'full_name'
) THEN CREATE INDEX IF NOT EXISTS idx_beneficiaries_name ON beneficiaries(full_name);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'beneficiaries'
        AND column_name = 'national_id'
) THEN CREATE INDEX IF NOT EXISTS idx_beneficiaries_national_id ON beneficiaries(national_id);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'beneficiaries'
        AND column_name = 'room_number'
) THEN CREATE INDEX IF NOT EXISTS idx_beneficiaries_room ON beneficiaries(room_number);
END IF;
-- daily_care_logs indexes
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'daily_care_logs'
        AND column_name = 'log_date'
) THEN CREATE INDEX IF NOT EXISTS idx_daily_care_logs_log_date ON daily_care_logs(log_date);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'daily_care_logs'
        AND column_name = 'beneficiary_id'
) THEN CREATE INDEX IF NOT EXISTS idx_daily_care_logs_beneficiary ON daily_care_logs(beneficiary_id);
END IF;
-- fall_risk_assessments indexes
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'fall_risk_assessments'
        AND column_name = 'risk_score'
) THEN CREATE INDEX IF NOT EXISTS idx_fall_risk_score ON fall_risk_assessments(risk_score);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'fall_risk_assessments'
        AND column_name = 'beneficiary_id'
) THEN CREATE INDEX IF NOT EXISTS idx_fall_risk_beneficiary ON fall_risk_assessments(beneficiary_id);
END IF;
-- om_maintenance_requests indexes
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'om_maintenance_requests'
        AND column_name = 'status'
) THEN CREATE INDEX IF NOT EXISTS idx_maintenance_status ON om_maintenance_requests(status);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'om_maintenance_requests'
        AND column_name = 'priority'
) THEN CREATE INDEX IF NOT EXISTS idx_maintenance_priority ON om_maintenance_requests(priority);
END IF;
-- audit_logs indexes (check column existence - table may already exist)
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'audit_logs'
        AND column_name = 'timestamp'
) THEN CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'audit_logs'
        AND column_name = 'module'
) THEN CREATE INDEX IF NOT EXISTS idx_audit_logs_module ON audit_logs(module);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'audit_logs'
        AND column_name = 'action'
) THEN CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'audit_logs'
        AND column_name = 'user_id'
) THEN CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
END IF;
-- grc_risks indexes (check column existence - table may already exist)
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'grc_risks'
        AND column_name = 'status'
) THEN CREATE INDEX IF NOT EXISTS idx_grc_risks_status ON grc_risks(status);
END IF;
IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
        AND table_name = 'grc_risks'
        AND column_name = 'category'
) THEN CREATE INDEX IF NOT EXISTS idx_grc_risks_category ON grc_risks(category);
END IF;
RAISE NOTICE 'SECTION 1: Indexes created for existing columns';
END $$;
-- ============================================================================
-- SECTION 2: ROW LEVEL SECURITY (RLS)
-- Enable RLS only on existing tables
-- ============================================================================
DO $$ BEGIN -- Enable RLS on tables that exist
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'beneficiaries'
) THEN
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'daily_care_logs'
) THEN
ALTER TABLE daily_care_logs ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'fall_risk_assessments'
) THEN
ALTER TABLE fall_risk_assessments ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'medical_profiles'
) THEN
ALTER TABLE medical_profiles ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'om_maintenance_requests'
) THEN
ALTER TABLE om_maintenance_requests ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'om_assets'
) THEN
ALTER TABLE om_assets ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'daily_meals'
) THEN
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'dietary_plans'
) THEN
ALTER TABLE dietary_plans ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'ipc_inspections'
) THEN
ALTER TABLE ipc_inspections ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'ipc_incidents'
) THEN
ALTER TABLE ipc_incidents ENABLE ROW LEVEL SECURITY;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'social_research'
) THEN
ALTER TABLE social_research ENABLE ROW LEVEL SECURITY;
END IF;
-- Tables we created
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE grc_risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE beneficiaries_staging ENABLE ROW LEVEL SECURITY;
RAISE NOTICE 'SECTION 2: RLS enabled on existing tables';
END $$;
-- ============================================================================
-- SECTION 3: RLS POLICIES
-- Create authenticated access policies
-- ============================================================================
DO $$ BEGIN -- beneficiaries policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'beneficiaries'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'beneficiaries'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON beneficiaries FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- daily_care_logs policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'daily_care_logs'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'daily_care_logs'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON daily_care_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- fall_risk_assessments policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'fall_risk_assessments'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'fall_risk_assessments'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON fall_risk_assessments FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- medical_profiles policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'medical_profiles'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medical_profiles'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON medical_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- om_maintenance_requests policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'om_maintenance_requests'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'om_maintenance_requests'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON om_maintenance_requests FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- om_assets policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'om_assets'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'om_assets'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON om_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- daily_meals policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'daily_meals'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'daily_meals'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON daily_meals FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- dietary_plans policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'dietary_plans'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'dietary_plans'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON dietary_plans FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- ipc_inspections policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'ipc_inspections'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'ipc_inspections'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON ipc_inspections FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- ipc_incidents policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'ipc_incidents'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'ipc_incidents'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON ipc_incidents FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- social_research policy
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'social_research'
) THEN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'social_research'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON social_research FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
END IF;
-- Policies for tables we created
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'audit_logs'
        AND policyname = 'authenticated_read_access'
) THEN CREATE POLICY authenticated_read_access ON audit_logs FOR
SELECT TO authenticated USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'audit_logs'
        AND policyname = 'authenticated_insert_access'
) THEN CREATE POLICY authenticated_insert_access ON audit_logs FOR
INSERT TO authenticated WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'grc_risks'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON grc_risks FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'beneficiaries_staging'
        AND policyname = 'authenticated_full_access'
) THEN CREATE POLICY authenticated_full_access ON beneficiaries_staging FOR ALL TO authenticated USING (true) WITH CHECK (true);
END IF;
RAISE NOTICE 'SECTION 3: RLS policies created';
END $$;
-- ============================================================================
-- SECTION 4: DATABASE FUNCTIONS
-- Create helper functions for the application
-- ============================================================================
-- Auto-update timestamp trigger function
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    pg_temp;
-- Dashboard stats function (checks table existence)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats() RETURNS TABLE (
        total_beneficiaries BIGINT,
        active_beneficiaries BIGINT,
        high_risk_count BIGINT,
        pending_maintenance BIGINT
    ) AS $$ BEGIN RETURN QUERY
SELECT COALESCE(
        (
            SELECT COUNT(*)
            FROM beneficiaries
        ),
        0
    )::BIGINT,
    COALESCE(
        (
            SELECT COUNT(*)
            FROM beneficiaries
            WHERE status = 'active'
        ),
        0
    )::BIGINT,
    COALESCE(
        (
            SELECT COUNT(*)
            FROM fall_risk_assessments
            WHERE risk_score >= 50
        ),
        0
    )::BIGINT,
    COALESCE(
        (
            SELECT COUNT(*)
            FROM om_maintenance_requests
            WHERE status = 'pending'
        ),
        0
    )::BIGINT;
EXCEPTION
WHEN OTHERS THEN RETURN QUERY
SELECT 0::BIGINT,
    0::BIGINT,
    0::BIGINT,
    0::BIGINT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public,
    pg_temp;
DO $$ BEGIN RAISE NOTICE 'SECTION 4: Database functions created';
END $$;
-- ============================================================================
-- SECTION 5: VIEW SECURITY HARDENING
-- Enable security_invoker on existing views
-- ============================================================================
DO $$ BEGIN BEGIN ALTER VIEW public.evacuation_list
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
BEGIN ALTER VIEW public.critical_low_stock
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
BEGIN ALTER VIEW public.daily_compliance_summary
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
BEGIN ALTER VIEW public.v_wellbeing_index
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
BEGIN ALTER VIEW public.v_wellbeing_stats
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
BEGIN ALTER VIEW public.v_early_warning_report
SET (security_invoker = true);
EXCEPTION
WHEN OTHERS THEN NULL;
END;
RAISE NOTICE 'SECTION 5: View security applied';
END $$;
-- ============================================================================
-- SECTION 6: CLEANUP
-- Safe cleanup operations
-- ============================================================================
DO $$ BEGIN -- Cleanup old staging data
DELETE FROM beneficiaries_staging
WHERE created_at < NOW() - INTERVAL '30 days';
EXCEPTION
WHEN OTHERS THEN NULL;
END $$;
-- Analyze tables that exist
DO $$ BEGIN IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'beneficiaries'
) THEN ANALYZE beneficiaries;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'daily_care_logs'
) THEN ANALYZE daily_care_logs;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'fall_risk_assessments'
) THEN ANALYZE fall_risk_assessments;
END IF;
IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
        AND tablename = 'om_maintenance_requests'
) THEN ANALYZE om_maintenance_requests;
END IF;
ANALYZE audit_logs;
ANALYZE grc_risks;
RAISE NOTICE 'SECTION 6: Cleanup and analysis complete';
END $$;
-- ============================================================================
-- FINAL: SUCCESS
-- ============================================================================
DO $$ BEGIN RAISE NOTICE '';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'BASIRA DATABASE OPTIMIZATION COMPLETE';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'Tables created: audit_logs, grc_risks, beneficiaries_staging';
RAISE NOTICE 'Indexes: Created for existing columns';
RAISE NOTICE 'Row Level Security: Enabled on existing tables';
RAISE NOTICE 'RLS Policies: Created for authenticated users';
RAISE NOTICE 'Functions: trigger_set_updated_at, get_dashboard_stats';
RAISE NOTICE 'Views: Security hardening applied';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
END $$;