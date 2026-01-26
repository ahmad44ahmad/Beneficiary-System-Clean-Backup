// Focused Database Check
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check(name) {
    const { data, error } = await supabase.from(name).select('*').limit(1);
    if (error) return `❌ ${name}: ${error.message}`;
    return `✅ ${name}: ${data?.length || 0}+ records`;
}

async function main() {
    console.log('📊 DATABASE CHECK\n');

    // Core tables
    console.log(await check('beneficiaries'));
    console.log(await check('staff'));
    console.log(await check('grc_risks'));
    console.log(await check('grc_ncrs'));
    console.log(await check('grc_compliance'));
    console.log(await check('medical_records'));
    console.log(await check('alerts'));
    console.log(await check('meals'));
    console.log(await check('catering_violations'));

    // Get beneficiary sample
    console.log('\n👥 BENEFICIARY SAMPLE:');
    const { data: beneficiaries } = await supabase.from('beneficiaries').select('id, full_name, status').limit(5);
    beneficiaries?.forEach(b => console.log(`   - ${b.full_name} (${b.status})`));

    // Get risk sample
    console.log('\n⚠️ RISK SAMPLE:');
    const { data: risks } = await supabase.from('grc_risks').select('title, risk_score, status').limit(5);
    risks?.forEach(r => console.log(`   - ${r.title} (score: ${r.risk_score}, ${r.status})`));

    console.log('\n✨ Check complete!');
}

main();
