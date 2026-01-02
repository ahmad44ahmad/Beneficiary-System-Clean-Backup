-- ════════════════════════════════════════════════════════════════════════════
-- نظام الإعاشة - جداول تتبع الحضور والوجبات
-- مبني على هيكل كشف الحضور والغياب من مركز التأهيل الشامل بالباحة
-- ════════════════════════════════════════════════════════════════════════════
-- 1. جدول الحضور اليومي للإعاشة
-- يتتبع حضور كل مستفيد يومياً (مطابق لكشف الحضور والغياب)
CREATE TABLE IF NOT EXISTS catering_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID REFERENCES beneficiaries(id) NOT NULL,
    attendance_date DATE NOT NULL,
    is_present BOOLEAN DEFAULT true,
    -- 1 = حاضر، 0 = غائب
    -- تفاصيل الوجبات
    breakfast_served BOOLEAN DEFAULT true,
    -- الفطور
    lunch_served BOOLEAN DEFAULT true,
    -- الغداء
    dinner_served BOOLEAN DEFAULT true,
    -- العشاء
    snack_am_served BOOLEAN DEFAULT false,
    -- وجبة خفيفة صباحية
    snack_pm_served BOOLEAN DEFAULT false,
    -- وجبة خفيفة مسائية
    -- ملاحظات
    absence_reason TEXT,
    -- سبب الغياب (إجازة، مرض، خ)
    notes TEXT,
    -- تتبع
    recorded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- منع التكرار
    UNIQUE(beneficiary_id, attendance_date)
);
-- 2. ملخص الحضور الشهري (view)
CREATE OR REPLACE VIEW v_catering_monthly_summary AS
SELECT beneficiary_id,
    date_trunc('month', attendance_date) as month,
    COUNT(*) FILTER (
        WHERE is_present = true
    ) as days_present,
    COUNT(*) FILTER (
        WHERE is_present = false
    ) as days_absent,
    SUM(
        CASE
            WHEN breakfast_served THEN 1
            ELSE 0
        END
    ) as breakfast_count,
    SUM(
        CASE
            WHEN lunch_served THEN 1
            ELSE 0
        END
    ) as lunch_count,
    SUM(
        CASE
            WHEN dinner_served THEN 1
            ELSE 0
        END
    ) as dinner_count,
    -- إجمالي الوجبات
    SUM(
        CASE
            WHEN breakfast_served THEN 1
            ELSE 0
        END + CASE
            WHEN lunch_served THEN 1
            ELSE 0
        END + CASE
            WHEN dinner_served THEN 1
            ELSE 0
        END
    ) as total_meals
FROM catering_attendance
GROUP BY beneficiary_id,
    date_trunc('month', attendance_date);
-- 3. تقرير الإعاشة اليومي (لطباعة الكشف)
CREATE OR REPLACE VIEW v_catering_daily_report AS
SELECT ca.attendance_date,
    b.full_name as beneficiary_name,
    b.file_number,
    b.section,
    ca.is_present,
    ca.breakfast_served,
    ca.lunch_served,
    ca.dinner_served,
    ca.absence_reason,
    ca.notes
FROM catering_attendance ca
    JOIN beneficiaries b ON ca.beneficiary_id = b.id
ORDER BY ca.attendance_date DESC,
    b.full_name;
-- 4. إحصائيات الإعاشة اليومية
CREATE OR REPLACE VIEW v_catering_daily_stats AS
SELECT attendance_date,
    COUNT(*) FILTER (
        WHERE is_present = true
    ) as present_count,
    COUNT(*) FILTER (
        WHERE is_present = false
    ) as absent_count,
    SUM(
        CASE
            WHEN breakfast_served THEN 1
            ELSE 0
        END
    ) as breakfast_total,
    SUM(
        CASE
            WHEN lunch_served THEN 1
            ELSE 0
        END
    ) as lunch_total,
    SUM(
        CASE
            WHEN dinner_served THEN 1
            ELSE 0
        END
    ) as dinner_total
FROM catering_attendance
GROUP BY attendance_date
ORDER BY attendance_date DESC;
-- 5. RLS
ALTER TABLE catering_attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated all" ON catering_attendance FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- 6. Realtime
ALTER PUBLICATION supabase_realtime
ADD TABLE catering_attendance;
-- 7. فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_catering_attendance_date ON catering_attendance(attendance_date DESC);
CREATE INDEX IF NOT EXISTS idx_catering_attendance_beneficiary ON catering_attendance(beneficiary_id, attendance_date DESC);
-- ════════════════════════════════════════════════════════════════════════════
-- بيانات تجريبية (30 سجل لشهر أكتوبر 2023)
-- ════════════════════════════════════════════════════════════════════════════
-- يمكن استخدام هذا الاستعلام لتوليد بيانات تجريبية:
-- INSERT INTO catering_attendance (beneficiary_id, attendance_date, is_present)
-- SELECT 
--     b.id,
--     generate_series('2023-10-05'::date, '2023-10-31'::date, '1 day')::date,
--     true
-- FROM beneficiaries b
-- WHERE b.status = 'نشط';