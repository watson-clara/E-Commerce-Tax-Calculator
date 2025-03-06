import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import TaxCalculator from './pages/TaxCalculator/TaxCalculator';
import JurisdictionManagement from './pages/JurisdictionManagement/JurisdictionManagement';
import TaxRateManagement from './pages/TaxRateManagement/TaxRateManagement';
import TaxRuleManagement from './pages/TaxRuleManagement/TaxRuleManagement';
import TransactionHistory from './pages/TransactionHistory/TransactionHistory';
import DbStatus from './pages/DbStatus/DbStatus';
import './styles/global.css';


function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculator" element={<TaxCalculator />} />
            <Route path="/jurisdictions" element={<JurisdictionManagement />} />
            <Route path="/tax-rates" element={<TaxRateManagement />} />
            <Route path="/tax-rules" element={<TaxRuleManagement />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/db-status" element={<DbStatus />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App; 