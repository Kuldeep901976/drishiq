-- Clean up invitation_category enum to remove redundant values
-- Keep: 'general' (for trial access), 'need_support', and 'testimonial'
-- Using correct table name: 'Invitation' (singular, capital I)

-- First, update any existing records to use 'general' instead of redundant values
UPDATE public."Invitation" 
SET category = 'general'::text::invitation_category 
WHERE category IN ('trial_access', 'investment', 'story');

-- Create a new enum with only the necessary values
DO $$ BEGIN
    CREATE TYPE invitation_category_clean AS ENUM ('general', 'need_support', 'testimonial');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Drop the default value first to avoid casting issues
ALTER TABLE public."Invitation" ALTER COLUMN category DROP DEFAULT;

-- Update the column to use the new enum
ALTER TABLE public."Invitation" 
ALTER COLUMN category TYPE invitation_category_clean 
USING category::text::invitation_category_clean;

-- Add back the default value with the new enum type
ALTER TABLE public."Invitation" ALTER COLUMN category SET DEFAULT 'general'::invitation_category_clean;

-- Drop the old enum and rename the new one
DROP TYPE invitation_category;
ALTER TYPE invitation_category_clean RENAME TO invitation_category;

-- Verify the clean enum
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder; 