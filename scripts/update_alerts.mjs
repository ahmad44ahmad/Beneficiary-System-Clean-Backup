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

// All SEED alerts
const SEED_ALERTS = [
    { national_id: '1098765432', alerts: ['fallRisk', 'epilepsy'] },
    { national_id: '1087654321', alerts: ['foodAllergy'] },
    { national_id: '1076543210', alerts: ['diabetic'] },
    { national_id: '1065432109', alerts: ['fallRisk', 'swallowingDifficulty'] },
    { national_id: '1043210987', alerts: ['epilepsy'] },
    { national_id: '1021098765', alerts: ['fallRisk'] },
    { national_id: '1010987654', alerts: ['fallRisk'] },
    { national_id: '1009876543', alerts: ['aggressiveBehavior'] }
];

await client.connect();
console.log('Updating alerts for all SEED beneficiaries...\n');

let updated = 0;
for (const seed of SEED_ALERTS) {
    try {
        const { rowCount } = await client.query(`
            UPDATE beneficiaries SET alerts = $1 WHERE national_id = $2
        `, [seed.alerts, seed.national_id]);
        if (rowCount > 0) {
            updated++;
            console.log(`✅ ${seed.national_id}: ${seed.alerts.join(', ')}`);
        } else {
            console.log(`⚠️ ${seed.national_id}: not found`);
        }
    } catch (err) {
        console.log(`❌ ${seed.national_id}: ${err.message}`);
    }
}

console.log(`\n✅ Updated ${updated} SEED beneficiaries with alerts`);

// Verify
const { rows } = await client.query(`
    SELECT full_name, alerts FROM beneficiaries 
    WHERE alerts IS NOT NULL AND array_length(alerts, 1) > 0
`);
console.log(`\n📊 Beneficiaries with alerts: ${rows.length}`);
for (const r of rows) {
    console.log(`   - ${r.full_name}: ${r.alerts.join(', ')}`);
}

await client.end();
