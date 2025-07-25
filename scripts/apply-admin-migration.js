const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyAdminMigration() {
  try {
    console.log('🔧 Applying admin system migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '04_admin_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Migration file loaded, executing SQL...');
    
    // Split the SQL into individual statements
    const sqlStatements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`Found ${sqlStatements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${sqlStatements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          
          if (error) {
            console.log(`⚠️  Statement ${i + 1} failed (this might be expected if table already exists):`, error.message);
          } else {
            console.log(`✅ Statement ${i + 1} executed successfully`);
          }
        } catch (e) {
          console.log(`⚠️  Statement ${i + 1} failed:`, e.message);
        }
      }
    }
    
    console.log('✅ Admin migration completed!');
    
    // Test if admin_users table was created
    const { data: adminUsers, error: testError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.log('❌ admin_users table still not accessible:', testError.message);
      console.log('\n📝 Manual steps to create admin_users table:');
      console.log('1. Go to your Supabase dashboard');
      console.log('2. Click "SQL Editor" in the left sidebar');
      console.log('3. Copy and paste the contents of supabase/migrations/04_admin_system.sql');
      console.log('4. Click "Run" to execute the migration');
    } else {
      console.log('✅ admin_users table is now accessible!');
    }
    
  } catch (error) {
    console.error('❌ Failed to apply admin migration:', error);
  }
}

applyAdminMigration(); 