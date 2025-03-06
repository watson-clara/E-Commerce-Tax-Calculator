"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Get all tax rates
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query(`
      SELECT tr.*, j.name as jurisdiction_name 
      FROM tax_rates tr
      JOIN jurisdictions j ON tr.jurisdiction_id = j.id
      ORDER BY tr.effective_date DESC
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get tax rate by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`
      SELECT tr.*, j.name as jurisdiction_name 
      FROM tax_rates tr
      JOIN jurisdictions j ON tr.jurisdiction_id = j.id
      WHERE tr.id = $1
    `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rate not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create new tax rate
router.post('/', async (req, res) => {
    try {
        const { jurisdiction_id, rate, product_type, effective_date, end_date } = req.body;
        if (!jurisdiction_id || rate === undefined || !product_type || !effective_date) {
            return res.status(400).json({
                error: 'Jurisdiction ID, rate, product type, and effective date are required'
            });
        }
        const result = await db_1.default.query(`INSERT INTO tax_rates 
       (jurisdiction_id, rate, product_type, effective_date, end_date) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`, [jurisdiction_id, rate, product_type, effective_date, end_date]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Update tax rate
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { jurisdiction_id, rate, product_type, effective_date, end_date } = req.body;
        if (!jurisdiction_id || rate === undefined || !product_type || !effective_date) {
            return res.status(400).json({
                error: 'Jurisdiction ID, rate, product type, and effective date are required'
            });
        }
        const result = await db_1.default.query(`UPDATE tax_rates 
       SET jurisdiction_id = $1, 
           rate = $2, 
           product_type = $3, 
           effective_date = $4, 
           end_date = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 
       RETURNING *`, [jurisdiction_id, rate, product_type, effective_date, end_date, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rate not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete tax rate
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('DELETE FROM tax_rates WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rate not found' });
        }
        res.json({ message: 'Tax rate deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
