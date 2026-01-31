// Final verification - test anon key access to all key tables
const SUPABASE_URL = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const ANON_KEY = 'sb_publishable_a7OFrly931U9wXUrTTYwaQ_CmH2h2hG';

async function verifyAnonAccess() {
    console.log('=== VERIFYING ANON ACCESS TO ALL TABLES ===\n');

    const tables = [
        'beneficiaries', 'medication_schedules', 'vital_signs',
        'locations', 'employees', 'shift_handover_notes',
        'daily_care_logs', 'grc_standards', 'grc_risks', 'grc_compliance',
        'social_research', 'rehab_plans', 'staff', 'meals'
    ];

    let accessIssues = [];

    for (const t of tables) {
        try {
            const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?select=*&limit=3`, {
                headers: {
                    'apikey': ANON_KEY,
                    'Authorization': `Bearer ${ANON_KEY}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    console.log(`✓ ${t}: ${data.length}+ rows accessible`);
                } else {
                    console.log(`⚠ ${t}: 0 rows (empty or RLS blocking)`);
                    accessIssues.push(t);
                }
            } else {
                console.log(`✗ ${t}: ${res.status} ERROR`);
                accessIssues.push(t);
            }
        } catch (e) {
            console.log(`✗ ${t}: ${e.message}`);
            accessIssues.push(t);
        }
    }

    console.log('\n=== SUMMARY ===');
    if (accessIssues.length === 0) {
        console.log('All tables accessible via anon key!');
    } else {
        console.log(`Tables with issues: ${accessIssues.join(', ')}`);
        console.log('\nThese tables need RLS policies for anon read access.');
    }
}

verifyAnonAccess().catch(console.error);
