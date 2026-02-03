-- =====================================================
-- تحديث Schema لاستيراد البيانات الحقيقية
-- مركز التأهيل الشامل بالباحة
-- 2026-02-01
-- =====================================================
-- المرحلة 1: إضافة الأعمدة الجديدة
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS nationality VARCHAR(50) DEFAULT 'سعودي';
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS medical_diagnosis TEXT;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS disability_type VARCHAR(20);
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS iq_level INTEGER;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS bedridden BOOLEAN DEFAULT false;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS psychiatric_diagnosis TEXT;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS guardian_relation VARCHAR(30);
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS guardian_phone VARCHAR(20);
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS guardian_address TEXT;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS social_status TEXT;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS visit_frequency VARCHAR(50);
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS last_visit_date DATE;
ALTER TABLE beneficiaries
ADD COLUMN IF NOT EXISTS alerts TEXT [] DEFAULT '{}';
-- المرحلة 2: التحقق من الأعمدة
SELECT column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'beneficiaries'
ORDER BY ordinal_position;
-- المرحلة 3 (اختياري): حذف سجلات الاختبار قبل الاستيراد
-- DELETE FROM beneficiaries WHERE name LIKE '%اختبار%' OR national_id LIKE 'TEST%';
-- المرحلة 4: بعد تشغيل السكريبت - التحقق من البيانات
-- SELECT COUNT(*) as total FROM beneficiaries;
-- SELECT name, alerts FROM beneficiaries WHERE array_length(alerts, 1) > 0 LIMIT 10;
-- SELECT COUNT(*) as with_epilepsy FROM beneficiaries WHERE 'epilepsy' = ANY(alerts);