import React from 'react';
import TaxCalculatorContent from './TaxCalculatorContent';
import './TaxCalculator.css';

const TaxCalculator = () => {
  return (
    <div className="tax-calculator-page">
      <div className="page-header">
        <h1>Tax Calculator</h1>
        <p className="page-description">
          Calculate sales tax for digital products based on customer location and product type.
        </p>
      </div>
      <TaxCalculatorContent />
    </div>
  );
};

export default TaxCalculator; 