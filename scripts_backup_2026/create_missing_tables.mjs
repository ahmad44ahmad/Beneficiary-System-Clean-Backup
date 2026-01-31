/**
 * Database Migration Script - Create Missing Tables
 * Creates: om_preventive_schedules, social_research, rehab_plans
 * And adds RLS policies for all new tables
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

async function runMigration() {
    await client.connect();
    console.log('Connected to Supabase PostgreSQL\n');

    try {
        // 1. Create om_preventive_schedules table
        console.log('📦 Creating om_preventive_schedules table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS om_preventive_schedules (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        asset_id UUID REFERENCES om_assets(id) ON DELETE CASCADE,
        schedule_type TEXT NOT NULL DEFAULT 'routine',
        frequency_days INTEGER DEFAULT 30,
        last_completed_date DATE,
        next_due_date DATE,
        assigned_to TEXT,
        status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
        console.log('   ✅ om_preventive_schedules created');

        // 2. Create social_research table
        console.log('📦 Creating social_research table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS social_research (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        national_id VARCHAR(20) NOT NULL,
        beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
        research_date DATE DEFAULT CURRENT_DATE,
        researcher_name TEXT,
        family_status TEXT,
        economic_status TEXT,
        housing_status TEXT,
        social_support_level TEXT,
        community_integration TEXT,
        recommendations TEXT,
        notes TEXT,
        attachments JSONB DEFAULT '[]',
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
        console.log('   ✅ social_research created');

        // 3. Create rehab_plans table
        console.log('📦 Creating rehab_plans table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS rehab_plans (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        national_id VARCHAR(20) NOT NULL,
        beneficiary_id UUID REFERENCES beneficiaries(id) ON DELETE CASCADE,
        plan_name TEXT NOT NULL,
        plan_type TEXT DEFAULT 'comprehensive',
        description TEXT,
        objectives JSONB DEFAULT '[]',
        start_date DATE DEFAULT CURRENT_DATE,
        target_end_date DATE,
        actual_end_date DATE,
        status TEXT DEFAULT 'active' CHECK (status IN ('planned', 'active', 'completed', 'suspended')),
        assigned_therapist TEXT,
        team_members JSONB DEFAULT '[]',
        progress_notes TEXT,
        outcome_summary TEXT,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now()
      );
    `);
        console.log('   ✅ rehab_plans created');

        // 4. Enable RLS on new tables
        console.log('\n🔐 Enabling Row Level Security...');

        const tables = ['om_preventive_schedules', 'social_research', 'rehab_plans'];

        for (const table of tables) {
            await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);

            // Create policies for authenticated users
            await client.query(`
        DROP POLICY IF EXISTS "${table}_authenticated_all" ON ${table};
        CREATE POLICY "${table}_authenticated_all" ON ${table}
          FOR ALL TO authenticated
          USING (true)
          WITH CHECK (true);
      `);

            // Create policy for anon read access
            await client.query(`
        DROP POLICY IF EXISTS "${table}_anon_select" ON ${table};
        CREATE POLICY "${table}_anon_select" ON ${table}
          FOR SELECT TO anon
          USING (true);
      `);

            console.log(`   ✅ RLS enabled for ${table}`);
        }

        // 5. Create indexes for performance
        console.log('\n📇 Creating indexes...');

        await client.query(`
      CREATE INDEX IF NOT EXISTS idx_preventive_schedules_asset ON om_preventive_schedules(asset_id);
      CREATE INDEX IF NOT EXISTS idx_preventive_schedules_due ON om_preventive_schedules(next_due_date);
      CREATE INDEX IF NOT EXISTS idx_social_research_beneficiary ON social_research(beneficiary_id);
      CREATE INDEX IF NOT EXISTS idx_social_research_national ON social_research(national_id);
      CREATE INDEX IF NOT EXISTS idx_rehab_plans_beneficiary ON rehab_plans(beneficiary_id);
      CREATE INDEX IF NOT EXISTS idx_rehab_plans_status ON rehab_plans(status);
    `);
        console.log('   ✅ Indexes created');

        // 6. Verify tables were created
        console.log('\n📋 Verifying new tables...');
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('om_preventive_schedules', 'social_research', 'rehab_plans')
      ORDER BY table_name
    `);

        console.log('   Created tables:');
        result.rows.forEach(r => console.log(`   - ${r.table_name}`));

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('✅ MIGRATION COMPLETE - All missing tables created!');
        console.log('═══════════════════════════════════════════════════════');

    } catch (error) {
        console.error('❌ Migration error:', error.message);
        throw error;
    } finally {
        await client.end();
    }
}

runMigration().catch(console.error);
