
import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from earlier step
const supabaseUrl = 'https://ruesovrbhcjphmfdcpsa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1ZXNvdnJiaGNqcGhtZmRjcHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyODM0MTksImV4cCI6MjA4MDg1OTQxOX0.kJY_k7YE19qPXmhtLL4ohrET6hFXec4QLmbg0s2OuGc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
    console.log("Checking Database tables...");

    const tables = [
        'beneficiaries',
        'medical_profiles',
        'daily_care_logs',
        'fall_risk_assessments'
    ];

    let allGood = true;

    for (const table of tables) {
        process.stdout.write(`Checking table '${table}'... `);
        const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });

        if (error) {
            console.log(`❌ MISSING or Error: ${error.message}`);
            allGood = false;
        } else {
            console.log("✅ EXISTS");
        }
    }

    if (allGood) {
        console.log("\nAll required tables appear to be present!");
    } else {
        console.log("\n⚠️ Some tables are missing. Please run the SQL setup script.");
    }
}

checkTables();
