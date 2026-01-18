-- ═══════════════════════════════════════════════════════════════════════════
-- BASIRA Phase 3: Fix RLS Policies
-- Add anon role access to match beneficiaries table
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════
-- First, reload the schema cache to recognize new tables
NOTIFY pgrst,
'reload schema';
-- Add anon access policies to medication_schedules
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_schedules'
        AND policyname = 'anon_read_access'
) THEN CREATE POLICY anon_read_access ON medication_schedules FOR
SELECT TO anon USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_schedules'
        AND policyname = 'anon_insert_access'
) THEN CREATE POLICY anon_insert_access ON medication_schedules FOR
INSERT TO anon WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_schedules'
        AND policyname = 'anon_update_access'
) THEN CREATE POLICY anon_update_access ON medication_schedules FOR
UPDATE TO anon USING (true) WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_schedules'
        AND policyname = 'anon_delete_access'
) THEN CREATE POLICY anon_delete_access ON medication_schedules FOR DELETE TO anon USING (true);
END IF;
END $$;
-- Add anon access policies to medication_administrations
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_administrations'
        AND policyname = 'anon_read_access'
) THEN CREATE POLICY anon_read_access ON medication_administrations FOR
SELECT TO anon USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_administrations'
        AND policyname = 'anon_insert_access'
) THEN CREATE POLICY anon_insert_access ON medication_administrations FOR
INSERT TO anon WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_administrations'
        AND policyname = 'anon_update_access'
) THEN CREATE POLICY anon_update_access ON medication_administrations FOR
UPDATE TO anon USING (true) WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'medication_administrations'
        AND policyname = 'anon_delete_access'
) THEN CREATE POLICY anon_delete_access ON medication_administrations FOR DELETE TO anon USING (true);
END IF;
END $$;
-- Add anon access policies to shift_handover_notes
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'shift_handover_notes'
        AND policyname = 'anon_read_access'
) THEN CREATE POLICY anon_read_access ON shift_handover_notes FOR
SELECT TO anon USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'shift_handover_notes'
        AND policyname = 'anon_insert_access'
) THEN CREATE POLICY anon_insert_access ON shift_handover_notes FOR
INSERT TO anon WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'shift_handover_notes'
        AND policyname = 'anon_update_access'
) THEN CREATE POLICY anon_update_access ON shift_handover_notes FOR
UPDATE TO anon USING (true) WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'shift_handover_notes'
        AND policyname = 'anon_delete_access'
) THEN CREATE POLICY anon_delete_access ON shift_handover_notes FOR DELETE TO anon USING (true);
END IF;
END $$;
-- Add anon access to audit_logs (read only)
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'audit_logs'
        AND policyname = 'anon_read_access'
) THEN CREATE POLICY anon_read_access ON audit_logs FOR
SELECT TO anon USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'audit_logs'
        AND policyname = 'anon_insert_access'
) THEN CREATE POLICY anon_insert_access ON audit_logs FOR
INSERT TO anon WITH CHECK (true);
END IF;
END $$;
-- Add anon access to grc_risks
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'grc_risks'
        AND policyname = 'anon_read_access'
) THEN CREATE POLICY anon_read_access ON grc_risks FOR
SELECT TO anon USING (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'grc_risks'
        AND policyname = 'anon_insert_access'
) THEN CREATE POLICY anon_insert_access ON grc_risks FOR
INSERT TO anon WITH CHECK (true);
END IF;
IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE tablename = 'grc_risks'
        AND policyname = 'anon_update_access'
) THEN CREATE POLICY anon_update_access ON grc_risks FOR
UPDATE TO anon USING (true) WITH CHECK (true);
END IF;
END $$;
-- Reload schema cache again after policy changes
NOTIFY pgrst,
'reload schema';
-- ============================================================================
-- SUCCESS
-- ============================================================================
DO $$ BEGIN RAISE NOTICE '';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'RLS POLICIES FIXED';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
RAISE NOTICE 'Added anon role policies to:';
RAISE NOTICE '  • medication_schedules';
RAISE NOTICE '  • medication_administrations';
RAISE NOTICE '  • shift_handover_notes';
RAISE NOTICE '  • audit_logs';
RAISE NOTICE '  • grc_risks';
RAISE NOTICE '';
RAISE NOTICE 'Please refresh the app in the browser.';
RAISE NOTICE '═══════════════════════════════════════════════════════════════════';
END $$;