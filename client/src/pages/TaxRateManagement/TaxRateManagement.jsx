import React, { useState, useEffect } from 'react';

const TaxRateManagement = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [newTaxRate, setNewTaxRate] = useState({
    jurisdiction_id: '',
    rate: '',
    product_type: '',
    effective_date: '',
    end_date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockJurisdictions = [
      { id: 1, name: 'California' },
      { id: 2, name: 'New York' },
      { id: 3, name: 'Texas' },
      { id: 4, name: 'Ontario' },
      { id: 5, name: 'United Kingdom' }
    ];
    
    const mockTaxRates = [
      { id: 1, jurisdiction_id: 1, jurisdiction_name: 'California', rate: 8.5, product_type: 'Digital Software', effective_date: '2023-01-01', end_date: null },
      { id: 2, jurisdiction_id: 2, jurisdiction_name: 'New York', rate: 8.875, product_type: 'Digital Software', effective_date: '2023-01-01', end_date: null },
      { id: 3, jurisdiction_id: 3, jurisdiction_name: 'Texas', rate: 6.25, product_type: 'Digital Software', effective_date: '2023-01-01', end_date: null },
      { id: 4, jurisdiction_id: 4, jurisdiction_name: 'Ontario', rate: 13.0, product_type: 'Digital Software', effective_date: '2023-01-01', end_date: null },
      { id: 5, jurisdiction_id: 5, jurisdiction_name: 'United Kingdom', rate: 20.0, product_type: 'Digital Software', effective_date: '2023-01-01', end_date: null }
    ];
    
    setJurisdictions(mockJurisdictions);
    setTaxRates(mockTaxRates);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaxRate({
      ...newTaxRate,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send a POST request to your API
    const selectedJurisdiction = jurisdictions.find(j => j.id === parseInt(newTaxRate.jurisdiction_id));
    
    const mockNewTaxRate = {
      ...newTaxRate,
      id: taxRates.length + 1,
      jurisdiction_id: parseInt(newTaxRate.jurisdiction_id),
      rate: parseFloat(newTaxRate.rate),
      jurisdiction_name: selectedJurisdiction ? selectedJurisdiction.name : 'Unknown'
    };
    
    setTaxRates([...taxRates, mockNewTaxRate]);
    setNewTaxRate({
      jurisdiction_id: '',
      rate: '',
      product_type: '',
      effective_date: '',
      end_date: ''
    });
  };

  if (loading) return <div>Loading tax rates...</div>;
  if (error) return <div>Error loading tax rates: {error}</div>;

  return (
    <div className="tax-rate-management">
      <h1>Tax Rate Management</h1>
      
      <section className="add-tax-rate">
        <h2>Add New Tax Rate</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jurisdiction_id">Jurisdiction:</label>
            <select
              id="jurisdiction_id"
              name="jurisdiction_id"
              value={newTaxRate.jurisdiction_id}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Jurisdiction</option>
              {jurisdictions.map(jurisdiction => (
                <option key={jurisdiction.id} value={jurisdiction.id}>
                  {jurisdiction.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="rate">Tax Rate (%):</label>
            <input
              type="number"
              id="rate"
              name="rate"
              value={newTaxRate.rate}
              onChange={handleInputChange}
              required
              step="0.001"
              min="0"
              max="100"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="product_type">Product Type:</label>
            <select
              id="product_type"
              name="product_type"
              value={newTaxRate.product_type}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Product Type</option>
              <option value="Digital Software">Digital Software</option>
              <option value="E-book">E-book</option>
              <option value="Online Course">Online Course</option>
              <option value="Subscription Service">Subscription Service</option>
              <option value="Digital Media">Digital Media</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="effective_date">Effective Date:</label>
            <input
              type="date"
              id="effective_date"
              name="effective_date"
              value={newTaxRate.effective_date}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="end_date">End Date (Optional):</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
              value={newTaxRate.end_date || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Add Tax Rate</button>
        </form>
      </section>
      
      <section className="tax-rates-list">
        <h2>Existing Tax Rates</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jurisdiction</th>
              <th>Rate (%)</th>
              <th>Product Type</th>
              <th>Effective Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxRates.map(taxRate => (
              <tr key={taxRate.id}>
                <td>{taxRate.id}</td>
                <td>{taxRate.jurisdiction_name}</td>
                <td>{taxRate.rate.toFixed(3)}</td>
                <td>{taxRate.product_type}</td>
                <td>{taxRate.effective_date}</td>
                <td>{taxRate.end_date || 'N/A'}</td>
                <td>
                  <button className="btn btn-small">Edit</button>
                  <button className="btn btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default TaxRateManagement; 