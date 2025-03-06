import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tax_calculator',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Add query logging
const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    console.log('Executing query:', { text, params });
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executed in', duration, 'ms. Rows:', result.rowCount);
    return result;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('Database connected successfully. Server time:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

export default {
  query,
  pool,
  testConnection
}; 