import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Commerce Tax Calculator
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/calculator" className="nav-link">
              Tax Calculator
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/jurisdictions" className="nav-link">
              Jurisdictions
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tax-rates" className="nav-link">
              Tax Rates
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/tax-rules" className="nav-link">
              Tax Rules
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/transactions" className="nav-link">
              Transactions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 