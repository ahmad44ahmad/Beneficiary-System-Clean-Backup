-- ========================================
-- Essential Tables Migration
-- Run this in Supabase SQL Editor
-- ========================================
-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE,
    full_name TEXT NOT NULL,
    job_title TEXT,
    department TEXT,
    role TEXT DEFAULT 'staff',
    email TEXT,
    phone TEXT,
    hire_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
);
-- Medical Records Table
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    beneficiary_id UUID,
    record_type TEXT,
    diagnosis TEXT,
    treatment TEXT,
    medication TEXT,
    doctor_name TEXT,
    record_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT NOT NULL,
    severity TEXT DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT,
    beneficiary_id UUID,
    status TEXT DEFAULT 'open',
    escalation_level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP,
    resolved_by UUID
);
-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_type TEXT NOT NULL,
    meal_name TEXT NOT NULL,
    description TEXT,
    calories INTEGER,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    status TEXT DEFAULT 'scheduled',
    served_count INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
-- Catering Violations Table
CREATE TABLE IF NOT EXISTS catering_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    violation_type TEXT NOT NULL,
    severity TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT,
    image_url TEXT,
    reported_at TIMESTAMP DEFAULT NOW(),
    status TEXT DEFAULT 'open',
    resolved_at TIMESTAMP,
    resolution_notes TEXT
);
-- Enable RLS
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE catering_violations ENABLE ROW LEVEL SECURITY;
-- Create public read policies
DROP POLICY IF EXISTS "public_read_staff" ON staff;
DROP POLICY IF EXISTS "public_read_medical" ON medical_records;
DROP POLICY IF EXISTS "public_read_alerts" ON alerts;
DROP POLICY IF EXISTS "public_read_meals" ON meals;
DROP POLICY IF EXISTS "public_read_violations" ON catering_violations;
CREATE POLICY "public_read_staff" ON staff FOR ALL USING (true);
CREATE POLICY "public_read_medical" ON medical_records FOR ALL USING (true);
CREATE POLICY "public_read_alerts" ON alerts FOR ALL USING (true);
CREATE POLICY "public_read_meals" ON meals FOR ALL USING (true);
CREATE POLICY "public_read_violations" ON catering_violations FOR ALL USING (true);
-- Seed Staff Data
INSERT INTO staff (
        employee_id,
        full_name,
        job_title,
        department,
        role,
        email,
        phone,
        status
    )
VALUES (
        'EMP-001',
        'أحمد محمد الشهري',
        'مدير المركز',
        'الإدارة',
        'director',
        'director@basira.app',
        '0555000001',
        'active'
    ),
    (
        'EMP-002',
        'فاطمة علي القحطاني',
        'مديرة الخدمات الاجتماعية',
        'الخدمات الاجتماعية',
        'supervisor',
        'social@basira.app',
        '0555000002',
        'active'
    ),
    (
        'EMP-003',
        'خالد سعد الغامدي',
        'مدير الخدمات الطبية',
        'الخدمات الطبية',
        'supervisor',
        'medical@basira.app',
        '0555000003',
        'active'
    ),
    (
        'EMP-004',
        'نورة عبدالله العتيبي',
        'أخصائية اجتماعية',
        'الخدمات الاجتماعية',
        'staff',
        'norah@basira.app',
        '0555000004',
        'active'
    ),
    (
        'EMP-005',
        'محمد حسن الدوسري',
        'ممرض',
        'الخدمات الطبية',
        'staff',
        'mohammed@basira.app',
        '0555000005',
        'active'
    ),
    (
        'EMP-006',
        'سارة سالم الحربي',
        'أخصائية تأهيل',
        'التأهيل',
        'staff',
        'sara@basira.app',
        '0555000006',
        'active'
    ),
    (
        'EMP-007',
        'عبدالرحمن فيصل المالكي',
        'مشرف الإعاشة',
        'الإعاشة',
        'supervisor',
        'abdulrahman@basira.app',
        '0555000007',
        'active'
    ),
    (
        'EMP-008',
        'هند ناصر الزهراني',
        'منسقة الجودة',
        'الجودة',
        'staff',
        'hind@basira.app',
        '0555000008',
        'active'
    );
-- Seed Alerts Data
INSERT INTO alerts (alert_type, severity, title, description, status)
VALUES (
        'medical',
        'high',
        'موعد دواء متأخر',
        'المستفيد لم يتلق الدواء في الموعد المحدد',
        'open'
    ),
    (
        'safety',
        'critical',
        'خطر سقوط محتمل',
        'تم رصد مستفيد يحاول المشي بدون مساعدة',
        'open'
    ),
    (
        'behavioral',
        'medium',
        'سلوك غير معتاد',
        'لوحظ تغير في سلوك المستفيد',
        'acknowledged'
    ),
    (
        'nutrition',
        'low',
        'تغيير في الشهية',
        'المستفيد رفض وجبة الغداء',
        'resolved'
    ),
    (
        'medical',
        'high',
        'ارتفاع في درجة الحرارة',
        'تم قياس حرارة 38.5 درجة',
        'open'
    );
-- Seed Meals Data
INSERT INTO meals (
        meal_type,
        meal_name,
        description,
        calories,
        scheduled_date,
        scheduled_time,
        status
    )
VALUES (
        'breakfast',
        'فطور صحي',
        'بيض مسلوق، خبز أسمر، جبن، زيتون',
        450,
        CURRENT_DATE,
        '07:30',
        'served'
    ),
    (
        'lunch',
        'أرز بالدجاج',
        'أرز أبيض، دجاج مشوي، سلطة خضراء',
        650,
        CURRENT_DATE,
        '12:00',
        'scheduled'
    ),
    (
        'dinner',
        'شوربة خضار',
        'شوربة خضار، خبز، فواكه',
        350,
        CURRENT_DATE,
        '18:00',
        'scheduled'
    ),
    (
        'breakfast',
        'فطور تقليدي',
        'فول، حمص، خبز، شاي',
        400,
        CURRENT_DATE + 1,
        '07:30',
        'scheduled'
    ),
    (
        'lunch',
        'كبسة لحم',
        'أرز بهاري، لحم، سلطة',
        700,
        CURRENT_DATE + 1,
        '12:00',
        'scheduled'
    );