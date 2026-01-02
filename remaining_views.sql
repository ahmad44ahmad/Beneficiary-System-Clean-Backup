-- =====================================================
-- الـ Views المتبقية لنظام مؤشر الرفاهية
-- يرجى تنفيذ هذه الاستعلامات في Supabase SQL Editor
-- =====================================================
-- VIEW 4: مؤشر الرفاهية الموحد
-- هذا الـ View الرئيسي يجمع جميع الدرجات الفرعية
DROP VIEW IF EXISTS v_wellbeing_index CASCADE;
CREATE OR REPLACE VIEW v_wellbeing_index AS
SELECT b.id as beneficiary_id,
    b.full_name,
    b.status,
    COALESCE(h.health_score, 70) as health_score,
    COALESCE(n.nutrition_score, 75) as nutrition_score,
    COALESCE(s.safety_score, 80) as safety_score,
    COALESCE(h.mood_score, 70) as mood_score,
    70 as activity_score,
    ROUND(
        (
            COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
        )::numeric,
        0
    ) as wellbeing_index,
    CASE
        WHEN ROUND(
            (
                COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
            )::numeric,
            0
        ) >= 70 THEN 'أخضر'
        WHEN ROUND(
            (
                COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
            )::numeric,
            0
        ) >= 50 THEN 'أصفر'
        ELSE 'أحمر'
    END as status_color
FROM beneficiaries b
    LEFT JOIN v_daily_health_summary h ON b.id = h.beneficiary_id
    LEFT JOIN v_nutrition_summary n ON b.id = n.beneficiary_id
    LEFT JOIN v_safety_summary s ON b.id = s.beneficiary_id
WHERE b.status = 'ACTIVE';
-- VIEW 5: إحصائيات الرفاهية
DROP VIEW IF EXISTS v_wellbeing_stats CASCADE;
CREATE OR REPLACE VIEW v_wellbeing_stats AS
SELECT COUNT(*) as total_beneficiaries,
    ROUND(AVG(wellbeing_index)::numeric, 0) as avg_score,
    COUNT(*) FILTER (
        WHERE status_color = 'أخضر'
    ) as green_count,
    COUNT(*) FILTER (
        WHERE status_color = 'أصفر'
    ) as yellow_count,
    COUNT(*) FILTER (
        WHERE status_color = 'أحمر'
    ) as red_count,
    ROUND(AVG(health_score)::numeric, 0) as avg_health,
    ROUND(AVG(nutrition_score)::numeric, 0) as avg_nutrition,
    ROUND(AVG(safety_score)::numeric, 0) as avg_safety,
    ROUND(AVG(mood_score)::numeric, 0) as avg_mood
FROM v_wellbeing_index;
-- VIEW 6: تقرير الإنذار المبكر (اختياري)
DROP VIEW IF EXISTS v_early_warning_report CASCADE;
CREATE OR REPLACE VIEW v_early_warning_report AS
SELECT wi.beneficiary_id,
    wi.full_name,
    wi.wellbeing_index,
    wi.status_color,
    wi.health_score,
    wi.nutrition_score,
    wi.safety_score,
    wi.mood_score,
    CASE
        WHEN wi.health_score < 50 THEN 'صحة منخفضة'
        WHEN wi.nutrition_score < 50 THEN 'تغذية ضعيفة'
        WHEN wi.safety_score < 50 THEN 'خطر سقوط عالي'
        WHEN wi.mood_score < 50 THEN 'حالة مزاجية منخفضة'
        ELSE 'يحتاج متابعة عامة'
    END as primary_concern,
    CURRENT_DATE as report_date
FROM v_wellbeing_index wi
WHERE wi.wellbeing_index < 70
ORDER BY wi.wellbeing_index ASC;
-- =====================================================
-- بعد تنفيذ هذه الاستعلامات، يمكنك التحقق منها بـ:
-- SELECT * FROM v_wellbeing_index LIMIT 10;
-- SELECT * FROM v_wellbeing_stats;
-- =====================================================