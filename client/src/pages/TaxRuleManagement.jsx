import React, { useState, useEffect } from 'react';

const TaxRuleManagement = () => {
  const [taxRules, setTaxRules] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [newTaxRule, setNewTaxRule] = useState({
    jurisdiction_id: '',
    rule_name: '',
    rule_description: '',
    rule_logic: {
      exemptProductTypes: [],
      specialRates: []
    }
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
    
    const mockTaxRules = [
      { 
        id: 1, 
        jurisdiction_id: 1, 
        jurisdiction_name: 'California', 
        rule_name: 'Digital Products Exemption', 
        rule_description: 'Some digital products are exempt from sales tax in California',
        rule_logic: {
          exemptProductTypes: ['E-book', 'Digital Media']
        }
      },
      { 
        id: 2, 
        jurisdiction_id: 5, 
        jurisdiction_name: 'United Kingdom', 
        rule_name: 'Zero-rated Publications', 
        rule_description: 'Certain digital publications are zero-rated in the UK',
        rule_logic: {
          exemptProductTypes: ['E-book'],
          conditions: [
            { field: 'name', operator: 'not_contains', value: 'game' }
          ]
        }
      }
    ];
    
    setJurisdictions(mockJurisdictions);
    setTaxRules(mockTaxRules);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaxRule({
      ...newTaxRule,
      [name]: value
    });
  };

  const handleExemptProductChange = (e) => {
    const { value, checked } = e.target;
    let updatedExemptProducts = [...newTaxRule.rule_logic.exemptProductTypes];
    
    if (checked) {
      updatedExemptProducts.push(value);
    } else {
      updatedExemptProducts = updatedExemptProducts.filter(type => type !== value);
    }
    
    setNewTaxRule({
      ...newTaxRule,
      rule_logic: {
        ...newTaxRule.rule_logic,
        exemptProductTypes: updatedExemptProducts
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send a POST request to your API
    const selectedJurisdiction = jurisdictions.find(j => j.id === parseInt(newTaxRule.jurisdiction_id));
    
    const mockNewTaxRule = {
      ...newTaxRule,
      id: taxRules.length + 1,
      jurisdiction_id: parseInt(newTaxRule.jurisdiction_id),
      jurisdiction_name: selectedJurisdiction ? selectedJurisdiction.name : 'Unknown'
    };
    
    setTaxRules([...taxRules, mockNewTaxRule]);
    setNewTaxRule({
      jurisdiction_id: '',
      rule_name: '',
      rule_description: '',
      rule_logic: {
        exemptProductTypes: [],
        specialRates: []
      }
    });
  };

  if (loading) return <div>Loading tax rules...</div>;
  if (error) return <div>Error loading tax rules: {error}</div>;

  return (
    <div className="tax-rule-management">
      <h1>Tax Rule Management</h1>
      
      <section className="add-tax-rule">
        <h2>Add New Tax Rule</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jurisdiction_id">Jurisdiction:</label>
            <select
              id="jurisdiction_id"
              name="jurisdiction_id"
              value={newTaxRule.jurisdiction_id}
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
            <label htmlFor="rule_name">Rule Name:</label>
            <input
              type="text"
              id="rule_name"
              name="rule_name"
              value={newTaxRule.rule_name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rule_description">Description:</label>
            <textarea
              id="rule_description"
              name="rule_description"
              value={newTaxRule.rule_description}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          
          <div className="form-group">
            <label>Exempt Product Types:</label>
            <div className="checkbox-group">
              {['Digital Software', 'E-book', 'Online Course', 'Subscription Service', 'Digital Media', 'Other'].map(type => (
                <div key={type} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`exempt-${type}`}
                    name={`exempt-${type}`}
                    value={type}
                    checked={newTaxRule.rule_logic.exemptProductTypes.includes(type)}
                    onChange={handleExemptProductChange}
                  />
                  <label htmlFor={`exempt-${type}`}>{type}</label>
                </div>
              ))}
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary">Add Tax Rule</button>
        </form>
      </section>
      
      <section className="tax-rules-list">
        <h2>Existing Tax Rules</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Jurisdiction</th>
              <th>Rule Name</th>
              <th>Description</th>
              <th>Exempt Product Types</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {taxRules.map(taxRule => (
              <tr key={taxRule.id}>
                <td>{taxRule.id}</td>
                <td>{taxRule.jurisdiction_name}</td>
                <td>{taxRule.rule_name}</td>
                <td>{taxRule.rule_description}</td>
                <td>
                  {taxRule.rule_logic.exemptProductTypes && 
                   taxRule.rule_logic.exemptProductTypes.join(', ')}
                </td>
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

export default TaxRuleManagement; 