const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('🚀 Applying Supabase migrations...');
  
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Apply in order

  console.log(`📁 Found ${migrationFiles.length} migration files`);

  for (const file of migrationFiles) {
    try {
      console.log(`\n📄 Applying migration: ${file}`);
      
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL into individual statements
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          if (error) {
            console.warn(`⚠️  Warning in ${file}:`, error.message);
          }
        }
      }
      
      console.log(`✅ Applied: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error applying ${file}:`, error.message);
    }
  }

  console.log('\n🎉 Migration process completed!');
  
  // Verify tables exist
  await verifyTables();
}

async function verifyTables() {
  console.log('\n🔍 Verifying tables...');
  
  const requiredTables = [
    'Invitations',
    'magic_links', 
    'email_logs',
    'email_templates'
  ];

  for (const tableName of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ Table ${tableName}: Exists`);
      }
    } catch (error) {
      console.log(`❌ Table ${tableName}: ${error.message}`);
    }
  }
}

// Run the migration
applyMigrations().catch(console.error); 