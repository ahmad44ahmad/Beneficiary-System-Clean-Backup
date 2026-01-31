import pg from 'pg';
import fs from 'fs';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function comprehensiveAudit() {
    await client.connect();

    let report = '# COMPREHENSIVE DATABASE AUDIT\n\n';
    report += `Generated: ${new Date().toISOString()}\n\n`;

    // 1. Get ALL tables
    console.log('1. Getting all tables...');
    const { rows: tables } = await client.query(`
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename
  `);

    report += '## 1. ALL TABLES IN DATABASE\n\n';
    for (const t of tables) {
        const { rows: count } = await client.query(`SELECT COUNT(*) as cnt FROM ${t.tablename}`);
        const { rows: rls } = await client.query(`
      SELECT relrowsecurity FROM pg_class WHERE relname = $1
    `, [t.tablename]);
        const rlsStatus = rls[0]?.relrowsecurity ? 'RLS ON' : 'RLS OFF';
        report += `- ${t.tablename}: ${count[0].cnt} rows (${rlsStatus})\n`;
    }

    // 2. Get ALL RLS policies
    console.log('2. Getting all RLS policies...');
    report += '\n## 2. ALL RLS POLICIES\n\n';
    const { rows: policies } = await client.query(`
    SELECT tablename, policyname, permissive, roles, cmd, qual 
    FROM pg_policies 
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname
  `);

    let currentTable = '';
    for (const p of policies) {
        if (p.tablename !== currentTable) {
            report += `\n### ${p.tablename}\n`;
            currentTable = p.tablename;
        }
        report += `- **${p.policyname}** (${p.cmd}): ${p.permissive} for ${p.roles}\n`;
        report += `  Condition: \`${p.qual || 'NONE'}\`\n`;
    }

    // 3. Check role permissions
    console.log('3. Checking role permissions...');
    report += '\n## 3. ROLE PERMISSIONS\n\n';
    const { rows: grants } = await client.query(`
    SELECT grantee, table_name, privilege_type
    FROM information_schema.role_table_grants
    WHERE table_schema = 'public'
    AND grantee IN ('anon', 'authenticated', 'service_role')
    ORDER BY table_name, grantee
  `);

    const grantsByTable = {};
    for (const g of grants) {
        if (!grantsByTable[g.table_name]) grantsByTable[g.table_name] = {};
        if (!grantsByTable[g.table_name][g.grantee]) grantsByTable[g.table_name][g.grantee] = [];
        grantsByTable[g.table_name][g.grantee].push(g.privilege_type);
    }

    for (const [table, roles] of Object.entries(grantsByTable)) {
        report += `### ${table}\n`;
        for (const [role, privs] of Object.entries(roles)) {
            report += `- ${role}: ${privs.join(', ')}\n`;
        }
    }

    // 4. Test reading as anon role
    console.log('4. Testing anon role read access...');
    report += '\n## 4. ANON ROLE READ TEST\n\n';

    // Set role to anon and try to read
    const testTables = [
        'beneficiaries', 'medication_schedules', 'vital_signs',
        'locations', 'employees', 'shift_handover_notes'
    ];

    for (const t of testTables) {
        try {
            await client.query('SET LOCAL ROLE anon');
            const { rows } = await client.query(`SELECT COUNT(*) as cnt FROM ${t}`);
            report += `- ${t}: ✅ Can read (${rows[0].cnt} rows visible)\n`;
        } catch (e) {
            report += `- ${t}: ❌ ERROR: ${e.message.split('\n')[0]}\n`;
        } finally {
            await client.query('RESET ROLE');
        }
    }

    // Save report
    fs.writeFileSync('database_audit_report.md', report);
    console.log('\nReport saved to database_audit_report.md');
    console.log(report);

    await client.end();
}

comprehensiveAudit().catch(console.error);
