import React from 'react';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <h1>E-Commerce Tax Calculator</h1>
        <p className="lead">
          A comprehensive solution for calculating sales tax for digital products across multiple jurisdictions.
        </p>
        <div className="cta-buttons">
          <a href="/calculator" className="btn btn-primary">Try the Calculator</a>
          <a href="/jurisdictions" className="btn btn-secondary">Manage Jurisdictions</a>
        </div>
      </section>

      <section className="features-overview">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Tax Calculation</h3>
            <p>Calculate accurate sales tax for digital products based on customer location and product type.</p>
          </div>
          <div className="feature-card">
            <h3>Jurisdiction Management</h3>
            <p>Manage tax jurisdictions, rates, and special rules for different regions.</p>
          </div>
          <div className="feature-card">
            <h3>Transaction History</h3>
            <p>Track and review past transactions with detailed tax information.</p>
          </div>
          <div className="feature-card">
            <h3>Reporting</h3>
            <p>Generate tax reports for compliance and financial planning.</p>
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