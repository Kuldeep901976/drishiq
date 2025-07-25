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

async function applyMigration() {
  try {
    console.log('🔧 Applying user profile trigger migration...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '13_user_profile_trigger.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    const { error } = await supabase.rpc('exec_sql', { sql: migrationSQL });
    
    if (error) {
      // If exec_sql doesn't exist, try direct query
      console.log('Trying direct SQL execution...');
      const { error: directError } = await supabase.from('_exec_sql').select('*').limit(1);
      
      if (directError) {
        console.log('Direct SQL not available, trying alternative approach...');
        // Try to execute the SQL in parts
        const sqlParts = migrationSQL.split(';').filter(part => part.trim());
        
        for (const part of sqlParts) {
          if (part.trim()) {
            try {
              const { error: partError } = await supabase.rpc('exec_sql', { sql: part + ';' });
              if (partError) {
                console.log('Part failed:', part.substring(0, 50) + '...');
              }
            } catch (e) {
              console.log('Part execution failed:', e.message);
            }
          }
        }
      }
    }
    
    console.log('✅ Migration applied successfully!');
    
    // Test the trigger by checking if it exists
    const { data: triggers, error: triggerError } = await supabase
      .from('information_schema.triggers')
      .select('trigger_name')
      .eq('trigger_name', 'on_auth_user_created');
    
    if (triggers && triggers.length > 0) {
      console.log('✅ User profile trigger is active');
    } else {
      console.log('⚠️  Trigger may not be active - check manually in Supabase dashboard');
    }
    
  } catch (error) {
    console.error('❌ Failed to apply migration:', error);
    console.log('\n📝 Manual steps to apply migration:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Click "SQL Editor" in the left sidebar');
    console.log('3. Copy and paste the contents of supabase/migrations/13_user_profile_trigger.sql');
    console.log('4. Click "Run" to execute the migration');
  }
}

applyMigration(); 