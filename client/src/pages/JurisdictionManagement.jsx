import React, { useState, useEffect } from 'react';

const JurisdictionManagement = () => {
  const [jurisdictions, setJurisdictions] = useState([]);
  const [newJurisdiction, setNewJurisdiction] = useState({
    name: '',
    code: '',
    country: '',
    state_province: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would fetch from your API
    const mockJurisdictions = [
      { id: 1, name: 'California', code: 'US-CA', country: 'United States', state_province: 'California' },
      { id: 2, name: 'New York', code: 'US-NY', country: 'United States', state_province: 'New York' },
      { id: 3, name: 'Texas', code: 'US-TX', country: 'United States', state_province: 'Texas' },
      { id: 4, name: 'Ontario', code: 'CA-ON', country: 'Canada', state_province: 'Ontario' },
      { id: 5, name: 'United Kingdom', code: 'UK-', country: 'United Kingdom', state_province: null }
    ];
    
    setJurisdictions(mockJurisdictions);
    setLoading(false);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJurisdiction({
      ...newJurisdiction,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send a POST request to your API
    const mockNewJurisdiction = {
      ...newJurisdiction,
      id: jurisdictions.length + 1
    };
    
    setJurisdictions([...jurisdictions, mockNewJurisdiction]);
    setNewJurisdiction({
      name: '',
      code: '',
      country: '',
      state_province: ''
    });
  };

  if (loading) return <div>Loading jurisdictions...</div>;
  if (error) return <div>Error loading jurisdictions: {error}</div>;

  return (
    <div className="jurisdiction-management">
      <h1>Jurisdiction Management</h1>
      
      <section className="add-jurisdiction">
        <h2>Add New Jurisdiction</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Jurisdiction Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newJurisdiction.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={newJurisdiction.code}
              onChange={handleInputChange}
              required
              placeholder="e.g., US-CA"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={newJurisdiction.country}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="state_province">State/Province:</label>
            <input
              type="text"
              id="state_province"
              name="state_province"
              value={newJurisdiction.state_province || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <button type="submit" className="btn btn-primary">Add Jurisdiction</button>
        </form>
      </section>
      
      <section className="jurisdictions-list">
        <h2>Existing Jurisdictions</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Country</th>
              <th>State/Province</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jurisdictions.map(jurisdiction => (
              <tr key={jurisdiction.id}>
                <td>{jurisdiction.id}</td>
                <td>{jurisdiction.name}</td>
                <td>{jurisdiction.code}</td>
                <td>{jurisdiction.country}</td>
                <td>{jurisdiction.state_province || 'N/A'}</td>
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

export default JurisdictionManagement; 