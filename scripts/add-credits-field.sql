-- Add credits field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS credits INTEGER DEFAULT 0;

-- Add user_type field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS user_type TEXT DEFAULT 'free' CHECK (user_type IN ('free', 'premium', 'enterprise'));

-- Give some initial credits to existing users
UPDATE public.users 
SET credits = 10 
WHERE credits IS NULL OR credits = 0;

-- Update user_type for existing users if not set
UPDATE public.users 
SET user_type = 'free' 
WHERE user_type IS NULL; 