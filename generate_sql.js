// Script to generate SQL INSERT statements for beneficiaries
const fs = require('fs');
const path = require('path');

// Read the TypeScript file
const tsContent = fs.readFileSync(path.join(__dirname, 'src/data/beneficiaries.ts'), 'utf8');

// Extract the array using eval (safe since it's our own code)
const dataMatch = tsContent.match(/export const beneficiaries: Beneficiary\[\] = (\[[\s\S]*?\]);/);
if (!dataMatch) {
    console.error('Could not extract beneficiaries array');
    process.exit(1);
}

// Parse the JavaScript object array
const beneficiariesCode = dataMatch[1];
const beneficiaries = eval(beneficiariesCode);

console.log(`Found ${beneficiaries.length} beneficiaries`);

// Helper function to escape SQL strings
function escapeSql(str) {
    if (str === null || str === undefined) return 'NULL';
    if (typeof str === 'number') return str;
    if (typeof str === 'boolean') return str;
    return "'" + String(str).replace(/'/g, "''") + "'";
}

// Generate SQL INSERT statements
const sqlStatements = [];

// Delete existing records first
sqlStatements.push('-- Clear existing beneficiaries');
sqlStatements.push('TRUNCATE TABLE public.beneficiaries RESTART IDENTITY CASCADE;');
sqlStatements.push('');

// Generate INSERT statements in batches of 10 for readability
for (let i = 0; i < beneficiaries.length; i += 10) {
    const batch = beneficiaries.slice(i, Math.min(i + 10, beneficiaries.length));

    sqlStatements.push(`-- Batch ${Math.floor(i / 10) + 1} (rows ${i + 1}-${Math.min(i + 10, beneficiaries.length)})`);

    batch.forEach(b => {
        const values = [
            escapeSql(b.id),
            escapeSql(b.nationalId),
            escapeSql(b.fullName),
            escapeSql(b.fullName), // full_name_en (using Arabic name as fallback)
            escapeSql(b.dob && b.dob.replace(/\//g, '-')), // birth_date conversion
            escapeSql(b.gender === 'ذكر' ? 'MALE' : 'FEMALE'),
            'NULL', // photo_url
            escapeSql(b.status || 'ACTIVE'),
            escapeSql(b.enrollmentDate && b.enrollmentDate.replace(/\//g, '-')), // admission_date
            'NULL', // discharge_date
            escapeSql(b.building || 'A'),
            escapeSql(b.wing),
            escapeSql(b.roomNumber),
            escapeSql(b.bedNumber),
            escapeSql(b.floor || 1),
            'NULL', // current_location (will be auto-generated)
            'NULL', // mobility_level
            'ARRAY[]::text[]', // mobility_equipment
            'NULL', // hearing_level
            'NULL', // vision_level
            'NULL', // cognitive_level
            'NULL', // alert_method
            'NULL', // evacuation_priority
            escapeSql(b.notes),
            'false', // oxygen_dependent
            'NULL', // panic_risk
            'NULL', // calming_technique
            'ARRAY[]::text[]', // special_instructions
            'NULL', // wellbeing_score
            'NULL', // autonomy_level
            'NULL', // last_mood_log
            '0', // ihsan_tokens
            'ARRAY[]::text[]', // productive_skills
            'NULL', // blood_type
            'ARRAY[]::text[]', // allergies
            'ARRAY[]::text[]', // chronic_conditions
            '\'[]\'::jsonb', // current_medications
            escapeSql(b.guardianName),
            escapeSql(b.guardianPhone),
            escapeSql(b.guardianRelation)
        ].join(', ');

        sqlStatements.push(`INSERT INTO public.beneficiaries (
  id, national_id, full_name, full_name_en, birth_date, gender, photo_url, status,
  admission_date, discharge_date, building, wing, room_number, bed_number, floor,
  current_location, mobility_level, mobility_equipment, hearing_level, vision_level,
  cognitive_level, alert_method, evacuation_priority, evacuation_notes, oxygen_dependent,
  panic_risk, calming_technique, special_instructions, wellbeing_score, autonomy_level,
  last_mood_log, ihsan_tokens, productive_skills, blood_type, allergies, chronic_conditions,
  current_medications, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (${values});`);
    });

    sqlStatements.push('');
}

// Write to file
const outputPath = path.join(__dirname, 'upload_beneficiaries.sql');
fs.writeFileSync(outputPath, sqlStatements.join('\n'), 'utf8');

console.log(`✓ Generated SQL file: ${outputPath}`);
console.log(`Total statements: ${beneficiaries.length} INSERT statements`);
