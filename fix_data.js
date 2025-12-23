const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data', 'beneficiaries.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find 'id: "..."' and insert 'nationalId: "..."' after it if not present
// We typically see:
// id: "1401",
// fullName: ...

// We'll replace `id: "(\d+)",` with `id: "$1",\n        nationalId: "100000$1",`
// But we should check if nationalId already exists to avoid double insertion?
// The file seems to have some nationalId already? (Line 7 in view_file showed one!)

// Line 7: nationalId: "1055754009",
// But Line 29 (start of next object) -> Line 30 id: "365". Line 31 fullName... No nationalId.
// So some have it, some don't.

// We will use a replace function.
content = content.replace(/id: "(\d+)",\s*\n\s*fullName:/g, (match, id) => {
    // Generates a mock national ID based on the ID to be deterministic and unique
    const nationalId = "10" + id.padStart(8, '0');
    return `id: "${id}",\n        nationalId: "${nationalId}",\n        fullName:`;
});

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed beneficiaries.ts');
