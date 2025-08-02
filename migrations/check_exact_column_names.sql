-- Check exact column names in the Invitation table, especially challenge-related ones
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Invitation'
AND column_name LIKE '%challenge%'
ORDER BY column_name;

-- Also check for any columns with 'specific' in the name
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'Invitation'
AND column_name LIKE '%specific%'
ORDER BY column_name; 