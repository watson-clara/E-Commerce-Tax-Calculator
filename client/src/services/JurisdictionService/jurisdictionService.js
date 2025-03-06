import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all jurisdictions
export const getJurisdictions = async () => {
  try {
    const response = await axios.get(`${API_URL}/jurisdictions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jurisdictions:', error);
    throw error;
  }
};

// Get jurisdiction by ID
export const getJurisdictionById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/jurisdictions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching jurisdiction ${id}:`, error);
    throw error;
  }
};

// Add new jurisdiction
export const addJurisdiction = async (jurisdictionData) => {
  try {
    const response = await axios.post(`${API_URL}/jurisdictions`, jurisdictionData);
    return response.data;
  } catch (error) {
    console.error('Error adding jurisdiction:', error);
    throw error;
  }
};

// Update jurisdiction
export const updateJurisdiction = async (id, jurisdictionData) => {
  try {
    const response = await axios.put(`${API_URL}/jurisdictions/${id}`, jurisdictionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating jurisdiction ${id}:`, error);
    throw error;
  }
};

// Delete jurisdiction
export const deleteJurisdiction = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/jurisdictions/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting jurisdiction ${id}:`, error);
    throw error;
  }
}; 