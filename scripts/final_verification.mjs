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

await client.connect();
console.log('═══════════════════════════════════════════════════════════════');
console.log('       FINAL VERIFICATION                                       ');
console.log('═══════════════════════════════════════════════════════════════\n');

// Check alerts column exists
const { rows: alertsCol } = await client.query(`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'beneficiaries' AND column_name = 'alerts'
`);
console.log(`✅ alerts column exists: ${alertsCol.length > 0 ? 'YES' : 'NO'}`);

// Check beneficiaries with alerts
const { rows: withAlerts } = await client.query(`
    SELECT full_name, alerts FROM beneficiaries 
    WHERE alerts IS NOT NULL AND array_length(alerts, 1) > 0
    ORDER BY full_name
    LIMIT 10
`);
console.log(`\n📊 Beneficiaries with alerts: ${withAlerts.length}`);
for (const r of withAlerts) {
    console.log(`   - ${r.full_name}: ${r.alerts.join(', ')}`);
}

// Check total count
const { rows: total } = await client.query(`SELECT COUNT(*) as count FROM beneficiaries`);
console.log(`\n📊 Total beneficiaries: ${total[0].count}`);

// Check test records
const { rows: testRecords } = await client.query(`
    SELECT COUNT(*) as count FROM beneficiaries 
    WHERE full_name LIKE '%اختبار%' OR national_id LIKE 'TEST%'
`);
console.log(`📊 Test records remaining: ${testRecords[0].count}`);

// Check SEED beneficiaries
const { rows: seeds } = await client.query(`
    SELECT full_name, admission_date, alerts FROM beneficiaries 
    WHERE national_id IN ('1098765432', '1087654321', '1076543210', '1065432109', '1054321098',
                          '1043210987', '1032109876', '1021098765', '1010987654', '1009876543')
`);
console.log(`\n📊 SEED beneficiaries: ${seeds.length}`);
for (const s of seeds) {
    console.log(`   - ${s.full_name}`);
    console.log(`     Admission: ${s.admission_date}`);
    console.log(`     Alerts: ${s.alerts?.join(', ') || 'none'}`);
}

console.log('\n═══════════════════════════════════════════════════════════════');
await client.end();
