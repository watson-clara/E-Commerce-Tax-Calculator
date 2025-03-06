"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
const router = express_1.default.Router();
// Get all transactions
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM transactions ORDER BY transaction_date DESC');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Get transaction by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('SELECT * FROM transactions WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Create new transaction
router.post('/', async (req, res) => {
    try {
        const { transaction_date, customer_id, customer_location, items, subtotal, tax_amount, total, tax_details } = req.body;
        if (!customer_location || !items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                error: 'Customer location and at least one item are required'
            });
        }
        const result = await db_1.default.query(`INSERT INTO transactions 
       (transaction_date, customer_id, customer_location, items, subtotal, tax_amount, total, tax_details) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`, [
            transaction_date || new Date(),
            customer_id,
            customer_location,
            items,
            subtotal,
            tax_amount,
            total,
            tax_details
        ]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
// Delete transaction
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db_1.default.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        res.json({ message: 'Transaction deleted successfully' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
