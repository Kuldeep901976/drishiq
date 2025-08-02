-- Add country_code and country columns to Invitation table
ALTER TABLE public."Invitation" 
ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+91';

ALTER TABLE public."Invitation" 
ADD COLUMN IF NOT EXISTS country TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_invitation_country_code ON public."Invitation"(country_code);
CREATE INDEX IF NOT EXISTS idx_invitation_country ON public."Invitation"(country); 