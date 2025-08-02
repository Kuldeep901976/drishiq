-- Add testimonial to the existing invitation_category enum
-- Current values: general, need_support
-- Adding: testimonial

-- Add testimonial value to the existing enum
DO $$ BEGIN
    ALTER TYPE invitation_category ADD VALUE 'testimonial';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Verify all enum values are present
SELECT typname, enumlabel 
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid 
WHERE typname = 'invitation_category'
ORDER BY e.enumsortorder; 