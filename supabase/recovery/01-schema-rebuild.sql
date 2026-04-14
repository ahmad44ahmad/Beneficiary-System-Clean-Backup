-- ═══════════════════════════════════════════════════════════════════════════
-- Basira Schema Rebuild — 2026-04-14
-- ═══════════════════════════════════════════════════════════════════════════
-- Replays every migration recorded in supabase_migrations.schema_migrations
-- in chronological order. Idempotent — uses EXECUTE inside a DO block with
-- per-statement EXCEPTION handling so a single failing statement does not
-- abort the whole rebuild (important because basira_v3_drop_conflicts tries
-- to drop tables that may not exist after a fresh start).
--
-- Run this FIRST, before 02-missing-tables.sql or 03-grants-and-rls.sql.
-- ═══════════════════════════════════════════════════════════════════════════

DO $do$
DECLARE
  rec RECORD;
  stmt TEXT;
  ok INT := 0;
  failed INT := 0;
  failures TEXT := '';
BEGIN
  SET LOCAL statement_timeout = '180s';
  FOR rec IN
    SELECT version, name, statements
    FROM supabase_migrations.schema_migrations
    ORDER BY version ASC
  LOOP
    FOREACH stmt IN ARRAY rec.statements LOOP
      BEGIN
        EXECUTE stmt;
        ok := ok + 1;
      EXCEPTION WHEN OTHERS THEN
        failed := failed + 1;
        failures := failures || format('[%s/%s] %s | ', rec.version, rec.name, SQLERRM);
      END;
    END LOOP;
  END LOOP;
  RAISE NOTICE 'OK: %, FAILED: %', ok, failed;
  IF failed > 0 THEN
    RAISE NOTICE 'FAILURES: %', left(failures, 4000);
  END IF;
END
$do$;
