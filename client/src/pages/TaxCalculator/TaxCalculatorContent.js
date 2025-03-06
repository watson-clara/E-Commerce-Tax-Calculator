import React, { useState } from 'react';
import { calculateTax } from '../../services/TaxCalculation/taxCalculationService';
import '../../styles/global.css';

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
              
              {location.country === 'US' && (
                <div className="form-group">
                  <label>State:</label>
                  <select 
                    name="state" 
                    value={location.state}
                    onChange={handleLocationChange}
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
              )}
              
              {location.country === 'CA' && (
                <div className="form-group">
                  <label>Province:</label>
                  <select 
                    name="state" 
                    value={location.state}
                    onChange={handleLocationChange}
                  >
                    <option value="ON">Ontario</option>
                    <option value="BC">British Columbia</option>
                    <option value="QC">Quebec</option>
                  </select>
                </div>
              )}
            </div>
          </div>
          
          <div className="products-section">
            <h3>Products</h3>
            {products.map((product, index) => (
              <div key={product.id} className="product-item">
                <div className="product-header">
                  <span className="product-title">Product {index + 1}</span>
                  {products.length > 1 && (
                    <button 
                      type="button" 
                      className="remove-btn"
                      onClick={() => removeProduct(product.id)}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input 
                      type="text" 
                      value={product.name}
                      onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                      placeholder="Product name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Type:</label>
                    <select 
                      value={product.type}
                      onChange={(e) => updateProduct(product.id, 'type', e.target.value)}
                    >
                      <option value="">Select type</option>
                      {productTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
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
                  
                  <div className="form-group">
                    <label>Quantity:</label>
                    <input 
                      type="number" 
                      value={product.quantity}
                      onChange={(e) => updateProduct(product.id, 'quantity', e.target.value)}
                      min="1"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" className="add-product-btn" onClick={addProduct}>
              Add Another Product
            </button>
          </div>
          
          <button type="button" className="calculate-btn" onClick={handleCalculateTax}>
            Calculate Tax
          </button>
        </section>
        
        {result && (
          <section className="results-section">
            <h2>Tax Calculation Results</h2>
            
            <div className="result-summary">
              <div className="result-card">
                <span className="result-label">Subtotal</span>
                <span className="result-value">${result.subtotal}</span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Tax Rate</span>
                <span className="result-value">{result.taxRate}%</span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Tax Amount</span>
                <span className="result-value tax">${result.taxAmount}</span>
              </div>
              
              <div className="result-card">
                <span className="result-label">Total</span>
                <span className="result-value total">${result.total}</span>
              </div>
            </div>
            
            <div className="result-breakdown">
              <h3 className="breakdown-title">Tax Jurisdiction: {result.jurisdiction}</h3>
              
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Tax</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {products.filter(p => p.name && p.type && p.price).map(product => {
                    const subtotal = parseFloat(product.price) * product.quantity;
                    const tax = subtotal * (result.taxRate / 100);
                    const total = subtotal + tax;
                    
                    return (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.quantity}</td>
                        <td>${subtotal.toFixed(2)}</td>
                        <td>${tax.toFixed(2)}</td>
                        <td>${total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default TaxCalculatorContent; 