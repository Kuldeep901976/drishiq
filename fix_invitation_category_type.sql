-- Fix missing invitation_category type
-- This script creates the invitation_category enum if it doesn't exist

-- Create the invitation_category enum with all required values
DO $$ BEGIN
    CREATE TYPE invitation_category AS ENUM ('investment', 'story', 'testimonial', 'general', 'trial_access', 'need_support');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify the type was created
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder; 