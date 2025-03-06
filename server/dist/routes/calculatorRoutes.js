"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const taxCalculator_1 = require("../services/taxCalculator");
const router = express_1.default.Router();
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
        const result = await (0, taxCalculator_1.calculateTax)(products, customerLocation);
        res.json(result);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
