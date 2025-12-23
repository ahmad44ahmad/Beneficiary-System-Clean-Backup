const fs = require('fs');

const filePath = String.raw`c:\Users\aass1\OneDrive\compressed الخطوط\Desktop\Beneficiary-System-Clean-Backup-main\Beneficiary-System-Clean-Backup-main\src\data\beneficiaries.ts`;

try {
    console.log("Reading file from:", filePath);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if regex matches anything
    const matchCount = (content.match(/id: "(\d+)",\s*\n\s*fullName:/g) || []).length;
    console.log("Found matches:", matchCount);

    content = content.replace(/id: "(\d+)",\s*\n\s*fullName:/g, (match, id) => {
        const nationalId = "10" + id.padStart(8, '0');
        return `id: "${id}",\n        nationalId: "${nationalId}",\n        fullName:`;
    });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed beneficiaries.ts');
} catch (e) {
    console.error("Error:", e);
}
