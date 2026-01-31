/**
 * COMPREHENSIVE DATA SEEDING SCRIPT
 * Seeds ALL empty tables with realistic test data linked to existing beneficiaries
 * Run this to populate the entire BASIRA application with demo data
 */
import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

// Arabic data for realistic content
const ARABIC = {
    moods: ['مستقر', 'سعيد', 'هادئ', 'قلق', 'متفائل'],
    sleepQuality: ['ممتاز', 'جيد', 'متوسط'],
    medications: [
        { name: 'باراسيتامول', dosage: '500mg' },
        { name: 'أوميبرازول', dosage: '20mg' },
        { name: 'ميتفورمين', dosage: '850mg' },
        { name: 'أملوديبين', dosage: '5mg' },
        { name: 'فيتامين د', dosage: '1000IU' },
        { name: 'حديد', dosage: '65mg' },
        { name: 'كالسيوم', dosage: '600mg' }
    ],
    frequency: ['مرة يومياً', 'مرتين يومياً', 'ثلاث مرات يومياً', 'عند اللزوم'],
    assetNames: [
        'مكيف هواء - الجناح أ', 'ثلاجة أدوية', 'سرير طبي كهربائي',
        'كرسي متحرك', 'جهاز قياس ضغط', 'مولد كهربائي',
        'نظام إنذار الحريق', 'مصعد المبنى الرئيسي', 'غسالة صناعية',
        'جهاز أكسجين', 'شاشة مراقبة', 'سخان مياه'
    ],
    assetCategories: ['معدات طبية', 'أثاث', 'أجهزة كهربائية', 'معدات سلامة', 'أنظمة تكييف'],
    locations: ['الجناح أ', 'الجناح ب', 'العيادة', 'المطبخ', 'الإدارة', 'الحديقة', 'غرفة العلاج الطبيعي', 'المخزن'],
    staffNames: ['أحمد محمد', 'فاطمة علي', 'خالد العتيبي', 'نورة السالم', 'محمد الشهري', 'سارة الدوسري'],
    shifts: ['صباحي', 'مسائي', 'ليلي'],
    riskCategories: ['مالية', 'تشغيلية', 'سمعة', 'قانونية', 'سلامة'],
    complianceStatuses: ['compliant', 'non_compliant', 'partial', 'pending'],
    goalDomains: ['physical', 'speech', 'self_care', 'cognitive', 'social'],
    goalTitles: [
        'تحسين المشي باستقلالية',
        'تعزيز مهارات التواصل',
        'الاعتماد على النفس في الأكل',
        'تحسين الذاكرة قصيرة المدى',
        'المشاركة في الأنشطة الجماعية',
        'تطوير مهارات العناية الشخصية',
        'تحسين التوازن والتنسيق'
    ]
};

async function seedAll() {
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       COMPREHENSIVE DATA SEEDING - ALL TABLES                  ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get existing beneficiaries
    const { rows: beneficiaries } = await client.query(
        `SELECT id, national_id, full_name FROM beneficiaries ORDER BY id LIMIT 50`
    );
    console.log(`📋 Found ${beneficiaries.length} beneficiaries to link data\n`);

    if (beneficiaries.length === 0) {
        console.log('❌ No beneficiaries found! Cannot seed related data.');
        await client.end();
        return;
    }

    try {
        // ═══════════════════════════════════════════════════════════════
        // 1. LOCATIONS (needed by many tables as foreign key)
        // ═══════════════════════════════════════════════════════════════
        console.log('📍 Seeding locations...');
        for (const loc of ARABIC.locations) {
            await client.query(`
        INSERT INTO locations (name_ar, name_en, building, floor, capacity, location_type)
        VALUES ($1, $2, 'المبنى الرئيسي', 1, 20, 'ward')
        ON CONFLICT DO NOTHING
      `, [loc, loc]);
        }
        const { rows: locations } = await client.query(`SELECT id FROM locations`);
        console.log(`   ✅ ${locations.length} locations ready\n`);

        // ═══════════════════════════════════════════════════════════════
        // 2. EMPLOYEES (needed for assignments)
        // ═══════════════════════════════════════════════════════════════
        console.log('👥 Seeding employees...');
        const departments = ['التمريض', 'العلاج الطبيعي', 'الخدمات الاجتماعية', 'الإدارة', 'الصيانة'];
        for (let i = 0; i < 10; i++) {
            await client.query(`
        INSERT INTO employees (full_name, employee_id, department, position, phone, email, hire_date, status)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE - $7, 'active')
        ON CONFLICT DO NOTHING
      `, [
                ARABIC.staffNames[i % ARABIC.staffNames.length],
                `EMP${1000 + i}`,
                departments[i % departments.length],
                'موظف',
                `05${Math.floor(Math.random() * 100000000)}`,
                `employee${i}@basira.sa`,
                Math.floor(Math.random() * 1000)
            ]);
        }
        const { rows: employees } = await client.query(`SELECT id, full_name FROM employees`);
        console.log(`   ✅ ${employees.length} employees ready\n`);

        // ═══════════════════════════════════════════════════════════════
        // 3. MEDICAL SERVICES
        // ═══════════════════════════════════════════════════════════════
        console.log('💊 Seeding medical services...');

        // Medical Profiles
        for (const b of beneficiaries.slice(0, 30)) {
            await client.query(`
        INSERT INTO medical_profiles (beneficiary_id, blood_type, allergies, chronic_conditions, disability_type, mobility_status, special_needs, emergency_contact_name, emergency_contact_phone)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [
                b.id,
                ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'][Math.floor(Math.random() * 6)],
                ['لا يوجد', 'البنسلين', 'الغلوتين', 'المكسرات'][Math.floor(Math.random() * 4)],
                ['لا يوجد', 'السكري', 'ضغط الدم', 'أمراض القلب'][Math.floor(Math.random() * 4)],
                ['حركية', 'بصرية', 'سمعية', 'ذهنية', 'متعددة'][Math.floor(Math.random() * 5)],
                ['مستقل', 'يحتاج مساعدة', 'كرسي متحرك'][Math.floor(Math.random() * 3)],
                'متابعة طبية دورية',
                'ولي الأمر',
                `05${Math.floor(Math.random() * 100000000)}`
            ]);
        }
        console.log('   ✅ Medical profiles seeded');

        // Medication Schedules
        for (let i = 0; i < 25; i++) {
            const b = beneficiaries[i % beneficiaries.length];
            const med = ARABIC.medications[Math.floor(Math.random() * ARABIC.medications.length)];
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status, notes)
        VALUES ($1, $2, $3, $4, CURRENT_DATE - $5, 'active', 'جدول ثابت')
        ON CONFLICT DO NOTHING
      `, [b.id, med.name, med.dosage, ARABIC.frequency[Math.floor(Math.random() * 4)], Math.floor(Math.random() * 30)]);
        }
        console.log('   ✅ Medication schedules seeded');

        // Medication Administrations
        const { rows: medSchedules } = await client.query(`SELECT id, beneficiary_id FROM medication_schedules LIMIT 20`);
        for (const sched of medSchedules) {
            for (let d = 0; d < 7; d++) {
                await client.query(`
          INSERT INTO medication_administrations (schedule_id, beneficiary_id, administered_at, administered_by, status, notes)
          VALUES ($1, $2, CURRENT_TIMESTAMP - interval '${d} days', 'الممرضة فاطمة', $3, 'تم الإعطاء بنجاح')
          ON CONFLICT DO NOTHING
        `, [sched.id, sched.beneficiary_id, ['given', 'given', 'given', 'delayed'][Math.floor(Math.random() * 4)]]);
            }
        }
        console.log('   ✅ Medication administrations seeded');

        // Vital Signs
        for (const b of beneficiaries.slice(0, 20)) {
            for (let d = 0; d < 5; d++) {
                await client.query(`
          INSERT INTO vital_signs (beneficiary_id, recorded_at, temperature, pulse, blood_pressure_systolic, blood_pressure_diastolic, respiratory_rate, oxygen_saturation, recorded_by)
          VALUES ($1, CURRENT_TIMESTAMP - interval '${d} days', $2, $3, $4, $5, $6, $7, 'الممرض أحمد')
        `, [
                    b.id,
                    36.2 + Math.random() * 1.5,
                    65 + Math.floor(Math.random() * 25),
                    110 + Math.floor(Math.random() * 30),
                    70 + Math.floor(Math.random() * 15),
                    14 + Math.floor(Math.random() * 6),
                    95 + Math.floor(Math.random() * 5)
                ]);
            }
        }
        console.log('   ✅ Vital signs seeded');

        // Immunizations
        const vaccines = ['الإنفلونزا الموسمية', 'كوفيد-19', 'الكبد الوبائي ب', 'المكورات الرئوية'];
        for (const b of beneficiaries.slice(0, 25)) {
            const vaccine = vaccines[Math.floor(Math.random() * vaccines.length)];
            await client.query(`
        INSERT INTO immunizations (beneficiary_id, vaccine_name, administered_date, administered_by, dose_number, next_dose_date, notes)
        VALUES ($1, $2, CURRENT_DATE - $3, 'الممرض محمد', $4, CURRENT_DATE + 180, 'تم بنجاح')
      `, [b.id, vaccine, Math.floor(Math.random() * 180), 1 + Math.floor(Math.random() * 2)]);
        }
        console.log('   ✅ Immunizations seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 4. SOCIAL SERVICES
        // ═══════════════════════════════════════════════════════════════
        console.log('🏠 Seeding social services...');

        // Social Research
        for (const b of beneficiaries.slice(0, 20)) {
            await client.query(`
        INSERT INTO social_research (national_id, beneficiary_id, research_date, researcher_name, family_status, economic_status, housing_status, recommendations, notes)
        VALUES ($1, $2, CURRENT_DATE - $3, 'الأخصائية نورة', $4, $5, $6, 'متابعة دورية مع الأسرة', 'تم إجراء البحث الاجتماعي')
      `, [
                b.national_id,
                b.id,
                Math.floor(Math.random() * 60),
                ['مستقرة', 'بحاجة لدعم', 'داعمة'][Math.floor(Math.random() * 3)],
                ['جيد', 'متوسط', 'محدود'][Math.floor(Math.random() * 3)],
                ['ملائم', 'يحتاج تحسين', 'بحاجة لمساعدة'][Math.floor(Math.random() * 3)]
            ]);
        }
        console.log('   ✅ Social research seeded');

        // Beneficiary Preferences (Dignity)
        for (const b of beneficiaries.slice(0, 30)) {
            await client.query(`
        INSERT INTO beneficiary_preferences (beneficiary_id, preferred_name, preferred_activities, dietary_preferences, communication_preferences, privacy_preferences, religious_preferences, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'تم تسجيل التفضيلات')
        ON CONFLICT (beneficiary_id) DO NOTHING
      `, [
                b.id,
                b.full_name?.split(' ')[0] || 'المستفيد',
                ['القراءة', 'المشي', 'التلفزيون', 'الزيارات'][Math.floor(Math.random() * 4)],
                ['عادي', 'خالي من السكر', 'مهروس'][Math.floor(Math.random() * 3)],
                ['شفهي', 'كتابي', 'بالإشارة'][Math.floor(Math.random() * 3)],
                'يفضل الخصوصية أثناء العناية الشخصية',
                'التزام بأوقات الصلاة'
            ]);
        }
        console.log('   ✅ Beneficiary preferences (Dignity) seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 5. REHABILITATION
        // ═══════════════════════════════════════════════════════════════
        console.log('🎯 Seeding rehabilitation data...');

        // Rehab Goals
        for (let i = 0; i < 30; i++) {
            const b = beneficiaries[i % beneficiaries.length];
            const domain = ARABIC.goalDomains[Math.floor(Math.random() * ARABIC.goalDomains.length)];
            const goalTitle = ARABIC.goalTitles[Math.floor(Math.random() * ARABIC.goalTitles.length)];
            await client.query(`
        INSERT INTO rehab_goals (beneficiary_id, domain, goal_title, goal_description, target_date, status, progress_percentage, assigned_department)
        VALUES ($1, $2, $3, $4, CURRENT_DATE + $5, $6, $7, 'قسم التأهيل')
      `, [
                b.id,
                domain,
                goalTitle,
                'وصف تفصيلي للهدف التأهيلي',
                30 + Math.floor(Math.random() * 60),
                ['not_started', 'in_progress', 'completed'][Math.floor(Math.random() * 3)],
                Math.floor(Math.random() * 100)
            ]);
        }
        console.log('   ✅ Rehabilitation goals seeded');

        // Rehab Plans
        for (const b of beneficiaries.slice(0, 15)) {
            await client.query(`
        INSERT INTO rehab_plans (national_id, beneficiary_id, plan_name, description, start_date, target_end_date, status, assigned_therapist)
        VALUES ($1, $2, $3, $4, CURRENT_DATE - 30, CURRENT_DATE + 60, 'active', 'أخصائي العلاج الطبيعي')
      `, [b.national_id, b.id, 'خطة تأهيل شاملة', 'خطة علاجية متكاملة تشمل جميع جوانب التأهيل']);
        }
        console.log('   ✅ Rehabilitation plans seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 6. OPERATIONS & MAINTENANCE
        // ═══════════════════════════════════════════════════════════════
        console.log('🔧 Seeding operations & maintenance...');

        // Asset Categories
        for (const cat of ARABIC.assetCategories) {
            await client.query(`
        INSERT INTO om_asset_categories (name_ar, name_en, description)
        VALUES ($1, $2, 'فئة الأصول')
        ON CONFLICT DO NOTHING
      `, [cat, cat]);
        }
        const { rows: categories } = await client.query(`SELECT id FROM om_asset_categories LIMIT 5`);
        console.log(`   ✅ ${categories.length} asset categories ready`);

        // Assets
        for (let i = 0; i < ARABIC.assetNames.length; i++) {
            const locId = locations[i % locations.length]?.id;
            const catId = categories[i % categories.length]?.id;
            await client.query(`
        INSERT INTO om_assets (name_ar, name_en, asset_code, category_id, location_id, status, purchase_date, warranty_expiry, manufacturer, model)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_DATE - $7, CURRENT_DATE + 365, 'الشركة الوطنية', 'موديل 2024')
      `, [
                ARABIC.assetNames[i],
                `Asset ${i + 1}`,
                `AST${1000 + i}`,
                catId,
                locId,
                ['operational', 'needs_maintenance', 'under_repair'][Math.floor(Math.random() * 3)],
                Math.floor(Math.random() * 500)
            ]);
        }
        const { rows: assets } = await client.query(`SELECT id, name_ar FROM om_assets`);
        console.log(`   ✅ ${assets.length} assets seeded`);

        // Maintenance Requests
        for (const asset of assets.slice(0, 10)) {
            await client.query(`
        INSERT INTO om_maintenance_requests (asset_id, request_type, priority, description, requested_by, status, requested_at)
        VALUES ($1, $2, $3, $4, 'محمد الصيانة', $5, CURRENT_TIMESTAMP - interval '${Math.floor(Math.random() * 30)} days')
      `, [
                asset.id,
                ['إصلاح', 'صيانة دورية', 'فحص'][Math.floor(Math.random() * 3)],
                ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                `طلب صيانة ل${asset.name_ar}`,
                ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)]
            ]);
        }
        console.log('   ✅ Maintenance requests seeded');

        // Preventive Schedules
        for (const asset of assets.slice(0, 8)) {
            await client.query(`
        INSERT INTO om_preventive_schedules (asset_id, schedule_type, frequency_days, next_due_date, assigned_to, status)
        VALUES ($1, 'صيانة وقائية', $2, CURRENT_DATE + $3, 'فريق الصيانة', 'active')
      `, [asset.id, 30 + Math.floor(Math.random() * 60), Math.floor(Math.random() * 30)]);
        }
        console.log('   ✅ Preventive schedules seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 7. DAILY CARE
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Seeding daily care data...');

        // More Daily Care Logs
        for (const b of beneficiaries.slice(0, 25)) {
            for (let d = 0; d < 7; d++) {
                for (const shift of ARABIC.shifts) {
                    try {
                        await client.query(`
              INSERT INTO daily_care_logs (beneficiary_id, shift, log_date, temperature, pulse, mood, sleep_quality, medications_given, bathing_done, notes)
              VALUES ($1, $2, CURRENT_DATE - $3, $4, $5, $6, $7, true, true, 'سجل الرعاية اليومية')
            `, [
                            b.id,
                            shift,
                            d,
                            36.2 + Math.random() * 1.2,
                            65 + Math.floor(Math.random() * 20),
                            ARABIC.moods[Math.floor(Math.random() * ARABIC.moods.length)],
                            ARABIC.sleepQuality[Math.floor(Math.random() * ARABIC.sleepQuality.length)]
                        ]);
                    } catch (e) {
                        // Skip duplicates
                    }
                }
            }
        }
        console.log('   ✅ Daily care logs expanded');

        // Shift Handover Notes
        for (let d = 0; d < 14; d++) {
            for (const shift of ARABIC.shifts) {
                const emp = employees[Math.floor(Math.random() * employees.length)];
                await client.query(`
          INSERT INTO shift_handover_notes (shift_date, shift_type, outgoing_nurse, incoming_nurse, general_notes, important_alerts, pending_tasks)
          VALUES (CURRENT_DATE - $1, $2, $3, $4, $5, $6, $7)
        `, [
                    d,
                    shift,
                    emp?.full_name || 'ممرض',
                    ARABIC.staffNames[Math.floor(Math.random() * ARABIC.staffNames.length)],
                    'ملاحظات عامة عن الوردية - سارت الأمور بشكل طبيعي',
                    'لا توجد تنبيهات عاجلة',
                    'متابعة الأدوية للمستفيدين'
                ]);
            }
        }
        console.log('   ✅ Shift handover notes seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 8. GRC - Governance, Risk, Compliance
        // ═══════════════════════════════════════════════════════════════
        console.log('🏛️ Seeding GRC data...');

        // GRC Standards
        const standards = [
            { code: 'HRSD-01', name: 'معايير الرعاية الإيوائية' },
            { code: 'ISO-9001', name: 'نظام إدارة الجودة' },
            { code: 'MHRS-01', name: 'معايير الصحة والسلامة' },
            { code: 'CARF-01', name: 'معايير التأهيل' }
        ];
        for (const std of standards) {
            await client.query(`
        INSERT INTO grc_standards (code, name_ar, name_en, description, category, effective_date, status)
        VALUES ($1, $2, $3, 'معيار الجودة والامتثال', 'operationalial', CURRENT_DATE - 365, 'active')
        ON CONFLICT DO NOTHING
      `, [std.code, std.name, std.name]);
        }
        console.log('   ✅ GRC standards seeded');

        // GRC Compliance Requirements
        const { rows: grcStandards } = await client.query(`SELECT id FROM grc_standards LIMIT 4`);
        for (const std of grcStandards) {
            for (let i = 0; i < 5; i++) {
                await client.query(`
          INSERT INTO grc_compliance_requirements (standard_id, requirement_code, title_ar, description, section, compliance_status, due_date, responsible_person)
          VALUES ($1, $2, $3, 'متطلب الامتثال التفصيلي', $4, $5, CURRENT_DATE + $6, 'مسؤول الجودة')
        `, [
                    std.id,
                    `REQ-${Math.floor(Math.random() * 1000)}`,
                    `متطلب الامتثال ${i + 1}`,
                    `القسم ${i + 1}`,
                    ARABIC.complianceStatuses[Math.floor(Math.random() * ARABIC.complianceStatuses.length)],
                    Math.floor(Math.random() * 90)
                ]);
            }
        }
        console.log('   ✅ Compliance requirements seeded');

        // GRC Risk Categories
        for (const cat of ARABIC.riskCategories) {
            await client.query(`
        INSERT INTO grc_risk_categories (name_ar, name_en, description, color)
        VALUES ($1, $2, 'فئة المخاطر', '#FF5722')
        ON CONFLICT DO NOTHING
      `, [cat, cat]);
        }
        console.log('   ✅ Risk categories seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 9. CATERING
        // ═══════════════════════════════════════════════════════════════
        console.log('🍽️ Seeding catering data...');

        // Catering Categories
        const cateringCats = ['لحوم', 'خضروات', 'فواكه', 'حبوب', 'ألبان', 'مشروبات'];
        for (const cat of cateringCats) {
            await client.query(`
        INSERT INTO catering_categories (name_ar, name_en, description)
        VALUES ($1, $2, 'فئة المواد الغذائية')
        ON CONFLICT DO NOTHING
      `, [cat, cat]);
        }

        // Catering Units
        const units = ['كيلو', 'لتر', 'حبة', 'علبة', 'كرتون'];
        for (const unit of units) {
            await client.query(`
        INSERT INTO catering_units (name_ar, name_en, abbreviation)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [unit, unit, unit.substring(0, 2)]);
        }

        const { rows: catCats } = await client.query(`SELECT id FROM catering_categories`);
        const { rows: catUnits } = await client.query(`SELECT id FROM catering_units`);

        // Catering Items
        const items = ['أرز', 'دجاج', 'لحم', 'خبز', 'حليب', 'تمر', 'عصير', 'خضروات مشكلة'];
        for (let i = 0; i < items.length; i++) {
            await client.query(`
        INSERT INTO catering_items (name_ar, name_en, category_id, unit_id, min_stock, current_stock, unit_price)
        VALUES ($1, $2, $3, $4, 10, $5, $6)
        ON CONFLICT DO NOTHING
      `, [
                items[i],
                items[i],
                catCats[i % catCats.length]?.id,
                catUnits[i % catUnits.length]?.id,
                20 + Math.floor(Math.random() * 80),
                5 + Math.floor(Math.random() * 20)
            ]);
        }
        console.log('   ✅ Catering data seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 10. IPC (Infection Prevention & Control)
        // ═══════════════════════════════════════════════════════════════
        console.log('🧪 Seeding IPC data...');

        // IPC Inspections
        for (let i = 0; i < 15; i++) {
            const locId = locations[i % locations.length]?.id;
            await client.query(`
        INSERT INTO ipc_inspections (location_id, inspection_date, inspector_name, overall_score, hand_hygiene_score, surface_cleaning_score, waste_management_score, status, notes)
        VALUES ($1, CURRENT_DATE - $2, 'مفتش مكافحة العدوى', $3, $4, $5, $6, $7, 'تقرير فحص مكافحة العدوى')
      `, [
                locId,
                Math.floor(Math.random() * 60),
                70 + Math.floor(Math.random() * 30),
                70 + Math.floor(Math.random() * 30),
                70 + Math.floor(Math.random() * 30),
                70 + Math.floor(Math.random() * 30),
                ['passed', 'needs_improvement', 'failed'][Math.floor(Math.random() * 3)]
            ]);
        }
        console.log('   ✅ IPC inspections seeded');

        // IPC Incidents
        for (let i = 0; i < 8; i++) {
            const locId = locations[i % locations.length]?.id;
            await client.query(`
        INSERT INTO ipc_incidents (location_id, incident_date, incident_type, description, severity, reported_by, status, corrective_actions)
        VALUES ($1, CURRENT_DATE - $2, $3, 'وصف الحادثة', $4, 'المشرف الصحي', $5, 'اتخاذ الإجراءات التصحيحية')
      `, [
                locId,
                Math.floor(Math.random() * 90),
                ['تلوث', 'عدوى', 'خطأ في التعقيم'][Math.floor(Math.random() * 3)],
                ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
                ['open', 'investigating', 'closed'][Math.floor(Math.random() * 3)]
            ]);
        }
        console.log('   ✅ IPC incidents seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // 11. ALERTS & INTELLIGENCE
        // ═══════════════════════════════════════════════════════════════
        console.log('🔔 Seeding alerts & intelligence...');

        // Emergency Alerts
        for (let i = 0; i < 10; i++) {
            const b = beneficiaries[i % beneficiaries.length];
            await client.query(`
        INSERT INTO emergency_alerts (beneficiary_id, alert_type, severity, title, description, status, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP - interval '${Math.floor(Math.random() * 30)} days')
      `, [
                b.id,
                ['medical', 'fall', 'behavior', 'medication'][Math.floor(Math.random() * 4)],
                ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
                `تنبيه ${['صحي', 'سلامة', 'دوائي'][Math.floor(Math.random() * 3)]}`,
                'وصف التنبيه التلقائي من النظام',
                ['active', 'acknowledged', 'resolved'][Math.floor(Math.random() * 3)]
            ]);
        }
        console.log('   ✅ Emergency alerts seeded');

        // Risk Alerts
        const { rows: risks } = await client.query(`SELECT id FROM grc_risks LIMIT 10`);
        for (const risk of risks) {
            await client.query(`
        INSERT INTO risk_alerts (risk_id, alert_type, message, severity, status, created_at)
        VALUES ($1, 'threshold_exceeded', 'تجاوز حد المخاطر المحدد', $2, 'active', CURRENT_TIMESTAMP - interval '${Math.floor(Math.random() * 14)} days')
      `, [risk.id, ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]]);
        }
        console.log('   ✅ Risk alerts seeded\n');

        // ═══════════════════════════════════════════════════════════════
        // FINAL COUNTS
        // ═══════════════════════════════════════════════════════════════
        console.log('═══════════════════════════════════════════════════════════════');
        console.log('       FINAL RECORD COUNTS                                      ');
        console.log('═══════════════════════════════════════════════════════════════\n');

        const countTables = [
            'beneficiaries', 'medical_profiles', 'medication_schedules', 'medication_administrations',
            'vital_signs', 'immunizations', 'daily_care_logs', 'shift_handover_notes',
            'social_research', 'beneficiary_preferences', 'rehab_goals', 'rehab_plans',
            'om_assets', 'om_maintenance_requests', 'om_preventive_schedules',
            'grc_risks', 'grc_compliance', 'grc_standards', 'grc_compliance_requirements',
            'ipc_inspections', 'ipc_incidents', 'locations', 'employees',
            'catering_items', 'emergency_alerts', 'risk_alerts'
        ];

        for (const table of countTables) {
            try {
                const { rows } = await client.query(`SELECT COUNT(*) as count FROM "${table}"`);
                console.log(`   ${table}: ${rows[0].count} records`);
            } catch (e) {
                console.log(`   ${table}: ERROR`);
            }
        }

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   🎉 COMPREHENSIVE SEEDING COMPLETE!                           ');
        console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await client.end();
    }
}

seedAll().catch(console.error);
