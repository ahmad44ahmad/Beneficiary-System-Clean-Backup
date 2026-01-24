-- جدول الوجبات
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type TEXT NOT NULL CHECK (
        meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')
    ),
    meal_name TEXT NOT NULL,
    description TEXT,
    calories INTEGER,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'served', 'cancelled')),
    served_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);
-- جدول مخالفات الإعاشة
CREATE TABLE IF NOT EXISTS catering_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (
        severity IN ('low', 'medium', 'high', 'critical')
    ),
    description TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    reported_by UUID REFERENCES auth.users(id),
    reported_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'open' CHECK (
        status IN ('open', 'investigating', 'resolved', 'escalated')
    ),
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES auth.users(id),
    resolution_notes TEXT,
    contractor_id UUID -- للشركة المشغلة
);
-- جدول فحوصات الجودة
CREATE TABLE IF NOT EXISTS quality_checks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('morning', 'evening', 'night')),
    inspector_id UUID REFERENCES auth.users(id),
    checklist JSONB NOT NULL,
    -- {"item": "نظافة المطبخ", "passed": true}
    score INTEGER,
    -- 0-100
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- تفعيل RLS
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;
-- سياسات القراءة للجميع
CREATE POLICY "meals_read" ON meals FOR
SELECT USING (true);
CREATE POLICY "violations_read" ON catering_violations FOR
SELECT USING (true);
CREATE POLICY "checks_read" ON quality_checks FOR
SELECT USING (true);
-- سياسات الكتابة للموظفين
CREATE POLICY "meals_write" ON meals FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "violations_write" ON catering_violations FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "checks_write" ON quality_checks FOR
INSERT WITH CHECK (auth.uid() IS NOT NULL);