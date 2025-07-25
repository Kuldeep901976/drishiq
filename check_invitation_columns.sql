-- Check what columns actually exist in the Invitation table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Invitation'
ORDER BY ordinal_position; 