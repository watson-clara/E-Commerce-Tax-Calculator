"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
// Routes
const jurisdictionRoutes_1 = __importDefault(require("./routes/jurisdictionRoutes"));
const taxRateRoutes_1 = __importDefault(require("./routes/taxRateRoutes"));
const taxRuleRoutes_1 = __importDefault(require("./routes/taxRuleRoutes"));
const calculatorRoutes_1 = __importDefault(require("./routes/calculatorRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Database connection
exports.pool = new pg_1.Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'ecommerce_tax_calculator',
    password: process.env.DB_PASSWORD || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
});
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/jurisdictions', jurisdictionRoutes_1.default);
app.use('/api/tax-rates', taxRateRoutes_1.default);
app.use('/api/tax-rules', taxRuleRoutes_1.default);
app.use('/api/calculator', calculatorRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
