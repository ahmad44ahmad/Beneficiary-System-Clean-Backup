/**
 * Comprehensive Database Audit - Check all table row counts
 * To identify which tables are empty and need seeding
 */
import pg from 'pg';
const { Client } = pg;

const client = new Client({
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
});

async function auditAllTables() {
    await client.connect();
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('       COMPREHENSIVE TABLE AUDIT - ROW COUNTS                   ');
    console.log('═══════════════════════════════════════════════════════════════\n');

    // Get all tables
    const { rows: tables } = await client.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
    ORDER BY table_name
  `);

    const results = {
        empty: [],
        populated: [],
        errors: []
    };

    console.log('📊 Checking row counts for all tables...\n');

    for (const { table_name } of tables) {
        try {
            const { rows } = await client.query(`SELECT COUNT(*) as count FROM "${table_name}"`);
            const count = parseInt(rows[0].count);

            if (count === 0) {
                results.empty.push(table_name);
                console.log(`   ⚠️  ${table_name}: 0 rows`);
            } else {
                results.populated.push({ name: table_name, count });
            }
        } catch (e) {
            results.errors.push({ name: table_name, error: e.message });
        }
    }

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log('POPULATED TABLES:');
    console.log('───────────────────────────────────────────────────────────────');
    for (const t of results.populated.sort((a, b) => b.count - a.count)) {
        console.log(`   ✅ ${t.name}: ${t.count} rows`);
    }

    console.log('\n───────────────────────────────────────────────────────────────');
    console.log(`EMPTY TABLES (${results.empty.length}):`)
    console.log('───────────────────────────────────────────────────────────────');
    for (const t of results.empty) {
        console.log(`   ❌ ${t}`);
    }

    // Save to JSON for processing
    const fs = await import('fs');
    fs.writeFileSync('table_audit_full.json', JSON.stringify(results, null, 2));
    console.log('\n📁 Full results saved to table_audit_full.json');

    await client.end();
}

auditAllTables().catch(console.error);
