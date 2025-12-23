"""
Generate SQL INSERT statements for all 147 beneficiaries
To be run directly in Supabase SQL Editor (bypasses RLS)
"""

import re
import uuid

def generate_deterministic_uuid(string_id):
    """Generate deterministic UUID from string ID"""
    namespace = uuid.UUID('6ba7b810-9dad-11d1-80b4-00c04fd430c8')
    return str(uuid.uuid5(namespace, f"beneficiary-{string_id}"))

def extract_beneficiaries():
    """Extract beneficiary data from TypeScript file"""
    beneficiaries = []
    
    with open('src/data/beneficiaries.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all beneficiary objects
    pattern = r'\{([^}]+?id:\s*["\'](\d+)["\'][^}]*?)\}'
    matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
    
    for match in matches:
        obj_str = match.group(1)
        string_id = match.group(2)
        
        beneficiary = {'original_id': string_id}
        
        # Extract fields
        field_patterns = [
            ('fullName', r'fullName:\s*["\']([^"\']+)["\']'),
            ('nationalId', r'nationalId:\s*["\']([^"\']+)["\']'),
            ('gender', r'gender:\s*["\']([^"\']+)["\']'),
            ('dob', r'dob:\s*["\']([^"\']+)["\']'),
            ('roomNumber', r'roomNumber:\s*["\']([^"\']+)["\']'),
            ('bedNumber', r'bedNumber:\s*["\']([^"\']+)["\']'),
            ('enrollmentDate', r'enrollmentDate:\s*["\']([^"\']+)["\']'),
            ('guardianName', r'guardianName:\s*["\']([^"\']+)["\']'),
            ('guardianPhone', r'guardianPhone:\s*["\']([^"\']+)["\']'),
            ('guardianRelation', r'guardianRelation:\s*["\']([^"\']+)["\']'),
        ]
        
        for field, pattern in field_patterns:
            m = re.search(pattern, obj_str)
            if m:
                beneficiary[field] = m.group(1)
        
        if beneficiary.get('fullName'):
            beneficiaries.append(beneficiary)
    
    return beneficiaries

def escape_sql_string(s):
    """Escape string for SQL"""
    if s is None:
        return 'NULL'
    # Escape single quotes
    return "'" + s.replace("'", "''") + "'"

def generate_sql():
    """Generate SQL INSERT statements"""
    beneficiaries = extract_beneficiaries()
    
    print(f"Found {len(beneficiaries)} beneficiaries to insert")
    
    sql_file = open('beneficiaries_insert.sql', 'w', encoding='utf-8')
    
    sql_file.write(f"-- Inserting {len(beneficiaries)} beneficiaries\n")
    sql_file.write("-- Generated: 2025-12-23\n\n")
    
    for i, b in enumerate(beneficiaries):
        ben_uuid = generate_deterministic_uuid(b['original_id'])
        full_name = escape_sql_string(b.get('fullName'))
        national_id = escape_sql_string(b.get('nationalId'))
        
        # Convert gender
        gender_ar = b.get('gender', 'ذكر')
        gender = 'MALE' if gender_ar == 'ذكر' else 'FEMALE'
        
        # Convert dates
        birth_date = b.get('dob', '').replace('/', '-') if b.get('dob') else None
        admission_date = b.get('enrollmentDate', '').replace('/', '-') if b.get('enrollmentDate') else None
        
        room_number = escape_sql_string(b.get('roomNumber'))
        bed_number = escape_sql_string(b.get('bedNumber'))
        guardian_name = escape_sql_string(b.get('guardianName'))
        guardian_phone = escape_sql_string(b.get('guardianPhone'))
        guardian_relation = escape_sql_string(b.get('guardianRelation'))
        
        sql = f"""INSERT INTO beneficiaries (
    id, full_name, national_id, gender, status,
    birth_date, admission_date, building,
    room_number, bed_number,
    emergency_contact_name, emergency_contact_phone, emergency_contact_relationship
) VALUES (
    '{ben_uuid}',
    {full_name},
    {national_id},
    '{gender}',
    'ACTIVE',
    {escape_sql_string(birth_date) if birth_date else 'NULL'},
    {escape_sql_string(admission_date) if admission_date else 'NULL'},
    'A',
    {room_number},
    {bed_number},
    {guardian_name},
    {guardian_phone},
    {guardian_relation}
)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    national_id = EXCLUDED.national_id,
    updated_at = NOW();

"""
        sql_file.write(sql)
        
        if (i + 1) % 20 == 0:
            print(f"  Generated {i + 1}/{len(beneficiaries)}")
    
    sql_file.write("\n-- Verify count\nSELECT COUNT(*) as total_beneficiaries FROM beneficiaries;\n")
    
    sql_file.close()
    
    print(f"\n✅ SQL file created: beneficiaries_insert.sql")
    print(f"📊 Total INSERT statements: {len(beneficiaries)}")

if __name__ == "__main__":
    generate_sql()
