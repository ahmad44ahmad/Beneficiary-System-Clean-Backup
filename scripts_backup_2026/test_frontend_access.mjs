// Test if Supabase is reachable from the frontend perspective
const SUPABASE_URL = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const ANON_KEY = 'sb_publishable_a7OFrly931U9wXUrTTYwaQ_CmH2h2hG';

async function testSupabaseConnection() {
    console.log('=== TESTING SUPABASE CONNECTION (AS FRONTEND) ===\n');

    // Test 1: Basic health check
    console.log('1. Testing basic connectivity...');
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/beneficiaries?select=id&limit=5`, {
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`
            }
        });
        const text = await res.text();
        console.log(`   Status: ${res.status}`);
        console.log(`   Response: ${text.substring(0, 200)}`);

        if (res.ok) {
            const data = JSON.parse(text);
            console.log(`   ✓ Got ${data.length} beneficiaries`);
        } else {
            console.log(`   ✗ Failed: ${text}`);
        }
    } catch (e) {
        console.log(`   ✗ Error: ${e.message}`);
    }

    // Test 2: Other critical tables
    console.log('\n2. Testing other tables...');
    const tables = ['medication_schedules', 'vital_signs', 'locations', 'employees', 'shift_handover_notes'];

    for (const t of tables) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=id&limit=5`, {
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`   ✓ ${t}: ${data.length} rows`);
            } else {
                const text = await res.text();
                console.log(`   ✗ ${t}: ${res.status} - ${text.substring(0, 100)}`);
            }
        } catch (e) {
            console.log(`   ✗ ${t}: ${e.message}`);
        }
    }
}

testSupabaseConnection().catch(console.error);
