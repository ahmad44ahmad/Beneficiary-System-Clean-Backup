-- ═══════════════════════════════════════════════════════════════════════════
-- Migration 014: Convert Wellbeing Views to Materialized Views
-- Project: Basira (نظام بصيرة)
-- Date: 2026-02-22
-- Purpose: Replace regular views with materialized views for heavy analytics
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================================
-- STEP 1: Drop existing regular views (CASCADE to handle dependencies)
-- ============================================================================
DROP VIEW IF EXISTS v_early_warning_report CASCADE;
DROP VIEW IF EXISTS v_wellbeing_stats CASCADE;
DROP VIEW IF EXISTS v_wellbeing_index CASCADE;
DROP VIEW IF EXISTS v_safety_summary CASCADE;
DROP VIEW IF EXISTS v_nutrition_summary CASCADE;
DROP VIEW IF EXISTS v_daily_health_summary CASCADE;

-- ============================================================================
-- STEP 2: Create Materialized View — v_daily_health_summary
-- Base health metrics per beneficiary per day
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_daily_health_summary AS
SELECT
    dcl.id AS log_id,
    dcl.beneficiary_id,
    dcl.log_date,
    b.full_name,
    ROUND(
        (
            (CASE
                WHEN dcl.temperature BETWEEN 36 AND 37.5 THEN 100
                WHEN dcl.temperature BETWEEN 35.5 AND 38 THEN 70
                ELSE 40
            END) * 0.2 +
            (CASE
                WHEN dcl.pulse BETWEEN 60 AND 100 THEN 100
                WHEN dcl.pulse BETWEEN 50 AND 110 THEN 70
                ELSE 40
            END) * 0.2 +
            (CASE
                WHEN dcl.oxygen_saturation >= 95 THEN 100
                WHEN dcl.oxygen_saturation >= 90 THEN 70
                ELSE 40
            END) * 0.2 +
            (CASE WHEN dcl.medications_given THEN 100 ELSE 0 END) * 0.2 +
            (CASE WHEN dcl.bathing_done THEN 100 ELSE 50 END) * 0.2
        )::numeric, 0
    ) AS health_score,
    CASE dcl.mood
        WHEN 'ممتاز' THEN 100
        WHEN 'جيد' THEN 85
        WHEN 'معتدل' THEN 70
        WHEN 'قلق' THEN 50
        WHEN 'سيء' THEN 30
        ELSE 60
    END AS mood_score
FROM daily_care_logs dcl
JOIN beneficiaries b ON dcl.beneficiary_id = b.id
WHERE b.status = 'ACTIVE'
WITH NO DATA;

-- Unique index required for REFRESH CONCURRENTLY
CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_health_log
    ON mv_daily_health_summary (beneficiary_id, log_date, log_id);

CREATE INDEX IF NOT EXISTS idx_mv_health_date
    ON mv_daily_health_summary (log_date DESC);

-- ============================================================================
-- STEP 3: Create Materialized View — mv_nutrition_summary
-- Nutrition metrics per beneficiary per day
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_nutrition_summary AS
SELECT
    dm.beneficiary_id,
    dm.meal_date,
    b.full_name,
    ROUND(AVG(COALESCE(dm.consumption_percentage, 50))::numeric, 0) AS avg_consumption,
    COUNT(*) FILTER (WHERE dm.status = 'refused') AS refused_meals,
    COUNT(*) AS total_meals,
    ROUND(
        (
            AVG(COALESCE(dm.consumption_percentage, 50)) * 0.7 +
            (1 - COUNT(*) FILTER (WHERE dm.status = 'refused')::float / NULLIF(COUNT(*), 0)) * 30
        )::numeric, 0
    ) AS nutrition_score
FROM daily_meals dm
JOIN beneficiaries b ON dm.beneficiary_id = b.id
WHERE b.status = 'ACTIVE'
GROUP BY dm.beneficiary_id, dm.meal_date, b.full_name
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_nutrition
    ON mv_nutrition_summary (beneficiary_id, meal_date);

-- ============================================================================
-- STEP 4: Create Materialized View — mv_safety_summary
-- Fall risk safety scores per beneficiary (latest assessment)
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_safety_summary AS
SELECT
    fra.beneficiary_id,
    fra.assessment_date,
    b.full_name,
    fra.risk_score,
    GREATEST(0, 100 - COALESCE(fra.risk_score, 0)) AS safety_score,
    CASE
        WHEN fra.risk_score >= 50 THEN 'عالي'
        WHEN fra.risk_score >= 30 THEN 'متوسط'
        ELSE 'منخفض'
    END AS risk_level
FROM fall_risk_assessments fra
JOIN beneficiaries b ON fra.beneficiary_id = b.id
WHERE fra.assessment_date = (
    SELECT MAX(assessment_date)
    FROM fall_risk_assessments
    WHERE beneficiary_id = fra.beneficiary_id
)
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_safety
    ON mv_safety_summary (beneficiary_id);

-- ============================================================================
-- STEP 5: Create Materialized View — mv_wellbeing_index
-- Composite wellbeing score combining health, nutrition, safety, mood
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_wellbeing_index AS
WITH latest_health AS (
    SELECT DISTINCT ON (beneficiary_id) *
    FROM mv_daily_health_summary
    ORDER BY beneficiary_id, log_date DESC
)
SELECT
    b.id AS beneficiary_id,
    b.full_name,
    b.status,
    COALESCE(h.health_score, 70) AS health_score,
    COALESCE(n.nutrition_score, 75) AS nutrition_score,
    COALESCE(s.safety_score, 80) AS safety_score,
    COALESCE(h.mood_score, 70) AS mood_score,
    70 AS activity_score,
    ROUND(
        (
            COALESCE(h.health_score, 70) * 0.30 +
            COALESCE(n.nutrition_score, 75) * 0.20 +
            COALESCE(s.safety_score, 80) * 0.20 +
            COALESCE(h.mood_score, 70) * 0.15 +
            70 * 0.15
        )::numeric, 0
    ) AS wellbeing_index,
    CASE
        WHEN ROUND((
            COALESCE(h.health_score, 70) * 0.30 +
            COALESCE(n.nutrition_score, 75) * 0.20 +
            COALESCE(s.safety_score, 80) * 0.20 +
            COALESCE(h.mood_score, 70) * 0.15 +
            70 * 0.15
        )::numeric, 0) >= 70 THEN 'green'
        WHEN ROUND((
            COALESCE(h.health_score, 70) * 0.30 +
            COALESCE(n.nutrition_score, 75) * 0.20 +
            COALESCE(s.safety_score, 80) * 0.20 +
            COALESCE(h.mood_score, 70) * 0.15 +
            70 * 0.15
        )::numeric, 0) >= 50 THEN 'yellow'
        ELSE 'red'
    END AS status_color
FROM beneficiaries b
LEFT JOIN latest_health h ON b.id = h.beneficiary_id
LEFT JOIN mv_nutrition_summary n ON b.id = n.beneficiary_id
LEFT JOIN mv_safety_summary s ON b.id = s.beneficiary_id
WHERE b.status = 'ACTIVE'
WITH NO DATA;

CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_wellbeing
    ON mv_wellbeing_index (beneficiary_id);

CREATE INDEX IF NOT EXISTS idx_mv_wellbeing_color
    ON mv_wellbeing_index (status_color);

-- ============================================================================
-- STEP 6: Create Materialized View — mv_wellbeing_stats
-- Aggregate statistics across all beneficiaries
-- ============================================================================
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_wellbeing_stats AS
SELECT
    COUNT(*) AS total_beneficiaries,
    ROUND(AVG(wellbeing_index)::numeric, 0) AS avg_score,
    COUNT(*) FILTER (WHERE status_color = 'green') AS green_count,
    COUNT(*) FILTER (WHERE status_color = 'yellow') AS yellow_count,
    COUNT(*) FILTER (WHERE status_color = 'red') AS red_count,
    ROUND(AVG(health_score)::numeric, 0) AS avg_health,
    ROUND(AVG(nutrition_score)::numeric, 0) AS avg_nutrition,
    ROUND(AVG(safety_score)::numeric, 0) AS avg_safety,
    ROUND(AVG(mood_score)::numeric, 0) AS avg_mood
FROM mv_wellbeing_index
WITH NO DATA;

-- Stats is a single-row view, use a constant for unique index
CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_wellbeing_stats
    ON mv_wellbeing_stats (total_beneficiaries, avg_score);

-- ============================================================================
-- STEP 7: Create convenience view for early warnings (lightweight, stays regular)
-- ============================================================================
CREATE OR REPLACE VIEW v_early_warning_report
WITH (security_invoker = true) AS
SELECT
    wi.beneficiary_id,
    wi.full_name,
    wi.wellbeing_index,
    wi.status_color,
    CASE
        WHEN wi.health_score < 50 THEN 'صحة منخفضة'
        WHEN wi.nutrition_score < 50 THEN 'تغذية ضعيفة'
        WHEN wi.safety_score < 50 THEN 'خطر سقوط عالي'
        WHEN wi.mood_score < 50 THEN 'حالة مزاجية منخفضة'
        ELSE 'يحتاج متابعة عامة'
    END AS primary_concern
FROM mv_wellbeing_index wi
WHERE wi.wellbeing_index < 70
ORDER BY wi.wellbeing_index ASC;

-- ============================================================================
-- STEP 8: Initial data population (first refresh)
-- Must be done in dependency order
-- ============================================================================
REFRESH MATERIALIZED VIEW mv_daily_health_summary;
REFRESH MATERIALIZED VIEW mv_nutrition_summary;
REFRESH MATERIALIZED VIEW mv_safety_summary;
REFRESH MATERIALIZED VIEW mv_wellbeing_index;
REFRESH MATERIALIZED VIEW mv_wellbeing_stats;

-- ============================================================================
-- STEP 9: Create refresh function for pg_cron
-- ============================================================================
CREATE OR REPLACE FUNCTION refresh_wellbeing_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_health_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_nutrition_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_safety_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_wellbeing_index;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_wellbeing_stats;
END;
$$;

DO $$ BEGIN
    RAISE NOTICE 'Migration 014: Materialized views created and populated successfully';
END $$;
