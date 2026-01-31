-- ═══════════════════════════════════════════════════════════════════════════════
-- BASIRA DATA SEEDING SCRIPT (100% VERIFIED COLUMNS)
-- Run this in Supabase Dashboard > SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════
-- 1. LOCATIONS
INSERT INTO locations (name, name_en, section, building, floor)
VALUES (
        'الجناح أ',
        'Wing A',
        'ذكور',
        'المبنى الرئيسي',
        1
    ),
    (
        'الجناح ب',
        'Wing B',
        'ذكور',
        'المبنى الرئيسي',
        1
    ),
    (
        'العيادة',
        'Clinic',
        'خدمات',
        'المبنى الرئيسي',
        0
    ),
    ('المطبخ', 'Kitchen', 'خدمات', 'المبنى الخدمي', 0),
    ('الإدارة', 'Admin', 'خدمات', 'المبنى الرئيسي', 2),
    (
        'غرفة العلاج',
        'Therapy',
        'خدمات',
        'المبنى الرئيسي',
        1
    ) ON CONFLICT DO NOTHING;
-- 2. EMPLOYEES
INSERT INTO employees (
        full_name,
        employee_number,
        job_title,
        department,
        section,
        phone,
        is_active
    )
VALUES (
        'أحمد محمد',
        'EMP1001',
        'ممرض',
        'التمريض',
        'ذكور',
        '0501234567',
        true
    ),
    (
        'فاطمة علي',
        'EMP1002',
        'ممرضة',
        'التمريض',
        'إناث',
        '0501234568',
        true
    ),
    (
        'خالد العتيبي',
        'EMP1003',
        'أخصائي علاج طبيعي',
        'العلاج الطبيعي',
        'خدمات',
        '0501234569',
        true
    ),
    (
        'نورة السالم',
        'EMP1004',
        'أخصائية اجتماعية',
        'الخدمات الاجتماعية',
        'خدمات',
        '0501234570',
        true
    ),
    (
        'محمد الشهري',
        'EMP1005',
        'فني صيانة',
        'الصيانة',
        'خدمات',
        '0501234571',
        true
    ) ON CONFLICT DO NOTHING;
-- 3. MEDICATION SCHEDULES
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        status
    )
SELECT id,
    'باراسيتامول',
    '500mg',
    'مرة يومياً',
    CURRENT_DATE - 10,
    'active'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        status
    )
SELECT id,
    'أوميبرازول',
    '20mg',
    'مرتين يومياً',
    CURRENT_DATE - 15,
    'active'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        status
    )
SELECT id,
    'فيتامين د',
    '1000IU',
    'مرة يومياً',
    CURRENT_DATE - 30,
    'active'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        status
    )
SELECT id,
    'حديد',
    '65mg',
    'مرة يومياً',
    CURRENT_DATE - 7,
    'active'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO medication_schedules (
        beneficiary_id,
        medication_name,
        dosage,
        frequency,
        start_date,
        status
    )
SELECT id,
    'كالسيوم',
    '600mg',
    'مرتين يومياً',
    CURRENT_DATE - 20,
    'active'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
-- 4. VITAL SIGNS (uses heart_rate, measured_at, measured_by)
INSERT INTO vital_signs (
        beneficiary_id,
        measured_at,
        temperature,
        heart_rate,
        blood_pressure_systolic,
        blood_pressure_diastolic,
        oxygen_saturation,
        respiratory_rate,
        measured_by
    )
SELECT id,
    CURRENT_TIMESTAMP - (random() * interval '7 days'),
    36.2 + random() * 1.5,
    65 + floor(random() * 25),
    110 + floor(random() * 30),
    70 + floor(random() * 15),
    95 + floor(random() * 5),
    14 + floor(random() * 6),
    'الممرض أحمد'
FROM beneficiaries
LIMIT 25;
-- 5. BENEFICIARY PREFERENCES (Dignity File)
INSERT INTO beneficiary_preferences (
        beneficiary_id,
        preferred_name,
        communication_style,
        language_preference
    )
SELECT id,
    split_part(full_name, ' ', 1),
    'شفهي مباشر',
    'العربية'
FROM beneficiaries
LIMIT 30 ON CONFLICT (beneficiary_id) DO NOTHING;
-- 6. REHAB GOALS
INSERT INTO rehab_goals (
        beneficiary_id,
        domain,
        goal_title,
        goal_description,
        target_date,
        status,
        progress_percentage,
        assigned_department
    )
SELECT id,
    'physical',
    'تحسين المشي',
    'هدف تأهيلي لتحسين المشي',
    CURRENT_DATE + 60,
    'in_progress',
    floor(random() * 80),
    'قسم التأهيل'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO rehab_goals (
        beneficiary_id,
        domain,
        goal_title,
        goal_description,
        target_date,
        status,
        progress_percentage,
        assigned_department
    )
SELECT id,
    'speech',
    'تطوير النطق',
    'هدف تأهيلي لتحسين النطق',
    CURRENT_DATE + 45,
    'in_progress',
    floor(random() * 70),
    'قسم التأهيل'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO rehab_goals (
        beneficiary_id,
        domain,
        goal_title,
        goal_description,
        target_date,
        status,
        progress_percentage,
        assigned_department
    )
SELECT id,
    'occupational',
    'الاستقلالية',
    'هدف تأهيلي للاعتماد على النفس',
    CURRENT_DATE + 30,
    'in_progress',
    floor(random() * 90),
    'قسم التأهيل'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO rehab_goals (
        beneficiary_id,
        domain,
        goal_title,
        goal_description,
        target_date,
        status,
        progress_percentage,
        assigned_department
    )
SELECT id,
    'psychological',
    'تعزيز الذاكرة',
    'هدف تأهيلي لتحسين الذاكرة',
    CURRENT_DATE + 90,
    'in_progress',
    0,
    'قسم التأهيل'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
INSERT INTO rehab_goals (
        beneficiary_id,
        domain,
        goal_title,
        goal_description,
        target_date,
        status,
        progress_percentage,
        assigned_department
    )
SELECT id,
    'social',
    'التفاعل الاجتماعي',
    'هدف تأهيلي للتفاعل',
    CURRENT_DATE + 30,
    'in_progress',
    100,
    'قسم التأهيل'
FROM beneficiaries
ORDER BY RANDOM()
LIMIT 5;
-- 7. ASSET CATEGORIES
INSERT INTO om_asset_categories (code, name_ar, name_en)
VALUES ('MED', 'معدات طبية', 'Medical Equipment'),
    ('FUR', 'أثاث', 'Furniture'),
    ('ELE', 'أجهزة كهربائية', 'Electrical') ON CONFLICT DO NOTHING;
-- 8. ASSETS (uses building, floor, room instead of location_id)
INSERT INTO om_assets (
        name_ar,
        name_en,
        asset_code,
        category_id,
        building,
        floor,
        room,
        status,
        condition,
        acquisition_date
    )
SELECT 'مكيف هواء',
    'AC Unit',
    'AST001',
    (
        SELECT id
        FROM om_asset_categories
        LIMIT 1
    ), 'المبنى الرئيسي', '1', 'غرفة 101', 'operational', 'good', CURRENT_DATE - 365;
INSERT INTO om_assets (
        name_ar,
        name_en,
        asset_code,
        category_id,
        building,
        floor,
        room,
        status,
        condition,
        acquisition_date
    )
SELECT 'ثلاجة أدوية',
    'Medicine Fridge',
    'AST002',
    (
        SELECT id
        FROM om_asset_categories
        LIMIT 1
    ), 'المبنى الرئيسي', '0', 'العيادة', 'operational', 'good', CURRENT_DATE - 200;
INSERT INTO om_assets (
        name_ar,
        name_en,
        asset_code,
        category_id,
        building,
        floor,
        room,
        status,
        condition,
        acquisition_date
    )
SELECT 'سرير طبي',
    'Electric Bed',
    'AST003',
    (
        SELECT id
        FROM om_asset_categories
        LIMIT 1
    ), 'المبنى الرئيسي', '1', 'غرفة 102', 'maintenance_needed', 'fair', CURRENT_DATE - 500;
INSERT INTO om_assets (
        name_ar,
        name_en,
        asset_code,
        category_id,
        building,
        floor,
        room,
        status,
        condition,
        acquisition_date
    )
SELECT 'كرسي متحرك',
    'Wheelchair',
    'AST004',
    (
        SELECT id
        FROM om_asset_categories
        LIMIT 1
    ), 'المبنى الرئيسي', '1', 'غرفة 103', 'operational', 'good', CURRENT_DATE - 150;
-- 9. MAINTENANCE REQUESTS (request_number is required NOT NULL)
WITH src AS (
    SELECT id,
        row_number() OVER (
            ORDER BY id
        ) AS rn
    FROM om_assets
    LIMIT 2
)
INSERT INTO om_maintenance_requests (
        request_number,
        asset_id,
        request_type,
        priority,
        title,
        description,
        status,
        reported_date
    )
SELECT 'MR-' || to_char(now(), 'YYYYMMDD') || '-' || rn::text,
    id,
    'corrective',
    'high',
    'طلب صيانة عاجل',
    'وصف طلب الصيانة',
    'pending',
    CURRENT_TIMESTAMP - interval '2 days'
FROM src;
-- 10. SHIFT HANDOVER NOTES (uses handover_by, received_by, notes, shift_type)
INSERT INTO shift_handover_notes (
        shift_type,
        handover_by,
        received_by,
        notes,
        priority
    )
VALUES (
        'صباحي',
        'أحمد محمد',
        'فاطمة علي',
        'ملاحظات الوردية الصباحية - جميع المستفيدين بحالة مستقرة',
        'normal'
    ),
    (
        'صباحي',
        'أحمد محمد',
        'فاطمة علي',
        'ملاحظات الوردية - متابعة حالة المستفيد رقم 15',
        'high'
    ),
    (
        'مسائي',
        'فاطمة علي',
        'خالد العتيبي',
        'ملاحظات الوردية المسائية - لا توجد حالات طارئة',
        'normal'
    ),
    (
        'مسائي',
        'فاطمة علي',
        'خالد العتيبي',
        'ملاحظات متابعة الأدوية المسائية',
        'normal'
    ),
    (
        'ليلي',
        'خالد العتيبي',
        'أحمد محمد',
        'ملاحظات الوردية الليلية - مراقبة الحالات الحرجة',
        'high'
    ),
    (
        'ليلي',
        'خالد العتيبي',
        'أحمد محمد',
        'ملاحظات الوردية - كل شيء على ما يرام',
        'normal'
    );
-- 11. IPC INSPECTIONS (uses compliance_score, no status)
INSERT INTO ipc_inspections (
        location_id,
        inspection_date,
        inspector_name,
        compliance_score,
        total_items,
        compliant_items
    )
SELECT id,
    CURRENT_DATE - 10,
    'مفتش مكافحة العدوى',
    85.0,
    20,
    17
FROM locations
LIMIT 6;
-- 12. GRC STANDARDS
INSERT INTO grc_standards (
        code,
        name_ar,
        name_en,
        description,
        is_mandatory
    )
VALUES (
        'HRSD-01',
        'معايير الرعاية',
        'Care Standards',
        'معايير وزارة الموارد البشرية',
        true
    ),
    (
        'ISO-9001',
        'نظام الجودة',
        'Quality Management',
        'معيار الأيزو لإدارة الجودة',
        true
    ),
    (
        'MHRS-01',
        'الصحة والسلامة',
        'Health & Safety',
        'معايير الصحة والسلامة',
        true
    ) ON CONFLICT DO NOTHING;
-- ═══════════════════════════════════════════════════════════════════════════════
-- VERIFICATION
-- ═══════════════════════════════════════════════════════════════════════════════
SELECT 'SEEDING COMPLETE!' as status;
SELECT 'locations' as table_name,
    COUNT(*) as records
FROM locations
UNION ALL
SELECT 'employees',
    COUNT(*)
FROM employees
UNION ALL
SELECT 'medication_schedules',
    COUNT(*)
FROM medication_schedules
UNION ALL
SELECT 'vital_signs',
    COUNT(*)
FROM vital_signs
UNION ALL
SELECT 'beneficiary_preferences',
    COUNT(*)
FROM beneficiary_preferences
UNION ALL
SELECT 'rehab_goals',
    COUNT(*)
FROM rehab_goals
UNION ALL
SELECT 'om_assets',
    COUNT(*)
FROM om_assets
UNION ALL
SELECT 'om_maintenance_requests',
    COUNT(*)
FROM om_maintenance_requests
UNION ALL
SELECT 'shift_handover_notes',
    COUNT(*)
FROM shift_handover_notes
UNION ALL
SELECT 'ipc_inspections',
    COUNT(*)
FROM ipc_inspections
UNION ALL
SELECT 'grc_standards',
    COUNT(*)
FROM grc_standards
ORDER BY table_name;