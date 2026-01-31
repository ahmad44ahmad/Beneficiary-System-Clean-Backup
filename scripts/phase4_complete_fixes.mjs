/**
 * PHASE 4: COMPLETE REMAINING FIXES
 * 4.1: Delete test records (may fail due to FK constraints)
 * 4.2: Add alerts column (may fail due to owner permissions)
 * 4.3: Fix admission_date for SEED_BENEFICIARIES
 * 4.5: Verification queries
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

// SEED alerts data
const SEED_ALERTS = [
    { national_id: '1098765432', alerts: ['fallRisk', 'epilepsy'] },
    { national_id: '1087654321', alerts: ['foodAllergy'] },
    { national_id: '1076543210', alerts: ['diabetic'] },
    { national_id: '1065432109', alerts: ['fallRisk', 'swallowingDifficulty'] },
    { national_id: '1054321098', alerts: [] },
    { national_id: '1043210987', alerts: ['epilepsy'] },
    { national_id: '1032109876', alerts: [] },
    { national_id: '1021098765', alerts: ['fallRisk'] },
    { national_id: '1010987654', alerts: ['fallRisk'] },
    { national_id: '1009876543', alerts: ['aggressiveBehavior'] }
];

// SEED admission dates
const SEED_DATES = [
    { national_id: '1098765432', date: '2020-01-10' },
    { national_id: '1087654321', date: '2022-05-15' },
    { national_id: '1076543210', date: '2018-09-01' },
    { national_id: '1065432109', date: '2019-03-20' },
    { national_id: '1054321098', date: '2023-01-15' },
    { national_id: '1043210987', date: '2021-07-01' },
    { national_id: '1032109876', date: '2024-02-10' },
    { national_id: '1021098765', date: '2017-11-05' },
    { national_id: '1010987654', date: '2023-06-20' },
    { national_id: '1009876543', date: '2022-09-01' }
];

async function phase4() {
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       PHASE 4: COMPLETE REMAINING FIXES                        ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    const results = {
        testRecordsDeleted: 0,
        alertsColumnAdded: false,
        alertsUpdated: 0,
        admissionDatesFixed: 0
    };

    try {
        // ═══════════════════════════════════════════════════════════════
        // 4.1: Preview and attempt to delete test records
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 4.1: Test Records...');

        const { rows: testRecords } = await client.query(`
            SELECT id, full_name, national_id FROM beneficiaries 
            WHERE full_name LIKE '%اختبار%' 
               OR national_id LIKE 'TEST%'
               OR full_name LIKE '%حالة اختبار%'
        `);
        console.log(`   Found ${testRecords.length} test records:`);
        for (const r of testRecords.slice(0, 5)) {
            console.log(`      - ${r.full_name} (${r.national_id})`);
        }

        if (testRecords.length > 0) {
            try {
                // First delete related records in child tables
                for (const r of testRecords) {
                    await client.query(`DELETE FROM daily_care_logs WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM medical_profiles WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM medication_schedules WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM vital_signs WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM immunizations WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM social_research WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM beneficiary_preferences WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM rehab_goals WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM rehab_plans WHERE beneficiary_id = $1`, [r.id]);
                    await client.query(`DELETE FROM emergency_alerts WHERE beneficiary_id = $1`, [r.id]);
                }
                // Now delete beneficiaries
                const { rowCount } = await client.query(`
                    DELETE FROM beneficiaries 
                    WHERE full_name LIKE '%اختبار%' 
                       OR national_id LIKE 'TEST%'
                       OR full_name LIKE '%حالة اختبار%'
                `);
                results.testRecordsDeleted = rowCount;
                console.log(`   ✅ Deleted ${rowCount} test records\n`);
            } catch (err) {
                console.log(`   ⚠️ Cannot delete: ${err.message}`);
                console.log(`   → Use Supabase Dashboard to delete manually\n`);
            }
        } else {
            console.log('   ✅ No test records found\n');
        }

        // ═══════════════════════════════════════════════════════════════
        // 4.2: Add alerts column
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 4.2: Alerts Column...');

        // Check if exists
        const { rows: alertsCol } = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'beneficiaries' AND column_name = 'alerts'
        `);

        if (alertsCol.length === 0) {
            try {
                await client.query(`ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS alerts TEXT[] DEFAULT '{}'`);
                results.alertsColumnAdded = true;
                console.log('   ✅ Added alerts column\n');
            } catch (err) {
                console.log(`   ⚠️ Cannot add column: ${err.message}`);
                console.log('   → Run this SQL in Supabase SQL Editor:');
                console.log('   ALTER TABLE beneficiaries ADD COLUMN IF NOT EXISTS alerts TEXT[] DEFAULT \'{}\';');
                console.log('');
            }
        } else {
            results.alertsColumnAdded = true;
            console.log('   ✅ alerts column already exists');

            // Update alerts for SEED_BENEFICIARIES
            console.log('   Updating alerts for SEED_BENEFICIARIES...');
            for (const seed of SEED_ALERTS) {
                if (seed.alerts.length > 0) {
                    try {
                        const { rowCount } = await client.query(`
                            UPDATE beneficiaries SET alerts = $1 WHERE national_id = $2
                        `, [seed.alerts, seed.national_id]);
                        if (rowCount > 0) {
                            results.alertsUpdated++;
                            console.log(`      ✓ ${seed.national_id}: ${seed.alerts.join(', ')}`);
                        }
                    } catch (err) {
                        console.log(`      ⚠️ ${seed.national_id}: ${err.message}`);
                    }
                }
            }
            console.log(`   ✅ Updated ${results.alertsUpdated} records with alerts\n`);
        }

        // ═══════════════════════════════════════════════════════════════
        // 4.3: Fix admission_date for SEED_BENEFICIARIES
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 4.3: Admission Dates...');

        for (const seed of SEED_DATES) {
            try {
                const { rowCount } = await client.query(`
                    UPDATE beneficiaries SET admission_date = $1 WHERE national_id = $2
                `, [seed.date, seed.national_id]);
                if (rowCount > 0) {
                    results.admissionDatesFixed++;
                }
            } catch (err) {
                console.log(`   ⚠️ ${seed.national_id}: ${err.message}`);
            }
        }
        console.log(`   ✅ Updated ${results.admissionDatesFixed} SEED admission dates`);

        // Set default date for NULL/undefined admission_date
        try {
            const { rowCount } = await client.query(`
                UPDATE beneficiaries 
                SET admission_date = '2023-01-01' 
                WHERE admission_date IS NULL
            `);
            console.log(`   ✅ Set default date for ${rowCount} records with NULL dates\n`);
        } catch (err) {
            console.log(`   ⚠️ Default date update: ${err.message}\n`);
        }

        // ═══════════════════════════════════════════════════════════════
        // 4.5: Verification
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 4.5: Verification...');

        // Total count
        const { rows: total } = await client.query(`SELECT COUNT(*) as count FROM beneficiaries`);
        console.log(`   Total beneficiaries: ${total[0].count}`);

        // Test records remaining
        const { rows: testRemaining } = await client.query(`
            SELECT COUNT(*) as count FROM beneficiaries 
            WHERE full_name LIKE '%اختبار%' 
               OR national_id LIKE 'TEST%'
        `);
        console.log(`   Test records remaining: ${testRemaining[0].count}`);

        // Alerts check
        if (results.alertsColumnAdded) {
            try {
                const { rows: withAlerts } = await client.query(`
                    SELECT full_name, alerts FROM beneficiaries 
                    WHERE alerts IS NOT NULL AND array_length(alerts, 1) > 0
                    LIMIT 5
                `);
                console.log(`   Records with alerts: ${withAlerts.length}`);
                for (const r of withAlerts) {
                    console.log(`      - ${r.full_name}: ${r.alerts?.join(', ')}`);
                }
            } catch (err) {
                console.log(`   ⚠️ Alerts check failed: ${err.message}`);
            }
        }

        // Admission date check
        const { rows: withDates } = await client.query(`
            SELECT full_name, admission_date FROM beneficiaries 
            WHERE admission_date IS NOT NULL 
            LIMIT 5
        `);
        console.log(`   Sample admission dates:`);
        for (const r of withDates) {
            console.log(`      - ${r.full_name}: ${r.admission_date}`);
        }

        // ═══════════════════════════════════════════════════════════════
        // Summary
        // ═══════════════════════════════════════════════════════════════
        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   PHASE 4 SUMMARY                                              ');
        console.log('═══════════════════════════════════════════════════════════════');
        console.log(`   Test records deleted: ${results.testRecordsDeleted}`);
        console.log(`   Alerts column: ${results.alertsColumnAdded ? '✅' : '❌ (needs Supabase Dashboard)'}`);
        console.log(`   Alerts updated: ${results.alertsUpdated}`);
        console.log(`   Admission dates fixed: ${results.admissionDatesFixed}`);
        console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await client.end();
    }
}

phase4().catch(console.error);
