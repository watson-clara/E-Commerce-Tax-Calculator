const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce_tax_calculator',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Simple tax calculation endpoint
app.post('/api/calculator/calculate', (req, res) => {
  const { products, customerLocation } = req.body;
  
  // Simple tax rates
  const taxRates = {
    'US-CA': { rate: 8.5, name: 'California' },
    'US-NY': { rate: 8.875, name: 'New York' },
    'US-TX': { rate: 6.25, name: 'Texas' },
    'US-FL': { rate: 6.0, name: 'Florida' },
    'CA-ON': { rate: 13.0, name: 'Ontario' },
    'UK-': { rate: 20.0, name: 'United Kingdom' },
  };
  
  // Calculate subtotal
  const subtotal = products.reduce(
    (sum, product) => sum + (parseFloat(product.price) * parseInt(product.quantity)),
    0
  );
  
  // Determine tax rate
  const locationKey = `${customerLocation.country}-${customerLocation.state || ''}`;
  const taxInfo = taxRates[locationKey] || { rate: 0, name: 'Unknown' };
  
  // Calculate tax
  const taxAmount = subtotal * (taxInfo.rate / 100);
  const total = subtotal + taxAmount;
  
  res.json({
    subtotal: subtotal.toFixed(2),
    taxRate: taxInfo.rate,
    taxAmount: taxAmount.toFixed(2),
    total: total.toFixed(2),
    jurisdiction: taxInfo.name
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 