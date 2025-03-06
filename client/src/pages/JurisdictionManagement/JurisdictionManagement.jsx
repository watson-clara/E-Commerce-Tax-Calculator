import React, { useState, useEffect } from 'react';
import { getJurisdictions, addJurisdiction, updateJurisdiction, deleteJurisdiction } from '../../services/JurisdictionService/jurisdictionService';
import './JurisdictionManagement.css';

const JurisdictionManagement = () => {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    code: '',
    country: '',
    state_province: '',
    local_area: '',
    tax_authority: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    country: '',
    state_province: ''
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  useEffect(() => {
    loadJurisdictions();
  }, []);

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
    loadJurisdictions();
  };

  const resetFilter = () => {
    setFilter({
      country: '',
      state_province: ''
    });
    loadJurisdictions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateJurisdiction(formData.id, formData);
      } else {
        await addJurisdiction(formData);
      }
      resetForm();
      loadJurisdictions();
    } catch (err) {
      setError(isEditing ? 'Failed to update jurisdiction' : 'Failed to add jurisdiction');
      console.error(err);
    }
  };

  const handleEdit = (jurisdiction) => {
    setFormData(jurisdiction);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this jurisdiction?')) {
      try {
        await deleteJurisdiction(id);
        loadJurisdictions();
      } catch (err) {
        setError('Failed to delete jurisdiction');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      code: '',
      country: '',
      state_province: '',
      local_area: '',
      tax_authority: ''
    });
    setIsEditing(false);
  };

  // Filter and search jurisdictions
  const filteredJurisdictions = jurisdictions.filter(jurisdiction => {
    // Search functionality - check if search term is in name or code
    if (searchTerm && 
        !jurisdiction.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !jurisdiction.code.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply filters
    if (filter.country && jurisdiction.country !== filter.country) {
      return false;
    }
    if (filter.state_province && jurisdiction.state_province !== filter.state_province) {
      return false;
    }
    
    return true;
  });

  // Get unique countries for filter dropdown
  const countries = [...new Set(jurisdictions.map(j => j.country))].filter(Boolean);
  
  // Get unique states/provinces for filter dropdown
  const statesProvinces = [...new Set(jurisdictions.map(j => j.state_province))].filter(Boolean);

  return (
    <div className="management-container">
      <div className="management-content">
        <h1>Jurisdiction Management</h1>
        
        <div className="form-section">
          <h2>{isEditing ? 'Edit Jurisdiction' : 'Add New Jurisdiction'}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Jurisdiction Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="code">Jurisdiction Code</label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="state_province">State/Province</label>
                <select
                  id="state_province"
                  name="state_province"
                  value={formData.state_province}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select State/Province</option>
                  {statesProvinces.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="local_area">Local Area (Optional)</label>
                <input
                  type="text"
                  id="local_area"
                  name="local_area"
                  value={formData.local_area}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tax_authority">Tax Authority</label>
                <input
                  type="text"
                  id="tax_authority"
                  name="tax_authority"
                  value={formData.tax_authority}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
            </div>
            
            <div className="action-buttons">
              <button type="submit" className="btn btn-primary">
                {isEditing ? 'Update Jurisdiction' : 'Add Jurisdiction'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="results-section">
          <h2 className="results-header">Existing Jurisdictions</h2>
          
          <div className="table-controls">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search jurisdictions..."
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
                  <label>Country</label>
                  <select
                    name="country"
                    value={filter.country}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>State/Province</label>
                  <select
                    name="state_province"
                    value={filter.state_province}
                    onChange={handleFilterChange}
                    className="form-control form-control-sm"
                  >
                    <option value="">All States/Provinces</option>
                    {statesProvinces.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
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
                  <th>Name</th>
                  <th>Code</th>
                  <th>Country</th>
                  <th>State/Province</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJurisdictions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-results">No jurisdictions found</td>
                  </tr>
                ) : (
                  filteredJurisdictions.map((jurisdiction) => (
                    <tr key={jurisdiction.id}>
                      <td>{jurisdiction.name}</td>
                      <td>{jurisdiction.code}</td>
                      <td>{jurisdiction.country}</td>
                      <td>{jurisdiction.state_province}</td>
                      <td>
                        <div className="button-group">
                          <button 
                            className="btn btn-edit btn-sm" 
                            onClick={() => handleEdit(jurisdiction)}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-danger btn-sm" 
                            onClick={() => handleDelete(jurisdiction.id)}
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
    </div>
  );
};

export default JurisdictionManagement; 