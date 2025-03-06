-- Create tables for the tax calculator application

-- Jurisdictions table
CREATE TABLE IF NOT EXISTS jurisdictions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    country VARCHAR(50) NOT NULL,
    state_province VARCHAR(50),
    local_area VARCHAR(50),
    tax_authority VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tax rates table
CREATE TABLE IF NOT EXISTS tax_rates (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id) ON DELETE CASCADE,
    product_type VARCHAR(50) NOT NULL,
    rate DECIMAL(5,2) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_rate CHECK (rate >= 0 AND rate <= 100)
);

-- Tax rules table
CREATE TABLE IF NOT EXISTS tax_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id) ON DELETE CASCADE,
    product_type VARCHAR(50) NOT NULL,
    rule_type VARCHAR(50) NOT NULL,
    threshold_value DECIMAL(10,2),
    is_exempt BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    customer_location JSONB NOT NULL,
    products JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tax_rates_jurisdiction_product ON tax_rates(jurisdiction_id, product_type);
CREATE INDEX IF NOT EXISTS idx_tax_rules_jurisdiction_product ON tax_rules(jurisdiction_id, product_type);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Insert some sample data
INSERT INTO jurisdictions (name, code, country, state_province)
VALUES 
  ('California', 'US-CA', 'US', 'CA'),
  ('New York', 'US-NY', 'US', 'NY'),
  ('Texas', 'US-TX', 'US', 'TX')
ON CONFLICT (code) DO NOTHING;

-- Insert sample tax rates
INSERT INTO tax_rates (jurisdiction_id, product_type, rate, effective_date)
VALUES 
  (1, 'General', 7.25, '2023-01-01'),
  (2, 'General', 8.875, '2023-01-01'),
  (3, 'General', 6.25, '2023-01-01')
ON CONFLICT DO NOTHING; 