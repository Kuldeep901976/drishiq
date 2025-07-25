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

async function applyMigrationDirect() {
  try {
    console.log('🔧 Applying admin system migration using direct SQL...');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '04_admin_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Migration file loaded, executing SQL directly...');
    
    // Create admin_users table
    console.log('Creating admin_users table...');
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS admin_users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
        permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_login TIMESTAMP WITH TIME ZONE,
        created_by UUID REFERENCES auth.users(id)
      );
    `;
    
    // Try to execute the SQL using the REST API
    const { error: tableError } = await supabase
      .from('admin_users')
      .select('*')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.log('admin_users table does not exist, creating it...');
      
      // Since we can't execute DDL directly, let's create a simple admin_users table
      // using the service role client to bypass RLS
      const { error: createError } = await supabase
        .rpc('create_admin_users_table');
      
      if (createError) {
        console.log('RPC method not available, trying alternative approach...');
        
        // Create a simple admin user directly in the database
        // First, let's check if we can access the auth.users table
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Cannot access auth users:', authError);
        } else {
          console.log('Found auth users:', authUsers.users.length);
          
          // Try to create admin_users table using a different approach
          // We'll create it by inserting a dummy record and handling the error
          try {
            const { error: insertError } = await supabase
              .from('admin_users')
              .insert({
                user_id: '00000000-0000-0000-0000-000000000000',
                email: 'dummy@example.com',
                role: 'admin',
                is_active: false
              });
            
            if (insertError && insertError.code === '42P01') {
              console.log('Table does not exist, need to create it manually');
              console.log('\n📝 MANUAL STEP REQUIRED:');
              console.log('1. Go to your Supabase dashboard');
              console.log('2. Click "SQL Editor" in the left sidebar');
              console.log('3. Copy and paste this SQL:');
              console.log(`
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Admins can view all admin users" ON admin_users FOR SELECT USING (true);
CREATE POLICY "Service role can manage all admin users" ON admin_users FOR ALL USING (true);
              `);
              console.log('4. Click "Run" to execute');
              console.log('5. Then run: node scripts/add-current-user-as-admin.js your-email@example.com');
            }
          } catch (e) {
            console.log('Error:', e.message);
          }
        }
      }
    } else {
      console.log('✅ admin_users table already exists!');
    }
    
  } catch (error) {
    console.error('❌ Failed to apply migration:', error);
  }
}

applyMigrationDirect(); 