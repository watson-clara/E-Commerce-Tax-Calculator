import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DbStatus.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const DbStatus = () => {
  const [status, setStatus] = useState({ loading: true });
  const [error, setError] = useState(null);

  useEffect(() => {
    checkDbStatus();
  }, []);

  const checkDbStatus = async () => {
    try {
      setStatus({ loading: true });
      const response = await axios.get(`${API_URL}/health`);
      setStatus({
        loading: false,
        ...response.data
      });
      setError(null);
    } catch (err) {
      setStatus({ loading: false });
      setError(err.message || 'Failed to connect to the server');
    }
  };

  return (
    <div className="db-status-container">
      <h1>Database Status</h1>
      
      {status.loading ? (
        <div className="loading">Checking database status...</div>
      ) : (
        <div className={`status-card ${status.database === 'connected' ? 'connected' : 'disconnected'}`}>
          <h2>Connection Status</h2>
          <p className="status">
            <span className="status-label">Status:</span> 
            <span className="status-value">{status.status}</span>
          </p>
          <p className="database">
            <span className="status-label">Database:</span> 
            <span className="status-value">{status.database}</span>
          </p>
          {status.timestamp && (
            <p className="timestamp">
              <span className="status-label">Last checked:</span> 
              <span className="status-value">{new Date(status.timestamp).toLocaleString()}</span>
            </p>
          )}
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      <button className="refresh-button" onClick={checkDbStatus}>
        Refresh Status
      </button>
    </div>
  );
};

export default DbStatus; 