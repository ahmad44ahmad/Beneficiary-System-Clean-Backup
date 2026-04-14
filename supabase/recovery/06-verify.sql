-- ═══════════════════════════════════════════════════════════════════════════
-- Post-recovery verification
-- ═══════════════════════════════════════════════════════════════════════════
-- Run this after 01 through 05. Expected results are listed inline as comments.
-- ═══════════════════════════════════════════════════════════════════════════

-- Expect: 48 or more
SELECT count(*) AS public_table_count
FROM pg_tables
WHERE schemaname = 'public';

-- Expect: 139 (or 147 if dedup was not needed in your reload)
SELECT count(*) AS beneficiary_count FROM beneficiaries;

-- Expect: all target tables listed (and count > 0 for beneficiaries)
SELECT
    'beneficiaries'            AS tbl, (SELECT count(*) FROM beneficiaries)            AS rows UNION ALL
SELECT 'medical_profiles',       (SELECT count(*) FROM medical_profiles)       UNION ALL
SELECT 'daily_care_logs',        (SELECT count(*) FROM daily_care_logs)        UNION ALL
SELECT 'audit_logs',             (SELECT count(*) FROM audit_logs)             UNION ALL
SELECT 'daily_meals',            (SELECT count(*) FROM daily_meals)            UNION ALL
SELECT 'dietary_plans',          (SELECT count(*) FROM dietary_plans)          UNION ALL
SELECT 'medical_records',        (SELECT count(*) FROM medical_records)        UNION ALL
SELECT 'om_assets',              (SELECT count(*) FROM om_assets)              UNION ALL
SELECT 'rehab_plans',            (SELECT count(*) FROM rehab_plans)            UNION ALL
SELECT 'social_research',        (SELECT count(*) FROM social_research);

-- Sample 5 beneficiaries so you can eyeball the Arabic full names
SELECT id, full_name, gender, status, building
FROM beneficiaries
ORDER BY full_name
LIMIT 5;
