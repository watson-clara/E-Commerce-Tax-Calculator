"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Get all tax rules
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query(`
      SELECT tr.*, j.name as jurisdiction_name 
      FROM tax_rules tr
      JOIN jurisdictions j ON tr.jurisdiction_id = j.id
      ORDER BY tr.rule_name
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get tax rule by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query(`
      SELECT tr.*, j.name as jurisdiction_name 
      FROM tax_rules tr
      JOIN jurisdictions j ON tr.jurisdiction_id = j.id
      WHERE tr.id = $1
    `, [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rule not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create new tax rule
router.post('/', async (req, res) => {
    try {
        const { jurisdiction_id, rule_name, rule_description, rule_logic } = req.body;
        if (!jurisdiction_id || !rule_name || !rule_logic) {
            return res.status(400).json({
                error: 'Jurisdiction ID, rule name, and rule logic are required'
            });
        }
        const result = await db_1.default.query(`INSERT INTO tax_rules 
       (jurisdiction_id, rule_name, rule_description, rule_logic) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`, [jurisdiction_id, rule_name, rule_description, rule_logic]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Update tax rule
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { jurisdiction_id, rule_name, rule_description, rule_logic } = req.body;
        if (!jurisdiction_id || !rule_name || !rule_logic) {
            return res.status(400).json({
                error: 'Jurisdiction ID, rule name, and rule logic are required'
            });
        }
        const result = await db_1.default.query(`UPDATE tax_rules 
       SET jurisdiction_id = $1, 
           rule_name = $2, 
           rule_description = $3, 
           rule_logic = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 
       RETURNING *`, [jurisdiction_id, rule_name, rule_description, rule_logic, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rule not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete tax rule
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('DELETE FROM tax_rules WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Tax rule not found' });
        }
        res.json({ message: 'Tax rule deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
