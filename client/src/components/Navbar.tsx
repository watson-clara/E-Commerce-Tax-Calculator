import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          E-Commerce Tax Calculator
        </Link>
        
        <button className="menu-button" onClick={toggleMenu}>
          {menuOpen ? '✕' : '☰'}
        </button>
        
        <ul className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <li className="navbar-item" style={{"--item-index": 0} as React.CSSProperties}>
            <Link to="/" className={`navbar-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          
          <li className="navbar-item" style={{"--item-index": 1} as React.CSSProperties}>
            <Link to="/calculator" className={`navbar-link ${isActive('/calculator')}`}>
              Tax Calculator
            </Link>
          </li>
          
          <li className="navbar-item" style={{"--item-index": 2} as React.CSSProperties}>
            <Link to="/jurisdictions" className={`navbar-link ${isActive('/jurisdictions')}`}>
              Jurisdictions
            </Link>
          </li>
          
          <li className="navbar-item" style={{"--item-index": 3} as React.CSSProperties}>
            <Link to="/tax-rates" className={`navbar-link ${isActive('/tax-rates')}`}>
              Tax Rates
            </Link>
          </li>
          
          <li className="navbar-item" style={{"--item-index": 4} as React.CSSProperties}>
            <Link to="/tax-rules" className={`navbar-link ${isActive('/tax-rules')}`}>
              Tax Rules
            </Link>
          </li>
          
          <li className="navbar-item" style={{"--item-index": 5} as React.CSSProperties}>
            <Link to="/transactions" className={`navbar-link ${isActive('/transactions')}`}>
              Transactions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 