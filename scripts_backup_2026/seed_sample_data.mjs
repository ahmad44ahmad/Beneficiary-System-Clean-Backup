/**
 * Data Seeding Script - Populate empty tables with sample data
 * Seeds: daily_care_logs, medication_schedules, rehab_goals, om_preventive_schedules
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

async function seedData() {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL\n');

    try {
        // Get some beneficiary IDs to link data to
        const beneficiariesResult = await client.query(`
      SELECT id, national_id, full_name FROM beneficiaries LIMIT 20
    `);
        const beneficiaries = beneficiariesResult.rows;

        if (beneficiaries.length === 0) {
            console.log('❌ No beneficiaries found. Cannot seed related data.');
            return;
        }

        console.log(`Found ${beneficiaries.length} beneficiaries to link data to\n`);

        // Get asset IDs for maintenance schedules
        const assetsResult = await client.query(`
      SELECT id, name_ar FROM om_assets LIMIT 10
    `);
        const assets = assetsResult.rows;

        // 1. Seed daily_care_logs
        console.log('📝 Seeding daily_care_logs...');
        const shifts = ['صباحي', 'مسائي', 'ليلي'];
        const moods = ['سعيد', 'محايد', 'حزين', 'قلق', 'مرتاح'];
        const sleepQuality = ['ممتاز', 'جيد', 'متوسط', 'سيء'];

        for (let i = 0; i < 20; i++) {
            const beneficiary = beneficiaries[i % beneficiaries.length];
            const daysAgo = Math.floor(i / 3);
            const logDate = new Date();
            logDate.setDate(logDate.getDate() - daysAgo);

            await client.query(`
        INSERT INTO daily_care_logs (
          beneficiary_id, shift, log_date, log_time,
          temperature, pulse, blood_pressure_systolic, blood_pressure_diastolic,
          oxygen_saturation, mood, sleep_quality, medications_given, bathing_done,
          notes, requires_followup
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
        ON CONFLICT DO NOTHING
      `, [
                beneficiary.id,
                shifts[i % 3],
                logDate.toISOString().split('T')[0],
                `${8 + (i % 3) * 8}:00:00`,
                36.5 + (Math.random() * 1.5),
                70 + Math.floor(Math.random() * 20),
                110 + Math.floor(Math.random() * 30),
                70 + Math.floor(Math.random() * 15),
                95 + Math.floor(Math.random() * 5),
                moods[Math.floor(Math.random() * moods.length)],
                sleepQuality[Math.floor(Math.random() * sleepQuality.length)],
                Math.random() > 0.3,
                Math.random() > 0.5,
                'ملاحظات الرعاية اليومية - حالة المستفيد مستقرة',
                Math.random() > 0.8
            ]);
        }
        console.log('   ✅ Seeded 20 daily care logs');

        // 2. Seed medication_schedules
        console.log('📋 Seeding medication_schedules...');
        const medications = [
            { name: 'باراسيتامول', dosage: '500mg' },
            { name: 'أوميبرازول', dosage: '20mg' },
            { name: 'ميتفورمين', dosage: '850mg' },
            { name: 'أملوديبين', dosage: '5mg' },
            { name: 'أتورفاستاتين', dosage: '10mg' }
        ];
        const frequencies = ['مرة يومياً', 'مرتين يومياً', 'ثلاث مرات يومياً'];

        for (let i = 0; i < 15; i++) {
            const beneficiary = beneficiaries[i % beneficiaries.length];
            const med = medications[i % medications.length];
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);

            await client.query(`
        INSERT INTO medication_schedules (
          beneficiary_id, medication_name, dosage, frequency,
          times, start_date, status, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT DO NOTHING
      `, [
                beneficiary.id,
                med.name,
                med.dosage,
                frequencies[i % 3],
                ['08:00', '20:00'].slice(0, (i % 3) + 1),
                startDate.toISOString().split('T')[0],
                'active',
                'جدول الدواء المعتاد'
            ]);
        }
        console.log('   ✅ Seeded 15 medication schedules');

        // 3. Seed rehab_goals
        console.log('🎯 Seeding rehab_goals...');
        const domains = ['physical', 'speech', 'self_care', 'cognitive', 'social'];
        const goalTemplates = [
            { title: 'المشي باستقلالية لمسافة 50 متر', desc: 'تحسين القدرة على المشي' },
            { title: 'نطق 20 كلمة جديدة بوضوح', desc: 'تطوير مهارات النطق' },
            { title: 'ارتداء الملابس باستقلالية', desc: 'تعزيز مهارات العناية الذاتية' },
            { title: 'التعرف على 10 أشياء جديدة', desc: 'تحسين القدرات المعرفية' },
            { title: 'المشاركة في نشاط جماعي', desc: 'تعزيز التفاعل الاجتماعي' }
        ];

        for (let i = 0; i < 10; i++) {
            const beneficiary = beneficiaries[i % beneficiaries.length];
            const domain = domains[i % domains.length];
            const goal = goalTemplates[i % goalTemplates.length];
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 90);

            await client.query(`
        INSERT INTO rehab_goals (
          beneficiary_id, domain, goal_title, goal_description,
          measurement_type, baseline_value, target_value, current_value,
          start_date, target_date, status, progress_percentage,
          assigned_department, linked_national_goal
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        ON CONFLICT DO NOTHING
      `, [
                beneficiary.id,
                domain,
                goal.title,
                goal.desc,
                'count',
                0,
                100,
                Math.floor(Math.random() * 60),
                new Date().toISOString().split('T')[0],
                targetDate.toISOString().split('T')[0],
                'in_progress',
                Math.floor(Math.random() * 70),
                'قسم التأهيل',
                'تمكين ذوي الإعاقة'
            ]);
        }
        console.log('   ✅ Seeded 10 rehabilitation goals');

        // 4. Seed om_preventive_schedules
        if (assets.length > 0) {
            console.log('🔧 Seeding om_preventive_schedules...');
            const scheduleTypes = ['صيانة دورية', 'فحص شهري', 'تنظيف أسبوعي', 'معايرة ربع سنوية'];

            for (let i = 0; i < Math.min(5, assets.length); i++) {
                const asset = assets[i];
                const nextDue = new Date();
                nextDue.setDate(nextDue.getDate() + (i * 7));

                await client.query(`
          INSERT INTO om_preventive_schedules (
            asset_id, schedule_type, frequency_days, next_due_date,
            assigned_to, status, notes
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
          ON CONFLICT DO NOTHING
        `, [
                    asset.id,
                    scheduleTypes[i % scheduleTypes.length],
                    30 + (i * 15),
                    nextDue.toISOString().split('T')[0],
                    'فريق الصيانة',
                    'active',
                    'جدول الصيانة الوقائية'
                ]);
            }
            console.log(`   ✅ Seeded ${Math.min(5, assets.length)} preventive schedules`);
        }

        // 5. Verify seeded data
        console.log('\n📊 Verifying seeded data...');
        const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM daily_care_logs) as care_logs,
        (SELECT COUNT(*) FROM medication_schedules) as med_schedules,
        (SELECT COUNT(*) FROM rehab_goals) as goals,
        (SELECT COUNT(*) FROM om_preventive_schedules) as prev_schedules
    `);

        console.log('   Record counts:');
        console.log(`   - daily_care_logs: ${counts.rows[0].care_logs}`);
        console.log(`   - medication_schedules: ${counts.rows[0].med_schedules}`);
        console.log(`   - rehab_goals: ${counts.rows[0].goals}`);
        console.log(`   - om_preventive_schedules: ${counts.rows[0].prev_schedules}`);

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('✅ DATA SEEDING COMPLETE!');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        throw error;
    } finally {
        await client.end();
    }
}

seedData().catch(console.error);
