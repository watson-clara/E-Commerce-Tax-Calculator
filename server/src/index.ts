import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';

// Routes
import jurisdictionRoutes from './routes/jurisdictionRoutes';
import taxRateRoutes from './routes/taxRateRoutes';
import taxRuleRoutes from './routes/taxRuleRoutes';
import calculatorRoutes from './routes/calculatorRoutes';
import transactionRoutes from './routes/transactionRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
export const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ecommerce_tax_calculator',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jurisdictions', jurisdictionRoutes);
app.use('/api/tax-rates', taxRateRoutes);
app.use('/api/tax-rules', taxRuleRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/transactions', transactionRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 