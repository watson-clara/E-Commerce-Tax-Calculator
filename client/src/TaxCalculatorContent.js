import React, { useState } from 'react';
import { calculateTax } from './services/taxCalculationService';
import './App.css';

function TaxCalculatorContent() {
  const [products, setProducts] = useState([
    { id: 1, name: '', type: '', price: '', quantity: 1 }
  ]);
  const [location, setLocation] = useState({ country: 'US', state: 'CA' });
  const [result, setResult] = useState(null);

  // Sample product types
  const productTypes = [
    'Digital Software',
    'E-book',
    'Online Course',
    'Subscription Service',
    'Digital Media'
  ];

  // Add a new product
  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      name: '',
      type: '',
      price: '',
      quantity: 1
    };
    setProducts([...products, newProduct]);
  };

  // Remove a product
  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  // Update product details
  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  // Handle location change
  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocation({ ...location, [name]: value });
  };

  // Calculate tax
  const handleCalculateTax = () => {
    // Validate inputs
    const validProducts = products.filter(p => p.name && p.type && p.price);
    if (validProducts.length === 0) {
      alert('Please add at least one product with all details filled out.');
      return;
    }

    // Calculate tax
    const taxResult = calculateTax(validProducts, location);
    setResult(taxResult);
  };

  return (
    <div className="tax-calculator">
      <header>
        <h1>E-Commerce Tax Calculator</h1>
        <p>Calculate sales tax for digital products across multiple jurisdictions</p>
      </header>

      <main>
        <section className="calculator-section">
          <h2>Tax Calculator</h2>
          
          <div className="location-selector">
            <h3>Customer Location</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Country:</label>
                <select 
                  name="country" 
                  value={location.country}
                  onChange={handleLocationChange}
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              
              {location.country !== 'UK' && (
                <div className="form-group">
                  <label>State/Province:</label>
                  <select 
                    name="state" 
                    value={location.state}
                    onChange={handleLocationChange}
                  >
                    {location.country === 'US' ? (
                      <>
                        <option value="CA">California</option>
                        <option value="NY">New York</option>
                        <option value="TX">Texas</option>
                        <option value="FL">Florida</option>
                      </>
                    ) : (
                      <>
                        <option value="ON">Ontario</option>
                        <option value="BC">British Columbia</option>
                        <option value="QC">Quebec</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="products-section">
            <h3>Products</h3>
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="form-group">
                  <label>Product Name:</label>
                  <input 
                    type="text" 
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    placeholder="Enter product name"
                  />
                </div>
                
                <div className="form-group">
                  <label>Product Type:</label>
                  <select
                    value={product.type}
                    onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {productTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-row" style={{gap: '20px', alignItems: 'flex-start'}}>
                  <div className="form-group">
                    <label>Price ($):</label>
                    <input 
                      type="number" 
                      value={product.price}
                      onChange={(e) => updateProduct(product.id, 'price', e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="form-group" style={{marginLeft: '20px'}}>
                    <label>Quantity:</label>
                    <input 
                      type="number" 
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                      min="1"
                    />
                  </div>

                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeProduct(product.id)}
                    disabled={products.length === 1}
                    style={{marginLeft: 'auto', alignSelf: 'flex-end'}}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="add-btn" onClick={addProduct}>
              Add Product
            </button>
          </div>

          <button type="button" className="calculate-btn" onClick={handleCalculateTax}>
            Calculate Tax
          </button>
        </section>

        {result && (
          <section className="results-section">
            <h2>Tax Calculation Results</h2>
            <div className="result-card">
              <div className="result-row">
                <span className="result-label">Subtotal:</span>
                <span className="result-value">${result.subtotal}</span>
              </div>
              <div className="result-row">
                <span className="result-label">Tax Rate ({result.jurisdiction}):</span>
                <span className="result-value">{result.taxRate}%</span>
              </div>
              <div className="result-row">
                <span className="result-label">Tax Amount:</span>
                <span className="result-value">${result.taxAmount}</span>
              </div>
              <div className="result-row total">
                <span className="result-label">Total:</span>
                <span className="result-value">${result.total}</span>
              </div>
            </div>
          </section>
        )}

        <section className="info-section">
          <h2>About Tax Calculation</h2>
          <p>This calculator determines sales tax based on:</p>
          <ul>
            <li>Customer location (country and state/province)</li>
            <li>Product type (different digital products may have different tax treatments)</li>
            <li>Applicable tax rates and rules for the jurisdiction</li>
          </ul>
          <p><em>Note: This is a simplified demo. In the full application, tax calculations would be performed by the backend with accurate, up-to-date tax rates and rules.</em></p>
        </section>
      </main>

      <footer>
        <p>&copy; 2025 E-Commerce Tax Calculator</p>
      </footer>
    </div>
  );
}

export default TaxCalculatorContent; 