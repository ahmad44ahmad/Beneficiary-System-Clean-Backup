-- =====================================================
-- إصلاح شامل لجميع الـ Views (النسخة النهائية الكاملة)
-- =====================================================
-- 1. حذف الـ Views القديمة لتنظيف النظام
DROP VIEW IF EXISTS v_early_warning_report CASCADE;
DROP VIEW IF EXISTS v_wellbeing_stats CASCADE;
DROP VIEW IF EXISTS v_wellbeing_index CASCADE;
DROP VIEW IF EXISTS v_safety_summary CASCADE;
DROP VIEW IF EXISTS v_nutrition_summary CASCADE;
DROP VIEW IF EXISTS v_daily_health_summary CASCADE;
-- 2. إنشاء ملخص الصحة (v_daily_health_summary)
-- تم إضافة حساب health_score هنا مباشرة لحل مشكلة الربط
CREATE OR REPLACE VIEW v_daily_health_summary AS
SELECT dcl.beneficiary_id,
    dcl.log_date,
    b.full_name,
    -- حساب health_score (العلامات الحيوية + الأدوية + النظافة)
    ROUND(
        (
            -- درجة الحرارة (20%)
            (
                CASE
                    WHEN dcl.temperature BETWEEN 36 AND 37.5 THEN 100
                    WHEN dcl.temperature BETWEEN 35.5 AND 38 THEN 70
                    ELSE 40
                END
            ) * 0.2 + -- النبض (20%)
            (
                CASE
                    WHEN dcl.pulse BETWEEN 60 AND 100 THEN 100
                    WHEN dcl.pulse BETWEEN 50 AND 110 THEN 70
                    ELSE 40
                END
            ) * 0.2 + -- الأكسجين (20%)
            (
                CASE
                    WHEN dcl.oxygen_saturation >= 95 THEN 100
                    WHEN dcl.oxygen_saturation >= 90 THEN 70
                    ELSE 40
                END
            ) * 0.2 + -- الأدوية (20%)
            (
                CASE
                    WHEN dcl.medications_given THEN 100
                    ELSE 0
                END
            ) * 0.2 + -- النظافة (20%)
            (
                CASE
                    WHEN dcl.bathing_done THEN 100
                    ELSE 50
                END
            ) * 0.2
        )::numeric,
        0
    ) as health_score,
    -- حساب mood_score (منفصل)
    CASE
        dcl.mood
        WHEN 'ممتاز' THEN 100
        WHEN 'جيد' THEN 85
        WHEN 'معتدل' THEN 70
        WHEN 'قلق' THEN 50
        WHEN 'سيء' THEN 30
        ELSE 60
    END as mood_score
FROM daily_care_logs dcl
    JOIN beneficiaries b ON dcl.beneficiary_id = b.id
WHERE b.status = 'ACTIVE';
-- 3. ملخص التغذية (v_nutrition_summary)
CREATE OR REPLACE VIEW v_nutrition_summary AS
SELECT dm.beneficiary_id,
    dm.meal_date,
    b.full_name,
    ROUND(
        AVG(COALESCE(dm.consumption_percentage, 50))::numeric,
        0
    ) as avg_consumption,
    COUNT(*) FILTER (
        WHERE dm.status = 'refused'
    ) as refused_meals,
    COUNT(*) as total_meals,
    ROUND(
        (
            (
                AVG(COALESCE(dm.consumption_percentage, 50)) * 0.7
            ) + (
                (
                    1 - (
                        COUNT(*) FILTER (
                            WHERE dm.status = 'refused'
                        )::float / NULLIF(COUNT(*), 0)
                    )
                ) * 30
            )
        )::numeric,
        0
    ) as nutrition_score
FROM daily_meals dm
    JOIN beneficiaries b ON dm.beneficiary_id = b.id
WHERE b.status = 'ACTIVE'
GROUP BY dm.beneficiary_id,
    dm.meal_date,
    b.full_name;
-- 4. ملخص السلامة (v_safety_summary)
CREATE OR REPLACE VIEW v_safety_summary AS
SELECT fra.beneficiary_id,
    fra.assessment_date,
    b.full_name,
    fra.risk_score,
    GREATEST(0, 100 - COALESCE(fra.risk_score, 0)) as safety_score,
    CASE
        WHEN fra.risk_score >= 50 THEN 'عالي'
        WHEN fra.risk_score >= 30 THEN 'متوسط'
        ELSE 'منخفض'
    END as risk_level,
    NULL as preventive_measures -- تم وضعه NULL لأن العمود غير موجود في الجدول حالياً
FROM fall_risk_assessments fra
    JOIN beneficiaries b ON fra.beneficiary_id = b.id
WHERE fra.assessment_date = (
        SELECT MAX(assessment_date)
        FROM fall_risk_assessments
        WHERE beneficiary_id = fra.beneficiary_id
    );
-- 5. مؤشر الرفاهية الموحد (v_wellbeing_index)
CREATE OR REPLACE VIEW v_wellbeing_index AS WITH latest_health AS (
        SELECT DISTINCT ON (beneficiary_id) *
        FROM v_daily_health_summary
        ORDER BY beneficiary_id,
            log_date DESC
    )
SELECT b.id as beneficiary_id,
    b.full_name,
    b.status,
    COALESCE(h.health_score, 70) as health_score,
    COALESCE(n.nutrition_score, 75) as nutrition_score,
    COALESCE(s.safety_score, 80) as safety_score,
    COALESCE(h.mood_score, 70) as mood_score,
    70 as activity_score,
    -- حساب المؤشر النهائي
    ROUND(
        (
            COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
        )::numeric,
        0
    ) as wellbeing_index,
    -- تحديد اللون
    CASE
        WHEN ROUND(
            (
                COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
            )::numeric,
            0
        ) >= 70 THEN 'green'
        WHEN ROUND(
            (
                COALESCE(h.health_score, 70) * 0.30 + COALESCE(n.nutrition_score, 75) * 0.20 + COALESCE(s.safety_score, 80) * 0.20 + COALESCE(h.mood_score, 70) * 0.15 + 70 * 0.15
            )::numeric,
            0
        ) >= 50 THEN 'yellow'
        ELSE 'red'
    END as status_color
FROM beneficiaries b
    LEFT JOIN latest_health h ON b.id = h.beneficiary_id
    LEFT JOIN v_nutrition_summary n ON b.id = n.beneficiary_id
    LEFT JOIN v_safety_summary s ON b.id = s.beneficiary_id
WHERE b.status = 'ACTIVE';
-- 6. إحصائيات الرفاهية (v_wellbeing_stats)
CREATE OR REPLACE VIEW v_wellbeing_stats AS
SELECT COUNT(*) as total_beneficiaries,
    ROUND(AVG(wellbeing_index)::numeric, 0) as avg_score,
    COUNT(*) FILTER (
        WHERE status_color = 'green'
    ) as green_count,
    COUNT(*) FILTER (
        WHERE status_color = 'yellow'
    ) as yellow_count,
    COUNT(*) FILTER (
        WHERE status_color = 'red'
    ) as red_count,
    ROUND(AVG(health_score)::numeric, 0) as avg_health,
    ROUND(AVG(nutrition_score)::numeric, 0) as avg_nutrition,
    ROUND(AVG(safety_score)::numeric, 0) as avg_safety,
    ROUND(AVG(mood_score)::numeric, 0) as avg_mood
FROM v_wellbeing_index;
-- 7. تقرير الإنذار المبكر (v_early_warning_report)
CREATE OR REPLACE VIEW v_early_warning_report AS
SELECT wi.beneficiary_id,
    wi.full_name,
    wi.wellbeing_index,
    wi.status_color,
    CASE
        WHEN wi.health_score < 50 THEN 'صحة منخفضة'
        WHEN wi.nutrition_score < 50 THEN 'تغذية ضعيفة'
        WHEN wi.safety_score < 50 THEN 'خطر سقوط عالي'
        WHEN wi.mood_score < 50 THEN 'حالة مزاجية منخفضة'
        ELSE 'يحتاج متابعة عامة'
    END as primary_concern
FROM v_wellbeing_index wi
WHERE wi.wellbeing_index < 70
ORDER BY wi.wellbeing_index ASC;