import React, { useState, useEffect } from 'react';
import { getTaxRules, addTaxRule, updateTaxRule, deleteTaxRule } from '../../services/TaxRuleService/taxRuleService';
import { getJurisdictions } from '../../services/JurisdictionService/jurisdictionService';
import './TaxRuleManagement.css';

const TaxRuleManagement = () => {
  const [taxRules, setTaxRules] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    jurisdiction_id: '',
    product_type: '',
    rule_type: '',
    threshold_value: '',
    is_exempt: false,
    description: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    jurisdiction_id: '',
    product_type: '',
    rule_type: '',
    is_exempt: ''
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    loadTaxRules();
    loadJurisdictions();
  }, []);

  const loadTaxRules = async () => {
    try {
      const data = await getTaxRules();
      setTaxRules(data);
    } catch (err) {
      setError('Failed to load tax rules');
      console.error(err);
    }
  };

  const loadJurisdictions = async () => {
    try {
      const data = await getJurisdictions();
      setJurisdictions(data);
    } catch (err) {
      setError('Failed to load jurisdictions');
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const applyFilter = () => {
    // In a real app, this would call the API with filter parameters
    // For now, we'll just simulate filtering on the client side
    loadTaxRules();
  };

  const resetFilter = () => {
    setFilter({
      jurisdiction_id: '',
      product_type: '',
      rule_type: '',
      is_exempt: ''
    });
    loadTaxRules();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTaxRule(formData.id, formData);
      } else {
        await addTaxRule(formData);
      }
      resetForm();
      loadTaxRules();
    } catch (err) {
      setError(isEditing ? 'Failed to update tax rule' : 'Failed to add tax rule');
      console.error(err);
    }
  };

  const handleEdit = (taxRule) => {
    setFormData(taxRule);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax rule?')) {
      try {
        await deleteTaxRule(id);
        loadTaxRules();
      } catch (err) {
        setError('Failed to delete tax rule');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      jurisdiction_id: '',
      product_type: '',
      rule_type: '',
      threshold_value: '',
      is_exempt: false,
      description: ''
    });
    setIsEditing(false);
  };

  const getJurisdictionName = (id) => {
    const jurisdiction = jurisdictions.find(j => j.id === id);
    return jurisdiction ? jurisdiction.name : 'Unknown';
  };

  // Filter and search tax rules
  const filteredTaxRules = taxRules.filter(taxRule => {
    // Search functionality - check if search term is in jurisdiction name, product type, or description
    const jurisdictionName = getJurisdictionName(taxRule.jurisdiction_id).toLowerCase();
    if (searchTerm && 
        !jurisdictionName.includes(searchTerm.toLowerCase()) &&
        !taxRule.product_type.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !taxRule.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    if (filter.jurisdiction_id && taxRule.jurisdiction_id !== filter.jurisdiction_id) {
      return false;
    }
    if (filter.product_type && taxRule.product_type !== filter.product_type) {
      return false;
    }
    if (filter.rule_type && taxRule.rule_type !== filter.rule_type) {
      return false;
    }
    if (filter.is_exempt !== '' && taxRule.is_exempt !== (filter.is_exempt === 'true')) {
      return false;
    }
    
    return true;
  });

  // Get unique product types for filter dropdown
  const productTypes = [...new Set(taxRules.map(tr => tr.product_type))].filter(Boolean);
  
  // Get unique rule types for filter dropdown
  const ruleTypes = [...new Set(taxRules.map(tr => tr.rule_type))].filter(Boolean);

  return (
    <div className="tax-rule-management-page">
      <div className="page-header">
      <h1>Tax Rule Management</h1>
        <p className="page-description">
          Create and manage special tax rules and exemptions for different product types and jurisdictions.
        </p>
      </div>

      <div className="calculator-form">
        <div className="form-section">
          <h2>{isEditing ? 'Edit Tax Rule' : 'Add New Tax Rule'}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
        <form onSubmit={handleSubmit}>
            <div className="form-row">
          <div className="form-group">
                <label htmlFor="jurisdiction_id">Jurisdiction</label>
            <select
              id="jurisdiction_id"
              name="jurisdiction_id"
                  value={formData.jurisdiction_id}
              onChange={handleInputChange}
                  className="form-control"
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
                <label htmlFor="product_type">Product Type</label>
                <select
                  id="product_type"
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Product Type</option>
                  <option value="Physical Good">Physical Good</option>
                  <option value="Digital Software">Digital Software</option>
                  <option value="E-book">E-book</option>
                  <option value="Digital Media">Digital Media</option>
                  <option value="Service">Service</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="rule_type">Rule Type</label>
                <select
                  id="rule_type"
                  name="rule_type"
                  value={formData.rule_type}
              onChange={handleInputChange}
                  className="form-control"
              required
                >
                  <option value="">Select Rule Type</option>
                  <option value="Threshold">Threshold</option>
                  <option value="Exemption">Exemption</option>
                  <option value="Special Rate">Special Rate</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
          </div>
          
          <div className="form-group">
                <label htmlFor="threshold_value">Threshold Value</label>
                <input
                  type="number"
                  id="threshold_value"
                  name="threshold_value"
                  value={formData.threshold_value}
              onChange={handleInputChange}
                  className="form-control"
                  step="0.01"
                  min="0"
                />
              </div>
          </div>
          
            <div className="form-row">
          <div className="form-group">
            <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="is_exempt"
                    name="is_exempt"
                    checked={formData.is_exempt}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="is_exempt">Is Exempt</label>
                </div>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Tax Rule' : 'Add Tax Rule'}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      
      <div className="results-section">
        <h2 className="results-header">Existing Tax Rules</h2>
        
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by jurisdiction, product type, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-toggle">
            <button 
              className="btn btn-outline-secondary btn-sm"
              onClick={toggleFilter}
            >
              {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
        </div>
        
        {isFilterVisible && (
          <div className="filter-section">
            <div className="filter-row">
              <div className="filter-group">
                <label>Jurisdiction</label>
                <select
                  name="jurisdiction_id"
                  value={filter.jurisdiction_id}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                >
                  <option value="">All Jurisdictions</option>
                  {jurisdictions.map(jurisdiction => (
                    <option key={jurisdiction.id} value={jurisdiction.id}>
                      {jurisdiction.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Product Type</label>
                <select
                  name="product_type"
                  value={filter.product_type}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                >
                  <option value="">All Product Types</option>
                  {productTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Rule Type</label>
                <select
                  name="rule_type"
                  value={filter.rule_type}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                >
                  <option value="">All Rule Types</option>
                  {ruleTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label>Exempt Status</label>
                <select
                  name="is_exempt"
                  value={filter.is_exempt}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                >
                  <option value="">All</option>
                  <option value="true">Exempt</option>
                  <option value="false">Not Exempt</option>
                </select>
              </div>
            </div>
            
            <div className="filter-actions">
              <button 
                className="btn btn-primary btn-sm"
                onClick={applyFilter}
              >
                Apply Filters
              </button>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={resetFilter}
              >
                Reset
              </button>
            </div>
          </div>
        )}
        
        <div className="results-table-container">
          <table className="results-table">
          <thead>
            <tr>
              <th>Jurisdiction</th>
                <th>Product Type</th>
                <th>Rule Type</th>
                <th>Threshold</th>
                <th>Exempt</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {filteredTaxRules.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-results">No tax rules found</td>
                </tr>
              ) : (
                filteredTaxRules.map((taxRule) => (
              <tr key={taxRule.id}>
                    <td>{getJurisdictionName(taxRule.jurisdiction_id)}</td>
                    <td>{taxRule.product_type}</td>
                    <td>{taxRule.rule_type}</td>
                    <td>{taxRule.threshold_value || 'N/A'}</td>
                    <td>{taxRule.is_exempt ? 'Yes' : 'No'}</td>
                    <td>{taxRule.description}</td>
                    <td>
                      <div className="button-group">
                        <button 
                          className="btn btn-edit btn-sm" 
                          onClick={() => handleEdit(taxRule)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(taxRule.id)}
                        >
                          Delete
                        </button>
                      </div>
                </td>
              </tr>
                ))
              )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default TaxRuleManagement; 