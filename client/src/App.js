import React, { useState } from 'react';
import { calculateTax } from './services/taxCalculationService';
import './App.css';

function App() {
  const [products, setProducts] = useState([
    { id: 1, name: '', type: '', price: '', quantity: 1 }
  ]);
  const [location, setLocation] = useState({ country: 'US', state: 'CA' });
  const [result, setResult] = useState(null);

  // Sample tax rates (in a real app, these would come from the backend)
  const taxRates = {
    'US-CA': { rate: 8.5, name: 'California' },
    'US-NY': { rate: 8.875, name: 'New York' },
    'US-TX': { rate: 6.25, name: 'Texas' },
    'US-FL': { rate: 6.0, name: 'Florida' },
    'CA-ON': { rate: 13.0, name: 'Ontario' },
    'UK-': { rate: 20.0, name: 'United Kingdom' },
  };

  // Product types
  const productTypes = [
    'Digital Software',
    'E-book',
    'Online Course',
    'Subscription Service',
    'Digital Media',
    'Other'
  ];

  const addProduct = () => {
    setProducts([
      ...products,
      { id: products.length + 1, name: '', type: '', price: '', quantity: 1 }
    ]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter(product => product.id !== id));
    }
  };

  const updateProduct = (id, field, value) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, [field]: value } : product
    ));
  };

  const handleCalculateTax = () => {
    // Validate inputs
    const isValid = products.every(p => p.name && p.type && p.price > 0);
    if (!isValid) {
      alert('Please fill in all product details');
      return;
    }

    try {
      // Use the tax calculation service
      const result = calculateTax(products, location);
      setResult(result);
    } catch (error) {
      alert(`Error calculating tax: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>E-Commerce Tax Calculator</h1>
        <p>
          Calculate sales tax for digital products across multiple jurisdictions.
        </p>
      </header>

      <main>
        <section className="calculator-section">
          <h2>Tax Calculator</h2>
          
          <div className="location-selector">
            <h3>Customer Location</h3>
            <div className="form-group">
              <label>Country:</label>
              <select 
                value={location.country}
                onChange={(e) => setLocation({...location, country: e.target.value})}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <div className="form-group">
              <label>State/Province:</label>
              <select 
                value={location.state}
                onChange={(e) => setLocation({...location, state: e.target.value})}
              >
                {location.country === 'US' && (
                  <>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </>
                )}
                {location.country === 'CA' && (
                  <>
                    <option value="ON">Ontario</option>
                    <option value="BC">British Columbia</option>
                    <option value="QC">Quebec</option>
                  </>
                )}
                {location.country === 'UK' && (
                  <option value="">All Regions</option>
                )}
              </select>
            </div>
          </div>

          <div className="products-section">
            <h3>Products</h3>
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <div className="form-group">
                  <label>Product Name:</label>
                  <input 
                    type="text" 
                    value={product.name}
                    onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                    placeholder="Product Name"
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

                <div className="form-row">
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

                  <button 
                    type="button" 
                    className="remove-btn"
                    onClick={() => removeProduct(product.id)}
                    disabled={products.length === 1}
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
              <div className="result-summary">
                <div className="result-item">
                  <span>Subtotal:</span>
                  <span>${result.subtotal}</span>
                </div>
                <div className="result-item">
                  <span>Tax Rate ({result.jurisdiction}):</span>
                  <span>{result.taxRate}%</span>
                </div>
                <div className="result-item">
                  <span>Tax Amount:</span>
                  <span>${result.taxAmount}</span>
                </div>
                <div className="result-item total">
                  <span>Total:</span>
                  <span>${result.total}</span>
                </div>
              </div>

              <div className="result-details">
                <h3>Order Details</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.type}</td>
                        <td>${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.quantity}</td>
                        <td>${(parseFloat(product.price) * parseInt(product.quantity)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        <section className="features-section">
          <h2>Features</h2>
          <ul>
            <li>Calculate sales tax for digital products based on jurisdiction</li>
            <li>Store and manage tax rates and rules</li>
            <li>Track transaction history</li>
            <li>Generate transaction reports</li>
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

export default App; 