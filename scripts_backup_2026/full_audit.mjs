// Full Database Audit - Check all tables and their data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 FULL DATABASE AUDIT');
console.log('='.repeat(50));

const tables = [
    'beneficiaries',
    'staff',
    'medical_records',
    'social_services',
    'rehabilitation_plans',
    'alerts',
    'meals',
    'catering_violations',
    'quality_checks',
    'wisdom_entries',
    'conscience_log',
    'activity_log',
    'grc_risks',
    'grc_ncrs',
    'grc_compliance'
];

async function checkTable(tableName) {
    try {
        const { data, error, count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact' })
            .limit(3);

        if (error) {
            return { name: tableName, status: '❌', count: 0, error: error.message };
        }

        return {
            name: tableName,
            status: '✅',
            count: data?.length || 0,
            sample: data?.length > 0 ? Object.keys(data[0]).slice(0, 5) : []
        };
    } catch (e) {
        return { name: tableName, status: '❌', count: 0, error: e.message };
    }
}

async function runAudit() {
    console.log('\n📊 TABLE STATUS:\n');

    const results = [];
    for (const table of tables) {
        const result = await checkTable(table);
        results.push(result);

        if (result.status === '✅') {
            console.log(`${result.status} ${result.name.padEnd(25)} | ${String(result.count).padStart(3)} records | Columns: ${result.sample.join(', ')}`);
        } else {
            console.log(`${result.status} ${result.name.padEnd(25)} | ERROR: ${result.error}`);
        }
    }

    // Summary
    const working = results.filter(r => r.status === '✅').length;
    const failed = results.filter(r => r.status === '❌').length;
    const withData = results.filter(r => r.count > 0).length;

    console.log('\n' + '='.repeat(50));
    console.log('📈 SUMMARY:');
    console.log(`   ✅ Working tables: ${working}/${tables.length}`);
    console.log(`   ❌ Failed tables: ${failed}/${tables.length}`);
    console.log(`   📦 Tables with data: ${withData}/${tables.length}`);

    // Show tables that need data
    const emptyTables = results.filter(r => r.status === '✅' && r.count === 0);
    if (emptyTables.length > 0) {
        console.log('\n⚠️  EMPTY TABLES (may need seeding):');
        emptyTables.forEach(t => console.log(`   - ${t.name}`));
    }

    // Show failed tables
    const failedTables = results.filter(r => r.status === '❌');
    if (failedTables.length > 0) {
        console.log('\n❌ FAILED TABLES (may not exist):');
        failedTables.forEach(t => console.log(`   - ${t.name}: ${t.error}`));
    }

    console.log('\n✨ Audit complete!');
}

runAudit();
