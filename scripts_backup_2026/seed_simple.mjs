/**
 * Simplified Data Seeding Script - Seeds tables one at a time with error handling
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
    console.log('Connected to Supabase\n');

    // Get beneficiary IDs
    const { rows: beneficiaries } = await client.query(`
    SELECT id, national_id FROM beneficiaries LIMIT 10
  `);
    console.log(`Found ${beneficiaries.length} beneficiaries\n`);

    // 1. Seed medication_schedules (simpler - no complex constraints)
    console.log('📋 Seeding medication_schedules...');
    let medCount = 0;
    for (let i = 0; i < 10; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO medication_schedules (beneficiary_id, medication_name, dosage, frequency, start_date, status)
        VALUES ($1, $2, $3, $4, CURRENT_DATE, 'active')
      `, [b.id, `دواء ${i + 1}`, `${(i + 1) * 50}mg`, 'مرة يومياً']);
            medCount++;
        } catch (e) {
            // Skip duplicates
        }
    }
    console.log(`   ✅ Added ${medCount} medication schedules`);

    // 2. Seed rehab_goals
    console.log('🎯 Seeding rehab_goals...');
    let goalCount = 0;
    const domains = ['physical', 'speech', 'self_care', 'cognitive', 'social'];
    for (let i = 0; i < 8; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        try {
            await client.query(`
        INSERT INTO rehab_goals (beneficiary_id, domain, goal_title, goal_description, target_date, status, progress_percentage)
        VALUES ($1, $2, $3, $4, CURRENT_DATE + 90, 'in_progress', $5)
      `, [b.id, domains[i % 5], `هدف تأهيلي ${i + 1}`, 'وصف الهدف التأهيلي', Math.floor(Math.random() * 70)]);
            goalCount++;
        } catch (e) {
            // Skip errors
        }
    }
    console.log(`   ✅ Added ${goalCount} rehab goals`);

    // 3. Seed daily_care_logs with correct constraint values
    console.log('📝 Seeding daily_care_logs...');
    let careCount = 0;
    const shifts = ['صباحي', 'مسائي', 'ليلي'];
    for (let i = 0; i < 15; i++) {
        const b = beneficiaries[i % beneficiaries.length];
        const daysAgo = Math.floor(i / 3);
        try {
            await client.query(`
        INSERT INTO daily_care_logs (beneficiary_id, shift, log_date, temperature, pulse, mood, notes)
        VALUES ($1, $2, CURRENT_DATE - $3, $4, $5, $6, $7)
      `, [
                b.id,
                shifts[i % 3],
                daysAgo,
                36.5 + Math.random(),
                70 + Math.floor(Math.random() * 20),
                'مستقر',
                'ملاحظات الرعاية اليومية'
            ]);
            careCount++;
        } catch (e) {
            console.log(`   Skip: ${e.message.substring(0, 50)}`);
        }
    }
    console.log(`   ✅ Added ${careCount} daily care logs`);

    // 4. Check om_assets for preventive schedules
    const { rows: assets } = await client.query(`SELECT id FROM om_assets LIMIT 5`);
    if (assets.length > 0) {
        console.log('🔧 Seeding om_preventive_schedules...');
        let prevCount = 0;
        for (let i = 0; i < assets.length; i++) {
            try {
                await client.query(`
          INSERT INTO om_preventive_schedules (asset_id, schedule_type, frequency_days, next_due_date, status)
          VALUES ($1, $2, $3, CURRENT_DATE + $4, 'active')
        `, [assets[i].id, 'صيانة دورية', 30, i * 7]);
                prevCount++;
            } catch (e) {
                // Skip errors
            }
        }
        console.log(`   ✅ Added ${prevCount} preventive schedules`);
    }

    // Final counts
    console.log('\n📊 Final record counts:');
    const counts = await client.query(`
    SELECT 
      (SELECT COUNT(*) FROM daily_care_logs) as care,
      (SELECT COUNT(*) FROM medication_schedules) as meds,
      (SELECT COUNT(*) FROM rehab_goals) as goals,
      (SELECT COUNT(*) FROM om_preventive_schedules) as prev
  `);
    const c = counts.rows[0];
    console.log(`   daily_care_logs: ${c.care}`);
    console.log(`   medication_schedules: ${c.meds}`);
    console.log(`   rehab_goals: ${c.goals}`);
    console.log(`   om_preventive_schedules: ${c.prev}`);

    console.log('\n✅ Seeding complete!');
    await client.end();
}

seedData().catch(e => {
    console.error('Error:', e.message);
    process.exit(1);
});
