-- Check what tables exist in the database
-- This will help us find the correct table name for invitations

-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Also check for any tables with 'invitation' in the name
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name ILIKE '%invitation%'
ORDER BY table_name; 