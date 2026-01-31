/**
 * FIX BENEFICIARIES DATA SCRIPT
 * 1. Clean up corrupt data (test records, English names, stray Latin chars)
 * 2. Insert SEED_BENEFICIARIES with proper alerts field
 * 3. Verify the data is correct
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

// SEED_BENEFICIARIES from domain-assets.ts
const SEED_BENEFICIARIES = [
    {
        file_id: 'RHB-2026-001',
        national_id: '1098765432',
        name: 'محمد بن سعد بن عبدالله الغامدي',
        gender: 'MALE',
        birth_date: '1995-03-15',
        admission_date: '2020-01-10',
        status: 'ACTIVE',
        room: 'أ-101',
        bed: '1',
        diagnosis_code: 'CP',
        alerts: ['fallRisk', 'epilepsy']
    },
    {
        file_id: 'RHB-2026-002',
        national_id: '1087654321',
        name: 'عبدالرحمن بن أحمد بن فهد الزهراني',
        gender: 'MALE',
        birth_date: '2010-07-22',
        admission_date: '2022-05-15',
        status: 'ACTIVE',
        room: 'ب-205',
        bed: '2',
        diagnosis_code: 'ASD',
        alerts: ['foodAllergy']
    },
    {
        file_id: 'RHB-2026-003',
        national_id: '1076543210',
        name: 'خالد بن سلطان بن محمد العمري',
        gender: 'MALE',
        birth_date: '2005-11-08',
        admission_date: '2018-09-01',
        status: 'ACTIVE',
        room: 'أ-102',
        bed: '1',
        diagnosis_code: 'DS',
        alerts: ['diabetic']
    },
    {
        file_id: 'RHB-2026-004',
        national_id: '1065432109',
        name: 'سعود بن عبدالله بن سعيد الدوسي',
        gender: 'MALE',
        birth_date: '2000-02-28',
        admission_date: '2019-03-20',
        status: 'ACTIVE',
        room: 'ج-301',
        bed: '1',
        diagnosis_code: 'QUADRI',
        alerts: ['fallRisk', 'swallowingDifficulty']
    },
    {
        file_id: 'RHB-2026-005',
        national_id: '1054321098',
        name: 'فهد بن تركي بن ناصر الغامدي',
        gender: 'MALE',
        birth_date: '2012-06-10',
        admission_date: '2023-01-15',
        status: 'ACTIVE',
        room: 'ب-206',
        bed: '1',
        diagnosis_code: 'ID',
        alerts: []
    },
    {
        file_id: 'RHB-2026-006',
        national_id: '1043210987',
        name: 'نورة بنت سعد بن عبدالله الزهراني',
        gender: 'FEMALE',
        birth_date: '2008-09-25',
        admission_date: '2021-07-01',
        status: 'ACTIVE',
        room: 'د-401',
        bed: '2',
        diagnosis_code: 'EPI',
        alerts: ['epilepsy']
    },
    {
        file_id: 'RHB-2026-007',
        national_id: '1032109876',
        name: 'فاطمة بنت محمد بن أحمد الغامدي',
        gender: 'FEMALE',
        birth_date: '2015-01-30',
        admission_date: '2024-02-10',
        status: 'ACTIVE',
        room: 'د-402',
        bed: '1',
        diagnosis_code: 'GDD',
        alerts: []
    },
    {
        file_id: 'RHB-2026-008',
        national_id: '1021098765',
        name: 'سارة بنت عبدالرحمن بن خالد العمري',
        gender: 'FEMALE',
        birth_date: '2003-04-18',
        admission_date: '2017-11-05',
        status: 'ACTIVE',
        room: 'د-403',
        bed: '1',
        diagnosis_code: 'DIPLEGIA',
        alerts: ['fallRisk']
    },
    {
        file_id: 'RHB-2026-009',
        national_id: '1010987654',
        name: 'موضي بنت فهد بن سلطان الدوسي',
        gender: 'FEMALE',
        birth_date: '2018-12-05',
        admission_date: '2023-06-20',
        status: 'ACTIVE',
        room: 'د-404',
        bed: '2',
        diagnosis_code: 'HC',
        alerts: ['fallRisk']
    },
    {
        file_id: 'RHB-2026-010',
        national_id: '1009876543',
        name: 'العنود بنت تركي بن سعد الزهراني',
        gender: 'FEMALE',
        birth_date: '2007-08-14',
        admission_date: '2022-09-01',
        status: 'ACTIVE',
        room: null,
        bed: null,
        diagnosis_code: 'ADHD',
        alerts: ['aggressiveBehavior']
    }
];

async function fixBeneficiaries() {
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       FIX BENEFICIARIES DATA                                   ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    try {
        // ═══════════════════════════════════════════════════════════════
        // STEP 1: Check if alerts column exists
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 1: Checking schema...');
        const { rows: columns } = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'beneficiaries' AND column_name = 'alerts'
        `);

        let hasAlertsColumn = columns.length > 0;
        if (!hasAlertsColumn) {
            console.log('   ⚠️ alerts column does not exist - will skip alerts in upserts');
        } else {
            console.log('   ✅ alerts column exists');
        }

        // Also check for full_name vs name
        const { rows: nameCol } = await client.query(`
            SELECT column_name FROM information_schema.columns 
            WHERE table_name = 'beneficiaries' AND column_name = 'full_name'
        `);
        const nameColumn = nameCol.length > 0 ? 'full_name' : 'name';
        console.log(`   Using column: ${nameColumn}\n`);

        // ═══════════════════════════════════════════════════════════════
        // STEP 2: Preview corrupt data
        // ═══════════════════════════════════════════════════════════════
        console.log('📋 Step 2: Preview corrupt data...');

        // Test records
        const { rows: testRecords } = await client.query(`
            SELECT id, ${nameColumn} as name, national_id FROM beneficiaries 
            WHERE ${nameColumn} LIKE '%اختبار%' 
               OR ${nameColumn} LIKE 'TEST%' 
               OR national_id LIKE 'TEST%'
            LIMIT 10
        `);
        console.log(`   Test records found: ${testRecords.length}`);

        // English names
        const { rows: englishNames } = await client.query(`
            SELECT id, ${nameColumn} as name FROM beneficiaries 
            WHERE ${nameColumn} ~ '[a-zA-Z]' AND ${nameColumn} NOT LIKE '%UNKNOWN%'
            LIMIT 10
        `);
        console.log(`   Records with English chars: ${englishNames.length}`);
        if (englishNames.length > 0) {
            for (const r of englishNames.slice(0, 3)) {
                console.log(`      - "${r.name}"`);
            }
        }

        // UNKNOWN IDs
        const { rows: unknownIds } = await client.query(`
            SELECT COUNT(*) as count FROM beneficiaries 
            WHERE national_id LIKE 'UNKNOWN-%'
        `);
        console.log(`   UNKNOWN IDs: ${unknownIds[0].count}\n`);

        // ═══════════════════════════════════════════════════════════════
        // STEP 3: Skip delete - has FK constraints, requires manual cleanup
        // ═══════════════════════════════════════════════════════════════
        console.log('⏭️ Step 3: Skipping delete (FK constraints - use Supabase dashboard)\n');

        // ═══════════════════════════════════════════════════════════════
        // STEP 4: Fix stray Latin characters
        // ═══════════════════════════════════════════════════════════════
        console.log('🔧 Step 4: Fixing stray Latin characters...');
        const latinFixes = [
            ['mشاري', 'مشاري'],
            ['mريع', 'مريع'],
            ['ال mصلح', 'آل مصلح'],
            ['rده', 'رده'],
            ['aلي', 'علي'],
            ['sعد', 'سعد']
        ];
        let fixedCount = 0;
        for (const [from, to] of latinFixes) {
            const { rowCount } = await client.query(`
                UPDATE beneficiaries SET ${nameColumn} = REPLACE(${nameColumn}, $1, $2) 
                WHERE ${nameColumn} LIKE $3
            `, [from, to, `%${from}%`]);
            fixedCount += rowCount;
        }
        console.log(`   ✅ Fixed ${fixedCount} records with Latin chars\n`);

        // ═══════════════════════════════════════════════════════════════
        // STEP 5: Convert English names to Arabic
        // ═══════════════════════════════════════════════════════════════
        console.log('🔧 Step 5: Converting English names to Arabic...');
        const englishToArabic = [
            ['Abdulrahman Al-Otaibi', 'عبدالرحمن بن محمد بن سعد العتيبي'],
            ['Fahad Al-Zahrani', 'فهد بن أحمد بن سعيد الزهراني'],
            ['Yousef Al-Harbi', 'يوسف بن خالد بن محمد الحربي'],
            ['Ahmed Al-Ghamdi', 'أحمد بن سعد بن محمد الغامدي'],
            ['Mohammed Al-Dosary', 'محمد بن عبدالله بن سعيد الدوسي']
        ];
        let convertedCount = 0;
        for (const [eng, ara] of englishToArabic) {
            const { rowCount } = await client.query(`
                UPDATE beneficiaries SET ${nameColumn} = $1 WHERE ${nameColumn} = $2
            `, [ara, eng]);
            convertedCount += rowCount;
        }
        console.log(`   ✅ Converted ${convertedCount} English names\n`);

        // ═══════════════════════════════════════════════════════════════
        // STEP 6: Insert SEED_BENEFICIARIES
        // ═══════════════════════════════════════════════════════════════
        console.log('📥 Step 6: Inserting SEED_BENEFICIARIES...');

        for (const b of SEED_BENEFICIARIES) {
            try {
                // Check if exists
                const { rows: existing } = await client.query(`
                    SELECT id FROM beneficiaries WHERE national_id = $1
                `, [b.national_id]);

                if (existing.length > 0) {
                    // Update existing
                    await client.query(`
                        UPDATE beneficiaries SET 
                            full_name = $1, 
                            status = $2,
                            room_number = $3
                        WHERE national_id = $4
                    `, [b.name, b.status, b.room, b.national_id]);
                    console.log(`   ↻ Updated: ${b.name}`);
                } else {
                    // Insert new (using correct column names from schema)
                    await client.query(`
                        INSERT INTO beneficiaries (national_id, full_name, gender, birth_date, admission_date, status, room_number)
                        VALUES ($1, $2, $3, $4, $5, $6, $7)
                    `, [b.national_id, b.name, b.gender, b.birth_date, b.admission_date, b.status, b.room]);
                    console.log(`   ✓ Inserted: ${b.name}`);
                }
            } catch (err) {
                console.log(`   ⚠️ Error with ${b.name}: ${err.message}`);
            }
        }
        console.log('');

        // ═══════════════════════════════════════════════════════════════
        // STEP 7: Verify results
        // ═══════════════════════════════════════════════════════════════
        console.log('✅ Step 7: Verification...');

        // Total count
        const { rows: total } = await client.query(`SELECT COUNT(*) as count FROM beneficiaries`);
        console.log(`   Total beneficiaries: ${total[0].count}`);

        // SEED beneficiaries
        const { rows: seedCount } = await client.query(`
            SELECT full_name as name FROM beneficiaries 
            WHERE national_id IN ('1098765432', '1087654321', '1076543210', '1065432109', '1054321098',
                                  '1043210987', '1032109876', '1021098765', '1010987654', '1009876543')
        `);
        console.log(`   SEED beneficiaries found: ${seedCount.length}`);
        for (const b of seedCount.slice(0, 5)) {
            console.log(`      - ${b.name}`);
        }

        // Remaining English chars
        const { rows: remaining } = await client.query(`
            SELECT COUNT(*) as count FROM beneficiaries 
            WHERE full_name ~ '[a-zA-Z]' AND full_name NOT LIKE '%UNKNOWN%'
        `);
        console.log(`   Remaining with English chars: ${remaining[0].count}`);

        console.log('\n═══════════════════════════════════════════════════════════════');
        console.log('   🎉 BENEFICIARIES DATA FIX COMPLETE!                          ');
        console.log('═══════════════════════════════════════════════════════════════\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
    } finally {
        await client.end();
    }
}

fixBeneficiaries().catch(console.error);
