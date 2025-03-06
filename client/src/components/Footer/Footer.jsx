import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>E-Commerce Tax Calculator</h3>
          <p>A comprehensive solution for calculating sales tax for digital products across multiple jurisdictions.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/calculator">Tax Calculator</Link></li>
            <li><Link to="/jurisdictions">Jurisdictions</Link></li>
            <li><Link to="/tax-rates">Tax Rates</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Resources</h3>
          <ul className="footer-links">
            <li><a href="https://github.com/watson-clara/e-commerce-tax-calculator" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener noreferrer">JavaScript Documentation</a></li>
            <li><a href="https://reactjs.org/docs/getting-started.html" target="_blank" rel="noopener noreferrer">React Documentation</a></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} E-Commerce Tax Calculator. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 