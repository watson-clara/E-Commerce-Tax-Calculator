-- Create database
CREATE DATABASE ecommerce_tax_calculator;

-- Connect to the database
\c ecommerce_tax_calculator

-- Create jurisdictions table
CREATE TABLE jurisdictions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    country VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create tax_rates table
CREATE TABLE tax_rates (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id) ON DELETE CASCADE,
    rate DECIMAL(5,2) NOT NULL,
    product_type VARCHAR(100) NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_jurisdiction_product_date UNIQUE (jurisdiction_id, product_type, effective_date)
);

-- Create tax_rules table
CREATE TABLE tax_rules (
    id SERIAL PRIMARY KEY,
    jurisdiction_id INTEGER REFERENCES jurisdictions(id) ON DELETE CASCADE,
    rule_name VARCHAR(100) NOT NULL,
    rule_description TEXT,
    rule_logic JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    customer_id VARCHAR(100),
    customer_location JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    tax_details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_jurisdiction_code ON jurisdictions(code);
CREATE INDEX idx_tax_rates_jurisdiction ON tax_rates(jurisdiction_id);
CREATE INDEX idx_tax_rates_product_type ON tax_rates(product_type);
CREATE INDEX idx_tax_rules_jurisdiction ON tax_rules(jurisdiction_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_customer ON transactions(customer_id); 