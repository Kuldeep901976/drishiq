-- Add missing 'need_support' value to invitation_category enum
-- This script adds the 'need_support' value if it doesn't already exist

DO $$ BEGIN
    ALTER TYPE invitation_category ADD VALUE 'need_support';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify all enum values are present
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder; 