// Add RLS policies for anon role via SQL using the REST API
const SUPABASE_URL = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const SERVICE_ROLE_KEY = 'sb_secret_-NuRJEzWuDNpxO9euyEZAA_ZSUDoUWA';

async function executeSQL(sql) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
            'apikey': SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: sql })
    });

    if (!res.ok) {
        // The RPC might not exist, try a different approach
        return { error: await res.text() };
    }

    return await res.json();
}

async function addRLSPolicies() {
    console.log('=== ADDING RLS POLICIES FOR ANON ROLE ===\n');

    const tables = [
        'beneficiaries', 'medication_schedules', 'vital_signs',
        'locations', 'employees', 'shift_handover_notes',
        'grc_standards', 'daily_care_logs', 'grc_risks', 'grc_compliance',
        'ipc_inspections', 'rehab_plans', 'social_research', 'staff', 'meals',
        'medical_profiles', 'medical_records'
    ];

    // Since we can't directly execute SQL via REST, we'll use the storage endpoint
    // to work around. Let's instead seed more data and ensure RLS policies exist

    console.log('RLS policies need to be added via Supabase SQL Editor or CLI.');
    console.log('Run this SQL in Supabase SQL Editor:\n');

    let sql = '-- Run this in Supabase SQL Editor\n\n';

    for (const t of tables) {
        sql += `-- ${t}\n`;
        sql += `DROP POLICY IF EXISTS allow_anon_select_${t} ON ${t};\n`;
        sql += `CREATE POLICY allow_anon_select_${t} ON ${t} FOR SELECT TO anon USING (true);\n\n`;
    }

    console.log(sql);

    // Now let's also verify data exists
    console.log('\n=== VERIFYING DATA EXISTS ===');
    for (const t of tables) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=id&limit=1`, {
                headers: {
                    'apikey': SERVICE_ROLE_KEY,
                    'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`${t}: ${data.length > 0 ? '✓ Has data' : '✗ EMPTY'}`);
            } else {
                console.log(`${t}: ERROR - ${res.status}`);
            }
        } catch (e) {
            console.log(`${t}: ERROR - ${e.message}`);
        }
    }
}

addRLSPolicies().catch(console.error);
