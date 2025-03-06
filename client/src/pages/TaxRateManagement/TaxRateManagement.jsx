import React, { useState, useEffect } from 'react';
import { getTaxRates, addTaxRate, updateTaxRate, deleteTaxRate } from '../../services/TaxRateService/taxRateService';
import { getJurisdictions } from '../../services/JurisdictionService/jurisdictionService';
import './TaxRateManagement.css';

const TaxRateManagement = () => {
  const [taxRates, setTaxRates] = useState([]);
  const [jurisdictions, setJurisdictions] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    jurisdiction_id: '',
    product_type: '',
    rate: '',
    effective_date: '',
    end_date: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    jurisdiction_id: '',
    product_type: '',
    min_rate: '',
    max_rate: ''
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    loadTaxRates();
    loadJurisdictions();
  }, []);

  const loadTaxRates = async () => {
    try {
      const data = await getTaxRates();
      setTaxRates(data);
    } catch (err) {
      setError('Failed to load tax rates');
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    loadTaxRates();
  };

  const resetFilter = () => {
    setFilter({
      jurisdiction_id: '',
      product_type: '',
      min_rate: '',
      max_rate: ''
    });
    loadTaxRates();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTaxRate(formData.id, formData);
      } else {
        await addTaxRate(formData);
      }
      resetForm();
      loadTaxRates();
    } catch (err) {
      setError(isEditing ? 'Failed to update tax rate' : 'Failed to add tax rate');
      console.error(err);
    }
  };

  const handleEdit = (taxRate) => {
    setFormData(taxRate);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tax rate?')) {
      try {
        await deleteTaxRate(id);
        loadTaxRates();
      } catch (err) {
        setError('Failed to delete tax rate');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      jurisdiction_id: '',
      product_type: '',
      rate: '',
      effective_date: '',
      end_date: ''
    });
    setIsEditing(false);
  };

  const getJurisdictionName = (id) => {
    const jurisdiction = jurisdictions.find(j => j.id === id);
    return jurisdiction ? jurisdiction.name : 'Unknown';
  };

  // Filter and search tax rates
  const filteredTaxRates = taxRates.filter(taxRate => {
    // Search functionality - check if search term is in jurisdiction name or product type
    const jurisdictionName = getJurisdictionName(taxRate.jurisdiction_id).toLowerCase();
    if (searchTerm && 
        !jurisdictionName.includes(searchTerm.toLowerCase()) &&
        !taxRate.product_type.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    if (filter.jurisdiction_id && taxRate.jurisdiction_id !== filter.jurisdiction_id) {
      return false;
    }
    if (filter.product_type && taxRate.product_type !== filter.product_type) {
      return false;
    }
    if (filter.min_rate && parseFloat(taxRate.rate) < parseFloat(filter.min_rate)) {
      return false;
    }
    if (filter.max_rate && parseFloat(taxRate.rate) > parseFloat(filter.max_rate)) {
      return false;
    }
    
    return true;
  });

  // Get unique product types for filter dropdown
  const productTypes = [...new Set(taxRates.map(tr => tr.product_type))].filter(Boolean);

  return (
    <div className="tax-rate-management-page">
      <div className="page-header">
      <h1>Tax Rate Management</h1>
        <p className="page-description">
          Set and update tax rates for different product types and jurisdictions.
        </p>
      </div>

      <div className="calculator-form">
        <div className="form-section">
          <h2>{isEditing ? 'Edit Tax Rate' : 'Add New Tax Rate'}</h2>
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
                <label htmlFor="rate">Tax Rate (%)</label>
            <input
              type="number"
              id="rate"
              name="rate"
                  value={formData.rate}
              onChange={handleInputChange}
                  className="form-control"
                  step="0.01"
              min="0"
              max="100"
                  required
            />
          </div>
          
          <div className="form-group">
                <label htmlFor="effective_date">Effective Date</label>
            <input
              type="date"
              id="effective_date"
              name="effective_date"
                  value={formData.effective_date}
              onChange={handleInputChange}
                  className="form-control"
              required
            />
              </div>
          </div>
          
            <div className="form-row">
          <div className="form-group">
                <label htmlFor="end_date">End Date (Optional)</label>
            <input
              type="date"
              id="end_date"
              name="end_date"
                  value={formData.end_date}
              onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Tax Rate' : 'Add Tax Rate'}
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
        <h2 className="results-header">Existing Tax Rates</h2>
        
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by jurisdiction or product type..."
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
                <label>Min Rate (%)</label>
                <input
                  type="number"
                  name="min_rate"
                  value={filter.min_rate}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="filter-group">
                <label>Max Rate (%)</label>
                <input
                  type="number"
                  name="max_rate"
                  value={filter.max_rate}
                  onChange={handleFilterChange}
                  className="form-control form-control-sm"
                  step="0.01"
                  min="0"
                />
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
              <th>Rate (%)</th>
              <th>Effective Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {filteredTaxRates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-results">No tax rates found</td>
                </tr>
              ) : (
                filteredTaxRates.map((taxRate) => (
              <tr key={taxRate.id}>
                    <td>{getJurisdictionName(taxRate.jurisdiction_id)}</td>
                <td>{taxRate.product_type}</td>
                    <td>{taxRate.rate}%</td>
                    <td>{new Date(taxRate.effective_date).toLocaleDateString()}</td>
                    <td>{taxRate.end_date ? new Date(taxRate.end_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="button-group">
                        <button 
                          className="btn btn-edit btn-sm" 
                          onClick={() => handleEdit(taxRate)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={() => handleDelete(taxRate.id)}
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

export default TaxRateManagement; 