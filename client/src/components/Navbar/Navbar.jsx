import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">E-Commerce Tax Calculator</Link>
      </div>
      <ul className="navbar-nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/calculator" className="nav-link">Calculator</Link>
        </li>
        <li className="nav-item">
          <Link to="/jurisdictions" className="nav-link">Jurisdictions</Link>
        </li>
        <li className="nav-item">
          <Link to="/tax-rates" className="nav-link">Tax Rates</Link>
        </li>
        <li className="nav-item">
          <Link to="/tax-rules" className="nav-link">Tax Rules</Link>
        </li>
        <li className="nav-item">
          <Link to="/transactions" className="nav-link">Transactions</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 