-- Verify if country_code and country columns were added to Invitation table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Invitation'
AND column_name IN ('country_code', 'country')
ORDER BY column_name; 