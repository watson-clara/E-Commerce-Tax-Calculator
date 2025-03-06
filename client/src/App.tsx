import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import TaxCalculator from './pages/TaxCalculator';
import JurisdictionManagement from './pages/JurisdictionManagement';
import TaxRateManagement from './pages/TaxRateManagement';
import TaxRuleManagement from './pages/TaxRuleManagement';
import TransactionHistory from './pages/TransactionHistory';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<TaxCalculator />} />
            <Route path="/jurisdictions" element={<JurisdictionManagement />} />
            <Route path="/tax-rates" element={<TaxRateManagement />} />
            <Route path="/tax-rules" element={<TaxRuleManagement />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 