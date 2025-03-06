import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState('jurisdictions');
  
  const features = {
    jurisdictions: {
      title: 'Jurisdiction Management',
      description: 'Manage tax jurisdictions, rates, and special rules for different regions.',
      link: '/jurisdictions',
      linkText: 'Manage Jurisdictions'
    },
    taxRates: {
      title: 'Tax Rate Management',
      description: 'Set and update tax rates for different product types and jurisdictions.',
      link: '/tax-rates',
      linkText: 'Manage Tax Rates'
    },
    taxRules: {
      title: 'Tax Rule Management',
      description: 'Create and manage special tax rules and exemptions.',
      link: '/tax-rules',
      linkText: 'Manage Tax Rules'
    },
    transactions: {
      title: 'Transaction History',
      description: 'Track and review past transactions with detailed tax information.',
      link: '/transactions',
      linkText: 'View Transactions'
    }
  };
  
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>E-Commerce Tax Calculator</h1>
        <p className="lead">
          A comprehensive solution for calculating sales tax for digital products across multiple jurisdictions.
          Our powerful calculator helps you determine the correct sales tax based on customer location, 
          product type, and applicable tax rules.
        </p>
        <Link to="/calculator" className="btn btn-primary btn-lg hero-cta">
          Try the Tax Calculator
        </Link>
      </section>

      <section className="management-features">
        <h2>Management Tools</h2>
        <p className="section-intro">
          In addition to our tax calculator, we provide comprehensive tools to manage your tax settings:
        </p>
        
        <div className="features-tabs">
          <div className="tab-navigation">
            {Object.keys(features).map(key => (
              <button 
                key={key}
                className={`tab-button ${activeFeature === key ? 'active' : ''}`}
                onClick={() => setActiveFeature(key)}
              >
                {features[key].title}
              </button>
            ))}
          </div>
          
          <div className="feature-content">
            <h3>{features[activeFeature].title}</h3>
            <p>{features[activeFeature].description}</p>
            <Link to={features[activeFeature].link} className="btn btn-secondary">
              {features[activeFeature].linkText}
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>About the Project</h2>
        <p>
          The E-Commerce Tax Calculator is designed to help online businesses navigate the complex landscape of digital product taxation. 
          With constantly changing tax regulations across different jurisdictions, staying compliant can be challenging. 
          This application simplifies the process by providing accurate, up-to-date tax calculations and record-keeping.
        </p>
      </section>
    </div>
  );
};

export default Home; 