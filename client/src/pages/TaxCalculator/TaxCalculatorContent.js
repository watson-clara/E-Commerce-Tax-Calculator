import React, { useState } from 'react';
import { calculateTax } from '../../services/TaxCalculation/taxCalculationService';
import '../../styles/global.css';

const TaxCalculatorContent = () => {
  const initialProductState = { id: 1, name: '', type: '', price: '', quantity: 1 };
  const initialLocationState = { country: 'US', state: 'CA' };
  
  const [products, setProducts] = useState([initialProductState]);
  const [customerLocation, setCustomerLocation] = useState(initialLocationState);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleProductChange = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleLocationChange = (field, value) => {
    setCustomerLocation({ ...customerLocation, [field]: value });
  };

  const addProduct = () => {
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    setProducts([...products, { id: newId, name: '', type: '', price: '', quantity: 1 }]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };
  
  const clearForm = () => {
    setProducts([initialProductState]);
    setCustomerLocation(initialLocationState);
    setResults(null);
    setError('');
  };

  const handleCalculate = () => {
    // Reset any previous errors
    setError('');
    
    // Validate inputs
    const isValid = products.every(p => p.name && p.type && p.price);
    if (!isValid) {
      setError('Please fill in all product details');
      return;
    }

    try {
      // Format products for calculation
      const formattedProducts = products.map(p => ({
        product_id: p.id.toString(),
        product_name: p.name,
        product_type: p.type,
        quantity: parseInt(p.quantity) || 1,
        unit_price: parseFloat(p.price)
      }));

      // Calculate tax
      const taxResults = calculateTax(formattedProducts, {
        country: customerLocation.country,
        state_province: customerLocation.state
      });

      setResults(taxResults);
    } catch (err) {
      setError('Error calculating tax: ' + err.message);
      console.error(err);
    }
  };

  const getStateName = (stateCode) => {
    const states = {
      'CA': 'California',
      'NY': 'New York',
      'TX': 'Texas',
      'FL': 'Florida'
    };
    return states[stateCode] || stateCode;
  };

  return (
    <div className="calculator-container">
      <div className="calculator-form">
        {error && <div className="alert alert-danger">{error}</div>}
        
        <div className="form-section">
          <h2>Products</h2>
          <div className="product-list">
            {products.map((product, index) => (
              <React.Fragment key={product.id}>
                <div className="product-item">
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor={`product-name-${product.id}`}>Product Name</label>
                      <input
                        type="text"
                        id={`product-name-${product.id}`}
                        className="form-control"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={(e) => handleProductChange(product.id, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`product-type-${product.id}`}>Product Type</label>
                      <select
                        id={`product-type-${product.id}`}
                        className="form-control"
                        value={product.type}
                        onChange={(e) => handleProductChange(product.id, 'type', e.target.value)}
                        aria-label="Product Type"
                      >
                        <option value="">Select Type</option>
                        <option value="Physical Good">Physical Good</option>
                        <option value="Digital Software">Digital Software</option>
                        <option value="E-book">E-book</option>
                        <option value="Digital Media">Digital Media</option>
                        <option value="Service">Service</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor={`product-price-${product.id}`}>Price ($)</label>
                      <input
                        type="number"
                        id={`product-price-${product.id}`}
                        className="form-control"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        value={product.price}
                        onChange={(e) => handleProductChange(product.id, 'price', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor={`product-quantity-${product.id}`}>Quantity</label>
                      <input
                        type="number"
                        id={`product-quantity-${product.id}`}
                        className="form-control"
                        placeholder="1"
                        min="1"
                        step="1"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(product.id, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ padding: ".5rem" }}>
                    {products.length > 1 && (
                    <div>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => removeProduct(product.id)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                 
                )}
              
           
                    </div>
                  
                  </div>
                </div>
                </React.Fragment>
               ))} 
          </div>
          
          <div className="product-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={addProduct}
              type="button"
            >
              Add Another Product
            </button>
          </div>
        </div>

        <div className="form-section">
          <h2>Customer Location</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="customer-country">Country</label>
              <select
                id="customer-country"
                className="form-control"
                value={customerLocation.country}
                onChange={(e) => handleLocationChange('country', e.target.value)}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="EU">European Union</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="customer-state">State/Province</label>
              <select
                id="customer-state"
                className="form-control"
                value={customerLocation.state}
                onChange={(e) => handleLocationChange('state', e.target.value)}
                aria-label="State/Province"
              >
                <option value="CA">California</option>
                <option value="NY">New York</option>
                <option value="TX">Texas</option>
                <option value="FL">Florida</option>
              </select>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn btn-primary btn-lg calculate-button"
            onClick={handleCalculate}
            type="button"
          >
            Calculate Tax
          </button>
          <button 
            className="btn btn-secondary btn-lg"
            onClick={clearForm}
            type="button"
          >
            Clear Form
          </button>
        </div>
      </div>

      {results && (
        <div className="results-section">
          <h2 className="results-header">Tax Calculation Results</h2>
          <table className="results-table">
            <tbody>
              <tr>
                <th>Subtotal:</th>
                <td>${results.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Tax Rate ({getStateName(customerLocation.state)}):</th>
                <td>{results.tax_rate}%</td>
              </tr>
              <tr>
                <th>Tax Amount:</th>
                <td>${results.tax_amount.toFixed(2)}</td>
              </tr>
              <tr>
                <th>Total:</th>
                <td>${results.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          <div className="tax-rate-info">
            <p>Note: Tax rates are based on the customer's location and product types. Some products may be exempt from tax in certain jurisdictions.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxCalculatorContent; 