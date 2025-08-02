-- Clean up invitation_category enum to remove redundant values
-- Keep only: 'general' (for trial access) and 'need_support'

-- First, update any existing records to use 'general' instead of redundant values
UPDATE public.Invitations 
SET category = 'general'::text::invitation_category 
WHERE category IN ('trial_access', 'investment', 'story', 'testimonial');

-- Create a new enum with only the necessary values
DO $$ BEGIN
    CREATE TYPE invitation_category_clean AS ENUM ('general', 'need_support');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update the column to use the new enum
ALTER TABLE public.Invitations 
ALTER COLUMN category TYPE invitation_category_clean 
USING category::text::invitation_category_clean;

-- Drop the old enum and rename the new one
DROP TYPE invitation_category;
ALTER TYPE invitation_category_clean RENAME TO invitation_category;

-- Verify the clean enum
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder; 