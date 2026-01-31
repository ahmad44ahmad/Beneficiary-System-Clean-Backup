/**
 * Supabase Database Admin Utility for Antigravity
 * Run: node scripts/db_admin.mjs <command> [args]
 * 
 * Commands:
 *   info      - Show database connection info and statistics
 *   tables    - List all tables in public schema
 *   schema    - Show schema for a specific table
 *   query     - Execute a SQL query
 *   count     - Count rows in a table
 *   sample    - Get sample data from a table
 */

import pg from 'pg';
const { Client } = pg;

const connectionConfig = {
    host: 'db.ruesovrbhcjphmfdcpsa.supabase.co',
    port: 6543,
    database: 'postgres',
    user: 'antigravity_admin',
    password: 'ChangeMe_Now_!_UseStrongRandom',
    ssl: { rejectUnauthorized: false }
};

async function getClient() {
    const client = new Client(connectionConfig);
    await client.connect();
    return client;
}

async function showInfo() {
    const client = await getClient();
    try {
        console.log('\n📊 DATABASE CONNECTION INFO\n');

        const info = await client.query(`SELECT current_user, current_database(), version()`);
        console.log(`User: ${info.rows[0].current_user}`);
        console.log(`Database: ${info.rows[0].current_database}`);
        console.log(`Version: ${info.rows[0].version.split(',')[0]}`);

        const tableCount = await client.query(`
      SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'
    `);
        console.log(`\nPublic Tables: ${tableCount.rows[0].count}`);

        const schemas = await client.query(`
      SELECT schema_name FROM information_schema.schemata 
      WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'
      ORDER BY schema_name
    `);
        console.log(`\nAccessible Schemas: ${schemas.rows.map(r => r.schema_name).join(', ')}`);

    } finally {
        await client.end();
    }
}

async function listTables() {
    const client = await getClient();
    try {
        console.log('\n📋 TABLES IN PUBLIC SCHEMA\n');

        const result = await client.query(`
      SELECT 
        t.table_name,
        t.table_type,
        (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = 'public') as columns
      FROM information_schema.tables t
      WHERE t.table_schema = 'public'
      ORDER BY t.table_name
    `);

        console.log('Table Name'.padEnd(40) + 'Type'.padEnd(15) + 'Columns');
        console.log('-'.repeat(60));

        for (const row of result.rows) {
            console.log(row.table_name.padEnd(40) + row.table_type.padEnd(15) + row.columns);
        }

        console.log(`\nTotal: ${result.rows.length} tables`);

    } finally {
        await client.end();
    }
}

async function showSchema(tableName) {
    const client = await getClient();
    try {
        console.log(`\n📐 SCHEMA FOR TABLE: ${tableName}\n`);

        const result = await client.query(`
      SELECT 
        column_name,
        data_type,
        character_maximum_length,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);

        if (result.rows.length === 0) {
            console.log(`Table "${tableName}" not found in public schema.`);
            return;
        }

        console.log('Column'.padEnd(30) + 'Type'.padEnd(25) + 'Nullable'.padEnd(10) + 'Default');
        console.log('-'.repeat(90));

        for (const row of result.rows) {
            let type = row.data_type;
            if (row.character_maximum_length) {
                type += `(${row.character_maximum_length})`;
            }
            console.log(
                row.column_name.padEnd(30) +
                type.padEnd(25) +
                row.is_nullable.padEnd(10) +
                (row.column_default || '-').substring(0, 30)
            );
        }

    } finally {
        await client.end();
    }
}

async function executeQuery(sql) {
    const client = await getClient();
    try {
        console.log('\n🔍 EXECUTING QUERY\n');
        console.log(`SQL: ${sql}\n`);

        const result = await client.query(sql);

        if (result.rows && result.rows.length > 0) {
            console.table(result.rows);
            console.log(`\nRows returned: ${result.rows.length}`);
        } else if (result.command) {
            console.log(`Command: ${result.command}`);
            console.log(`Rows affected: ${result.rowCount}`);
        }

    } finally {
        await client.end();
    }
}

async function countRows(tableName) {
    const client = await getClient();
    try {
        const result = await client.query(`SELECT COUNT(*) as count FROM public."${tableName}"`);
        console.log(`\nTable "${tableName}" has ${result.rows[0].count} rows`);
    } finally {
        await client.end();
    }
}

async function sampleData(tableName, limit = 5) {
    const client = await getClient();
    try {
        console.log(`\n📄 SAMPLE DATA FROM: ${tableName} (limit ${limit})\n`);

        const result = await client.query(`SELECT * FROM public."${tableName}" LIMIT $1`, [limit]);

        if (result.rows.length === 0) {
            console.log('No data found.');
        } else {
            console.table(result.rows);
        }

    } finally {
        await client.end();
    }
}

// Main execution
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'info':
        await showInfo();
        break;
    case 'tables':
        await listTables();
        break;
    case 'schema':
        if (!args[0]) {
            console.log('Usage: node db_admin.mjs schema <table_name>');
        } else {
            await showSchema(args[0]);
        }
        break;
    case 'query':
        if (!args[0]) {
            console.log('Usage: node db_admin.mjs query "SELECT * FROM ..."');
        } else {
            await executeQuery(args.join(' '));
        }
        break;
    case 'count':
        if (!args[0]) {
            console.log('Usage: node db_admin.mjs count <table_name>');
        } else {
            await countRows(args[0]);
        }
        break;
    case 'sample':
        if (!args[0]) {
            console.log('Usage: node db_admin.mjs sample <table_name> [limit]');
        } else {
            await sampleData(args[0], parseInt(args[1]) || 5);
        }
        break;
    default:
        console.log(`
Supabase Database Admin Utility

Commands:
  info              - Show database connection info
  tables            - List all tables in public schema
  schema <table>    - Show schema for a specific table
  query "SQL"       - Execute a SQL query
  count <table>     - Count rows in a table
  sample <table> [n]- Get n sample rows from a table (default 5)

Examples:
  node scripts/db_admin.mjs info
  node scripts/db_admin.mjs tables
  node scripts/db_admin.mjs schema beneficiaries
  node scripts/db_admin.mjs query "SELECT * FROM beneficiaries LIMIT 5"
  node scripts/db_admin.mjs count beneficiaries
  node scripts/db_admin.mjs sample beneficiaries 10
    `);
}
