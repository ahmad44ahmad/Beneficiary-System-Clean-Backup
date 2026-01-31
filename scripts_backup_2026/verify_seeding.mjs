import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function verifySeeding() {
    await client.connect();

    const tables = [
        'beneficiaries', 'locations', 'employees', 'medication_schedules',
        'vital_signs', 'beneficiary_preferences', 'rehab_goals',
        'om_asset_categories', 'om_assets', 'om_maintenance_requests',
        'shift_handover_notes', 'ipc_inspections', 'grc_standards',
        'grc_risks', 'grc_compliance', 'daily_care_logs', 'social_research', 'rehab_plans'
    ];

    let output = 'FINAL SEEDING RESULTS:\n\n';
    let populated = 0, empty = 0;

    for (const t of tables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as count FROM ${t}`);
            const count = parseInt(rows[0].count);
            const status = count > 0 ? 'OK' : 'EMPTY';
            output += `${status.padEnd(6)} ${t.padEnd(30)} ${count}\n`;
            if (count > 0) populated++; else empty++;
        } catch (e) {
            output += `ERROR ${t.padEnd(30)} ${e.message.split('\n')[0]}\n`;
        }
    }

    output += `\nSUMMARY: ${populated} populated, ${empty} empty\n`;

    fs.writeFileSync('seeding_results.txt', output);
    console.log(output);

    await client.end();
}

verifySeeding().catch(console.error);
