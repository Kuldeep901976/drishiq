-- Check what values currently exist in the invitation_category enum
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder;

-- Also check what values are actually in the category column
SELECT DISTINCT category 
FROM public."Invitation" 
WHERE category IS NOT NULL; 