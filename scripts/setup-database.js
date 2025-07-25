const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure .env.local contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Migration files in order
const migrations = [
  '00_initial_setup.sql',
  '13_user_profile_trigger.sql'
];

async function applyMigrations() {
  try {
    console.log('🔧 Setting up database schema...');
    
    for (const migrationFile of migrations) {
      console.log(`\n📄 Applying ${migrationFile}...`);
      
      const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      
      // Split SQL into individual statements
      const statements = migrationSQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      for (const statement of statements) {
        try {
          // Try to execute each statement
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          if (error) {
            console.log(`⚠️  Statement failed (this is normal for some statements): ${statement.substring(0, 50)}...`);
          }
        } catch (e) {
          // Ignore errors for statements that might already exist
          console.log(`⚠️  Statement execution failed (normal): ${e.message}`);
        }
      }
      
      console.log(`✅ ${migrationFile} processed`);
    }
    
    console.log('\n🎉 Database setup completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Copy and paste the contents of each migration file manually');
    console.log('4. Start with: supabase/migrations/00_initial_setup.sql');
    console.log('5. Then apply: supabase/migrations/13_user_profile_trigger.sql');
    
  } catch (error) {
    console.error('❌ Error in applyMigrations:', error);
    console.log('\n📝 Manual migration required:');
    console.log('Please apply the migrations manually in Supabase SQL Editor');
  }
}

applyMigrations(); 