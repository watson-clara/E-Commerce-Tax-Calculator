import express from 'express';
import db from '../db';
import { Jurisdiction } from '../models/Jurisdiction';

const router = express.Router();

// Get all jurisdictions
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jurisdictions ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get jurisdiction by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM jurisdictions WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new jurisdiction
router.post('/', async (req, res) => {
  try {
    const { name, code, country, state_province }: Jurisdiction = req.body;
    
    if (!name || !code || !country) {
      return res.status(400).json({ error: 'Name, code, and country are required' });
    }
    
    const result = await db.query(
      'INSERT INTO jurisdictions (name, code, country, state_province) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, code, country, state_province]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update jurisdiction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, country, state_province }: Jurisdiction = req.body;
    
    if (!name || !code || !country) {
      return res.status(400).json({ error: 'Name, code, and country are required' });
    }
    
    const result = await db.query(
      'UPDATE jurisdictions SET name = $1, code = $2, country = $3, state_province = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *',
      [name, code, country, state_province, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete jurisdiction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM jurisdictions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Jurisdiction not found' });
    }
    
    res.json({ message: 'Jurisdiction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router; 