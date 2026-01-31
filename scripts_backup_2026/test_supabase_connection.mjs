/**
 * Supabase Database Connection Test for Antigravity
 * Tests the antigravity_admin role connection to Supabase
 */

import pg from 'pg';
const { Client } = pg;

const connectionConfig = {
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543, // PgBouncer
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
};

async function testConnection() {
    const client = new Client(connectionConfig);

    try {
        console.log('🔄 Connecting to Supabase PostgreSQL...');
        console.log(`   Host: ${connectionConfig.host}`);
        console.log(`   Port: ${connectionConfig.port}`);
        console.log(`   Database: ${connectionConfig.database}`);
        console.log(`   User: ${connectionConfig.user}`);
        console.log('');

        await client.connect();
        console.log('✅ CONNECTION SUCCESSFUL!\n');

        // Test 1: Basic connection info
        const infoResult = await client.query(`
      SELECT current_user, current_database(), version()
    `);
        console.log('📊 Connection Info:');
        console.log(`   Current User: ${infoResult.rows[0].current_user}`);
        console.log(`   Database: ${infoResult.rows[0].current_database}`);
        console.log(`   PostgreSQL Version: ${infoResult.rows[0].version.split(',')[0]}`);
        console.log('');

        // Test 2: List schemas we have access to
        const schemasResult = await client.query(`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT LIKE 'pg_%' 
      ORDER BY schema_name
    `);
        console.log('📁 Accessible Schemas:');
        schemasResult.rows.forEach(row => console.log(`   - ${row.schema_name}`));
        console.log('');

        // Test 3: List tables in public schema
        const tablesResult = await client.query(`
      SELECT table_name, table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
        console.log(`📋 Tables in PUBLIC schema (${tablesResult.rows.length} tables):`);
        tablesResult.rows.forEach(row => {
            console.log(`   - ${row.table_name} (${row.table_type})`);
        });
        console.log('');

        // Test 4: Check if we can query auth schema
        try {
            const authTablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'auth' 
        ORDER BY table_name
      `);
            console.log(`🔐 Tables in AUTH schema (${authTablesResult.rows.length} tables):`);
            authTablesResult.rows.slice(0, 5).forEach(row => {
                console.log(`   - ${row.table_name}`);
            });
            if (authTablesResult.rows.length > 5) {
                console.log(`   ... and ${authTablesResult.rows.length - 5} more`);
            }
            console.log('');
        } catch (err) {
            console.log('⚠️ Cannot access AUTH schema:', err.message);
        }

        // Test 5: Check storage schema
        try {
            const storageTablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'storage' 
        ORDER BY table_name
      `);
            console.log(`📦 Tables in STORAGE schema (${storageTablesResult.rows.length} tables):`);
            storageTablesResult.rows.forEach(row => {
                console.log(`   - ${row.table_name}`);
            });
            console.log('');
        } catch (err) {
            console.log('⚠️ Cannot access STORAGE schema:', err.message);
        }

        console.log('═══════════════════════════════════════════════════════');
        console.log('🎉 ANTIGRAVITY DATABASE ACCESS CONFIRMED!');
        console.log('   You can now manage your Supabase database from here.');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ CONNECTION FAILED!');
        console.error('   Error:', error.message);
        if (error.code) {
            console.error('   Code:', error.code);
        }
    } finally {
        await client.end();
    }
}

testConnection();
