-- ═══════════════════════════════════════════════════════════════════════════
-- Grants + RLS Reset
-- ═══════════════════════════════════════════════════════════════════════════
-- Re-runs the grants so anon/authenticated/service_role can read every public
-- table, then disables RLS on every public table so the frontend bundle can
-- query with just the anon key.
--
-- ⚠️ This is PERMISSIVE. It is the minimum needed to get the app showing data
-- again. Before the system holds real PII you must:
--   1. Re-enable RLS on every table
--   2. Write per-table policies keyed on auth.uid() and role
--   3. Remove anon grants from tables that should be protected
-- See README.md § "Outstanding security debt".
-- ═══════════════════════════════════════════════════════════════════════════

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES    IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES    TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP
    EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;
END $$;
