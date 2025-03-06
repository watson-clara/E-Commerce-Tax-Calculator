import express from 'express';
import { calculateTax } from '../services/taxCalculator';

const router = express.Router();

// Calculate tax for a set of products
router.post('/calculate', async (req, res) => {
  try {
    const { products, customerLocation } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Products array is required' });
    }
    
    if (!customerLocation || !customerLocation.country) {
      return res.status(400).json({ error: 'Customer location with country is required' });
    }
    
    const result = await calculateTax(products, customerLocation);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 