-- ════════════════════════════════════════════════════════════════════════════
-- نظام مؤشر الرفاهية المتكامل - Views لحساب الدرجات
-- ════════════════════════════════════════════════════════════════════════════
-- 1. ملخص الصحة اليومية
CREATE OR REPLACE VIEW v_daily_health_summary AS
SELECT dcl.beneficiary_id,
    dcl.log_date,
    b.full_name,
    b.section,
    b.room_number,
    -- درجة العلامات الحيوية (0-100)
    CASE
        WHEN dcl.temperature BETWEEN 36 AND 37.5 THEN 100
        WHEN dcl.temperature BETWEEN 35.5 AND 38 THEN 70
        ELSE 40
    END as temp_score,
    CASE
        WHEN dcl.pulse BETWEEN 60 AND 100 THEN 100
        WHEN dcl.pulse BETWEEN 50 AND 110 THEN 70
        ELSE 40
    END as pulse_score,
    CASE
        WHEN dcl.oxygen_saturation >= 95 THEN 100
        WHEN dcl.oxygen_saturation >= 90 THEN 70
        ELSE 40
    END as oxygen_score,
    -- درجة المزاج
    CASE
        dcl.mood
        WHEN 'ممتاز' THEN 100
        WHEN 'جيد' THEN 85
        WHEN 'معتدل' THEN 70
        WHEN 'قلق' THEN 50
        WHEN 'سيء' THEN 30
        ELSE 60
    END as mood_score,
    -- درجة النوم
    CASE
        dcl.sleep_quality
        WHEN 'ممتاز' THEN 100
        WHEN 'جيد' THEN 85
        WHEN 'متقطع' THEN 60
        WHEN 'سيء' THEN 30
        ELSE 60
    END as sleep_score,
    -- الالتزام بالأدوية
    CASE
        WHEN dcl.medications_given THEN 100
        ELSE 0
    END as medication_score,
    -- النظافة الشخصية
    CASE
        WHEN dcl.bathing_done THEN 100
        ELSE 50
    END as hygiene_score,
    -- متطلبات متابعة
    dcl.requires_followup,
    dcl.concerns
FROM daily_care_logs dcl
    JOIN beneficiaries b ON dcl.beneficiary_id = b.id
WHERE b.status = 'نشط';
-- 2. ملخص التغذية اليومية
CREATE OR REPLACE VIEW v_nutrition_summary AS
SELECT dm.beneficiary_id,
    dm.meal_date,
    b.full_name,
    -- متوسط نسبة الاستهلاك
    ROUND(AVG(COALESCE(dm.consumption_percentage, 50)), 0) as avg_consumption,
    -- عدد الوجبات المرفوضة
    COUNT(*) FILTER (
        WHERE dm.status = 'refused'
    ) as refused_meals,
    -- عدد الوجبات الكلي
    COUNT(*) as total_meals,
    -- درجة التغذية (0-100)
    ROUND(
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
        ),
        0
    ) as nutrition_score
FROM daily_meals dm
    JOIN beneficiaries b ON dm.beneficiary_id = b.id
WHERE b.status = 'نشط'
GROUP BY dm.beneficiary_id,
    dm.meal_date,
    b.full_name;
-- 3. ملخص السلامة (مخاطر السقوط)
CREATE OR REPLACE VIEW v_safety_summary AS
SELECT fra.beneficiary_id,
    fra.assessment_date,
    b.full_name,
    fra.risk_score,
    -- تحويل درجة المخاطر لدرجة سلامة (عكسية)
    GREATEST(0, 100 - COALESCE(fra.risk_score, 0)) as safety_score,
    -- التصنيف
    CASE
        WHEN fra.risk_score >= 50 THEN 'عالي'
        WHEN fra.risk_score >= 30 THEN 'متوسط'
        ELSE 'منخفض'
    END as risk_level,
    fra.preventive_measures
FROM fall_risk_assessments fra
    JOIN beneficiaries b ON fra.beneficiary_id = b.id
WHERE fra.assessment_date = (
        SELECT MAX(assessment_date)
        FROM fall_risk_assessments
        WHERE beneficiary_id = fra.beneficiary_id
    );
-- 4. ═══ مؤشر الرفاهية المتكامل ═══
CREATE OR REPLACE VIEW v_wellbeing_index AS WITH latest_health AS (
        SELECT DISTINCT ON (beneficiary_id) beneficiary_id,
            log_date,
            -- حساب درجة الصحة الإجمالية
            ROUND(
                (
                    COALESCE(temp_score, 70) * 0.2 + COALESCE(pulse_score, 70) * 0.2 + COALESCE(oxygen_score, 70) * 0.2 + COALESCE(medication_score, 50) * 0.2 + COALESCE(hygiene_score, 50) * 0.2
                ),
                0
            ) as health_score,
            mood_score,
            requires_followup
        FROM v_daily_health_summary
        ORDER BY beneficiary_id,
            log_date DESC
    ),
    latest_nutrition AS (
        SELECT DISTINCT ON (beneficiary_id) beneficiary_id,
            meal_date,
            nutrition_score
        FROM v_nutrition_summary
        ORDER BY beneficiary_id,
            meal_date DESC
    ),
    latest_safety AS (
        SELECT beneficiary_id,
            safety_score,
            risk_level
        FROM v_safety_summary
    )
SELECT b.id as beneficiary_id,
    b.full_name,
    b.file_number,
    b.section,
    b.room_number,
    b.mobility_type,
    b.status,
    -- الدرجات الفرعية
    COALESCE(lh.health_score, 70) as health_score,
    COALESCE(ln.nutrition_score, 70) as nutrition_score,
    COALESCE(ls.safety_score, 70) as safety_score,
    COALESCE(lh.mood_score, 70) as mood_score,
    70 as activity_score,
    -- افتراضي حتى يتوفر جدول الأنشطة
    -- ═══ مؤشر الرفاهية الموحد ═══
    ROUND(
        (
            COALESCE(lh.health_score, 70) * 0.30 + COALESCE(ln.nutrition_score, 70) * 0.20 + COALESCE(ls.safety_score, 70) * 0.20 + COALESCE(lh.mood_score, 70) * 0.15 + 70 * 0.15 -- activity score placeholder
        ),
        0
    ) as wellbeing_score,
    -- التصنيف
    CASE
        WHEN ROUND(
            (
                COALESCE(lh.health_score, 70) * 0.30 + COALESCE(ln.nutrition_score, 70) * 0.20 + COALESCE(ls.safety_score, 70) * 0.20 + COALESCE(lh.mood_score, 70) * 0.15 + 70 * 0.15
            ),
            0
        ) >= 80 THEN 'أخضر'
        WHEN ROUND(
            (
                COALESCE(lh.health_score, 70) * 0.30 + COALESCE(ln.nutrition_score, 70) * 0.20 + COALESCE(ls.safety_score, 70) * 0.20 + COALESCE(lh.mood_score, 70) * 0.15 + 70 * 0.15
            ),
            0
        ) >= 60 THEN 'أصفر'
        ELSE 'أحمر'
    END as status_color,
    -- معلومات إضافية
    COALESCE(lh.requires_followup, false) as requires_followup,
    COALESCE(ls.risk_level, 'منخفض') as fall_risk_level,
    CURRENT_TIMESTAMP as calculated_at
FROM beneficiaries b
    LEFT JOIN latest_health lh ON b.id = lh.beneficiary_id
    LEFT JOIN latest_nutrition ln ON b.id = ln.beneficiary_id
    LEFT JOIN latest_safety ls ON b.id = ls.beneficiary_id
WHERE b.status = 'نشط'
ORDER BY wellbeing_score ASC;
-- الأقل درجة أولاً
-- 5. إحصائيات الرفاهية الإجمالية
CREATE OR REPLACE VIEW v_wellbeing_stats AS
SELECT COUNT(*) as total_beneficiaries,
    ROUND(AVG(wellbeing_score), 1) as avg_wellbeing_score,
    COUNT(*) FILTER (
        WHERE status_color = 'أخضر'
    ) as green_count,
    COUNT(*) FILTER (
        WHERE status_color = 'أصفر'
    ) as yellow_count,
    COUNT(*) FILTER (
        WHERE status_color = 'أحمر'
    ) as red_count,
    COUNT(*) FILTER (
        WHERE requires_followup
    ) as needs_followup_count,
    COUNT(*) FILTER (
        WHERE fall_risk_level = 'عالي'
    ) as high_fall_risk_count,
    ROUND(AVG(health_score), 1) as avg_health_score,
    ROUND(AVG(nutrition_score), 1) as avg_nutrition_score,
    ROUND(AVG(safety_score), 1) as avg_safety_score,
    ROUND(AVG(mood_score), 1) as avg_mood_score
FROM v_wellbeing_index;
-- 6. تقرير الإنذار المبكر (المستفيدين في خطر)
CREATE OR REPLACE VIEW v_early_warning_report AS
SELECT beneficiary_id,
    full_name,
    file_number,
    section,
    room_number,
    wellbeing_score,
    status_color,
    health_score,
    nutrition_score,
    safety_score,
    mood_score,
    fall_risk_level,
    requires_followup,
    -- سبب التحذير
    CASE
        WHEN wellbeing_score < 50 THEN 'درجة رفاهية منخفضة جداً'
        WHEN health_score < 50 THEN 'مؤشرات صحية تحتاج متابعة'
        WHEN safety_score < 50 THEN 'خطر سقوط عالي'
        WHEN nutrition_score < 50 THEN 'مشكلة في التغذية'
        WHEN mood_score < 50 THEN 'حالة نفسية تحتاج اهتمام'
        ELSE 'يحتاج مراجعة عامة'
    END as warning_reason
FROM v_wellbeing_index
WHERE wellbeing_score < 60
    OR requires_followup = true
    OR fall_risk_level = 'عالي'
ORDER BY wellbeing_score ASC;