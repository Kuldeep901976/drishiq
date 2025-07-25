-- Create pricing_rates table for regional pricing management
CREATE TABLE IF NOT EXISTS pricing_rates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    region_code VARCHAR(10) NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    currency_code VARCHAR(3) NOT NULL,
    currency_symbol VARCHAR(5) NOT NULL,
    package_type VARCHAR(20) NOT NULL CHECK (package_type IN ('free', 'seed', 'growth', 'support', 'enterprise')),
    base_price DECIMAL(10,2) NOT NULL,
    discounted_price DECIMAL(10,2) NOT NULL,
    credits INTEGER NOT NULL DEFAULT 1,
    validity_days INTEGER NOT NULL DEFAULT 30,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique combination of region and package type
    UNIQUE(region_code, package_type)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pricing_rates_region ON pricing_rates(region_code);
CREATE INDEX IF NOT EXISTS idx_pricing_rates_package ON pricing_rates(package_type);
CREATE INDEX IF NOT EXISTS idx_pricing_rates_active ON pricing_rates(is_active);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_pricing_rates_updated_at 
    BEFORE UPDATE ON pricing_rates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some default pricing rates for common regions
INSERT INTO pricing_rates (region_code, country_name, currency_code, currency_symbol, package_type, base_price, discounted_price, credits, validity_days) VALUES
-- Free tier (always $0)
('US', 'United States', 'USD', '$', 'free', 0.00, 0.00, 1, 30),
('CA', 'Canada', 'CAD', 'C$', 'free', 0.00, 0.00, 1, 30),
('GB', 'United Kingdom', 'GBP', '£', 'free', 0.00, 0.00, 1, 30),
('EU', 'European Union', 'EUR', '€', 'free', 0.00, 0.00, 1, 30),
('AU', 'Australia', 'AUD', 'A$', 'free', 0.00, 0.00, 1, 30),
('IN', 'India', 'INR', '₹', 'free', 0.00, 0.00, 1, 30),

-- Seed tier
('US', 'United States', 'USD', '$', 'seed', 9.99, 7.99, 1, 60),
('CA', 'Canada', 'CAD', 'C$', 'seed', 12.99, 10.99, 1, 60),
('GB', 'United Kingdom', 'GBP', '£', 'seed', 7.99, 6.49, 1, 60),
('EU', 'European Union', 'EUR', '€', 'seed', 8.99, 7.19, 1, 60),
('AU', 'Australia', 'AUD', 'A$', 'seed', 14.99, 11.99, 1, 60),
('IN', 'India', 'INR', '₹', 'seed', 799, 599, 1, 60),

-- Growth tier
('US', 'United States', 'USD', '$', 'growth', 29.99, 24.99, 10, 90),
('CA', 'Canada', 'CAD', 'C$', 'growth', 39.99, 32.99, 10, 90),
('GB', 'United Kingdom', 'GBP', '£', 'growth', 24.99, 19.99, 10, 90),
('EU', 'European Union', 'EUR', '€', 'growth', 27.99, 22.99, 10, 90),
('AU', 'Australia', 'AUD', 'A$', 'growth', 44.99, 36.99, 10, 90),
('IN', 'India', 'INR', '₹', 'growth', 2499, 1999, 10, 90),

-- Support tier
('US', 'United States', 'USD', '$', 'support', 79.99, 64.99, 25, 120),
('CA', 'Canada', 'CAD', 'C$', 'support', 99.99, 79.99, 25, 120),
('GB', 'United Kingdom', 'GBP', '£', 'support', 64.99, 51.99, 25, 120),
('EU', 'European Union', 'EUR', '€', 'support', 71.99, 57.99, 25, 120),
('AU', 'Australia', 'AUD', 'A$', 'support', 119.99, 95.99, 25, 120),
('IN', 'India', 'INR', '₹', 'support', 5999, 4799, 25, 120),

-- Enterprise tier
('US', 'United States', 'USD', '$', 'enterprise', 299.99, 239.99, 100, 365),
('CA', 'Canada', 'CAD', 'C$', 'enterprise', 399.99, 319.99, 100, 365),
('GB', 'United Kingdom', 'GBP', '£', 'enterprise', 249.99, 199.99, 100, 365),
('EU', 'European Union', 'EUR', '€', 'enterprise', 279.99, 223.99, 100, 365),
('AU', 'Australia', 'AUD', 'A$', 'enterprise', 449.99, 359.99, 100, 365),
('IN', 'India', 'INR', '₹', 'enterprise', 22999, 18399, 100, 365)

ON CONFLICT (region_code, package_type) DO NOTHING;

-- Create user_credits table for tracking user credit balances with FIFO logic
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credits INTEGER NOT NULL DEFAULT 0,
    remaining_credits INTEGER NOT NULL DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
    valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(50) NOT NULL, -- 'free', 'seed', 'growth', 'support', 'enterprise'
    package_id UUID REFERENCES pricing_rates(id),
    transaction_id VARCHAR(100), -- For payment tracking
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure positive values
    CHECK (credits > 0),
    CHECK (remaining_credits >= 0),
    CHECK (remaining_credits <= credits),
    CHECK (valid_to > valid_from)
);

-- Create indexes for user_credits table
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_valid_to ON user_credits(valid_to);
CREATE INDEX IF NOT EXISTS idx_user_credits_source ON user_credits(source);
CREATE INDEX IF NOT EXISTS idx_user_credits_remaining ON user_credits(remaining_credits) WHERE remaining_credits > 0;

-- Create trigger to update updated_at timestamp for user_credits
CREATE TRIGGER update_user_credits_updated_at 
    BEFORE UPDATE ON user_credits 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create credit_transactions table for tracking credit usage
CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    credit_batch_id UUID NOT NULL REFERENCES user_credits(id) ON DELETE CASCADE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'usage', 'expiry', 'refund')),
    credits_amount INTEGER NOT NULL,
    description TEXT,
    metadata JSONB, -- For additional transaction details
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for credit_transactions table
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_batch_id ON credit_transactions(credit_batch_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_created_at ON credit_transactions(created_at);

-- Create a view for easy credit balance queries
CREATE OR REPLACE VIEW user_credit_balances AS
SELECT 
    user_id,
    SUM(remaining_credits) as total_available_credits,
    COUNT(*) as active_credit_batches,
    MIN(valid_to) as earliest_expiry,
    MAX(valid_to) as latest_expiry
FROM user_credits 
WHERE remaining_credits > 0 AND valid_to > NOW()
GROUP BY user_id;

-- Create a function to get user's available credits (FIFO order)
CREATE OR REPLACE FUNCTION get_user_available_credits(user_uuid UUID)
RETURNS TABLE (
    batch_id UUID,
    remaining_credits INTEGER,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_to TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        uc.id,
        uc.remaining_credits,
        uc.valid_from,
        uc.valid_to,
        uc.source
    FROM user_credits uc
    WHERE uc.user_id = user_uuid
        AND uc.remaining_credits > 0
        AND uc.valid_to > NOW()
    ORDER BY uc.valid_from ASC; -- FIFO order
END;
$$ LANGUAGE plpgsql;

-- Create a function to consume credits (FIFO logic)
CREATE OR REPLACE FUNCTION consume_user_credits(
    user_uuid UUID,
    credits_to_consume INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    available_credits INTEGER;
    batch_record RECORD;
    credits_needed INTEGER;
    credits_to_deduct INTEGER;
BEGIN
    -- Check if user has enough credits
    SELECT COALESCE(SUM(remaining_credits), 0) INTO available_credits
    FROM user_credits
    WHERE user_id = user_uuid 
        AND remaining_credits > 0 
        AND valid_to > NOW();
    
    IF available_credits < credits_to_consume THEN
        RETURN FALSE;
    END IF;
    
    credits_needed := credits_to_consume;
    
    -- Consume credits from oldest batches first (FIFO)
    FOR batch_record IN 
        SELECT id, remaining_credits
        FROM user_credits
        WHERE user_id = user_uuid 
            AND remaining_credits > 0 
            AND valid_to > NOW()
        ORDER BY valid_from ASC
    LOOP
        IF credits_needed <= 0 THEN
            EXIT;
        END IF;
        
        credits_to_deduct := LEAST(batch_record.remaining_credits, credits_needed);
        
        -- Update the batch
        UPDATE user_credits 
        SET remaining_credits = remaining_credits - credits_to_deduct
        WHERE id = batch_record.id;
        
        -- Record the transaction
        INSERT INTO credit_transactions (user_id, credit_batch_id, transaction_type, credits_amount, description)
        VALUES (user_uuid, batch_record.id, 'usage', credits_to_deduct, 'Credit consumption');
        
        credits_needed := credits_needed - credits_to_deduct;
    END LOOP;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql; 