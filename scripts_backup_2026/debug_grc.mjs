// Debug GRC Tables - Check data in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('🔍 Debugging GRC Tables');
console.log('=======================');

async function checkTables() {
    // Check grc_risks
    console.log('\n📊 Checking grc_risks table...');
    const { data: risks, error: risksError } = await supabase
        .from('grc_risks')
        .select('*');

    if (risksError) {
        console.log('❌ grc_risks error:', risksError.message);
        console.log('   Code:', risksError.code);
        console.log('   Details:', risksError.details);
    } else {
        console.log(`✅ grc_risks: ${risks?.length || 0} records`);
        if (risks && risks.length > 0) {
            console.log('   First risk:', risks[0].title);
        }
    }

    // Check grc_ncrs
    console.log('\n📊 Checking grc_ncrs table...');
    const { data: ncrs, error: ncrsError } = await supabase
        .from('grc_ncrs')
        .select('*');

    if (ncrsError) {
        console.log('❌ grc_ncrs error:', ncrsError.message);
    } else {
        console.log(`✅ grc_ncrs: ${ncrs?.length || 0} records`);
    }

    // Check grc_compliance
    console.log('\n📊 Checking grc_compliance table...');
    const { data: compliance, error: complianceError } = await supabase
        .from('grc_compliance')
        .select('*');

    if (complianceError) {
        console.log('❌ grc_compliance error:', complianceError.message);
    } else {
        console.log(`✅ grc_compliance: ${compliance?.length || 0} records`);
    }

    // Check beneficiaries
    console.log('\n📊 Checking beneficiaries table...');
    const { data: beneficiaries, error: beneficiariesError } = await supabase
        .from('beneficiaries')
        .select('id, full_name')
        .limit(5);

    if (beneficiariesError) {
        console.log('❌ beneficiaries error:', beneficiariesError.message);
    } else {
        console.log(`✅ beneficiaries: ${beneficiaries?.length || 0} records (showing first 5)`);
        beneficiaries?.forEach(b => console.log(`   - ${b.full_name || b.id}`));
    }
}

checkTables().then(() => {
    console.log('\n✨ Debug complete');
});
