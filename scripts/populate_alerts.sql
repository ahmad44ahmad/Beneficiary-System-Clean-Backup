-- ═══════════════════════════════════════════════════════════════════════
-- تعبئة عمود alerts من التشخيص الطبي
-- نفّذ هذا الملف في Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════════
-- الخطوة 1: التحقق من الحالة قبل التحديث
SELECT COUNT(*) as total,
    COUNT(*) FILTER (
        WHERE alerts IS NULL
            OR alerts = '{}'
    ) as empty_alerts,
    COUNT(*) FILTER (
        WHERE array_length(alerts, 1) > 0
    ) as with_alerts
FROM beneficiaries;
-- ═══════════════════════════════════════════════════════════════════════
-- الخطوة 2: تعبئة التنبيهات
-- ═══════════════════════════════════════════════════════════════════════
-- 1. صرع (epilepsy)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'epilepsy')
WHERE medical_diagnosis ILIKE '%صرع%'
    AND NOT ('epilepsy' = ANY(COALESCE(alerts, '{}')));
-- 2. سكري (diabetic)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'diabetic')
WHERE medical_diagnosis ILIKE '%سكري%'
    AND NOT ('diabetic' = ANY(COALESCE(alerts, '{}')));
-- 3. سلوك عدواني (aggressiveBehavior)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'aggressiveBehavior')
WHERE (
        medical_diagnosis ILIKE '%عدوان%'
        OR medical_diagnosis ILIKE '%انفعال%'
        OR psychiatric_diagnosis ILIKE '%عدوان%'
    )
    AND NOT (
        'aggressiveBehavior' = ANY(COALESCE(alerts, '{}'))
    );
-- 4. خطر السقوط (fallRisk)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'fallRisk')
WHERE (
        bedridden = true
        OR medical_diagnosis ILIKE '%مشي بصعوبة%'
        OR medical_diagnosis ILIKE '%ضعف الطرفين%'
        OR medical_diagnosis ILIKE '%شلل%'
    )
    AND NOT ('fallRisk' = ANY(COALESCE(alerts, '{}')));
-- 5. ضعف البصر (visuallyImpaired)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'visuallyImpaired')
WHERE (
        medical_diagnosis ILIKE '%بصر%'
        OR medical_diagnosis ILIKE '%نظر%'
        OR medical_diagnosis ILIKE '%حول%'
        OR medical_diagnosis ILIKE '%عمى%'
    )
    AND NOT ('visuallyImpaired' = ANY(COALESCE(alerts, '{}')));
-- 6. صعوبة البلع (swallowingDifficulty)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'swallowingDifficulty')
WHERE medical_diagnosis ILIKE '%بلع%'
    AND NOT (
        'swallowingDifficulty' = ANY(COALESCE(alerts, '{}'))
    );
-- 7. ضعف السمع (hearingImpaired)
UPDATE beneficiaries
SET alerts = array_append(COALESCE(alerts, '{}'), 'hearingImpaired')
WHERE (
        medical_diagnosis ILIKE '%سمع%'
        OR medical_diagnosis ILIKE '%صمم%'
    )
    AND NOT ('hearingImpaired' = ANY(COALESCE(alerts, '{}')));
-- ═══════════════════════════════════════════════════════════════════════
-- الخطوة 3: التحقق بعد التحديث
-- ═══════════════════════════════════════════════════════════════════════
SELECT COUNT(*) FILTER (
        WHERE array_length(alerts, 1) > 0
    ) as with_alerts,
    COUNT(*) FILTER (
        WHERE 'epilepsy' = ANY(alerts)
    ) as epilepsy,
    COUNT(*) FILTER (
        WHERE 'diabetic' = ANY(alerts)
    ) as diabetic,
    COUNT(*) FILTER (
        WHERE 'aggressiveBehavior' = ANY(alerts)
    ) as aggressive,
    COUNT(*) FILTER (
        WHERE 'fallRisk' = ANY(alerts)
    ) as fall_risk,
    COUNT(*) FILTER (
        WHERE 'visuallyImpaired' = ANY(alerts)
    ) as visual,
    COUNT(*) FILTER (
        WHERE 'swallowingDifficulty' = ANY(alerts)
    ) as swallow,
    COUNT(*) FILTER (
        WHERE 'hearingImpaired' = ANY(alerts)
    ) as hearing
FROM beneficiaries;
-- عينة للتحقق
SELECT full_name,
    medical_diagnosis,
    alerts
FROM beneficiaries
WHERE array_length(alerts, 1) > 0
LIMIT 10;