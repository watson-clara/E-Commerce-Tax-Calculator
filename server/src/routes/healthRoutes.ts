import express from 'express';
import db from '../db';

const router = express.Router();

// Health check endpoint
router.get('/', async (req, res) => {
  try {
    const dbConnected = await db.testConnection();
    
    res.json({
      status: 'healthy',
      database: dbConnected ? 'connected' : 'disconnected',
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
      timestamp: new Date()
    });
  }
});

export default router; 