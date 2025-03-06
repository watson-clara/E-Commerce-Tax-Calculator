import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-column">
          <h3>E-Commerce Tax Calculator</h3>
          <p>
            A comprehensive solution for calculating sales tax for digital products
            across multiple jurisdictions.
          </p>
        </div>
        
        <div className="footer-links-container">
          <div className="footer-links-column">
            <Link to="/">Home</Link>
            <Link to="/calculator">Calculator</Link>
            <Link to="/jurisdictions">Jurisdictions</Link>
          </div>
          <div className="footer-links-column">
            <Link to="/tax-rates">Tax Rates</Link>
            <Link to="/tax-rules">Tax Rules</Link>
            <Link to="/transactions">Transactions</Link>
          </div>
        </div>
      </div>
      
      <div className="footer-copyright">
        <p>&copy; {currentYear} E-Commerce Tax Calculator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 