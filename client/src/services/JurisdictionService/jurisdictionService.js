// Mock jurisdiction data and service functions
const mockJurisdictions = [
  {
    id: '1',
    name: 'California',
    code: 'US-CA',
    country: 'US',
    state_province: 'CA',
    local_area: '',
    tax_authority: 'California Department of Tax and Fee Administration'
  },
  {
    id: '2',
    name: 'New York',
    code: 'US-NY',
    country: 'US',
    state_province: 'NY',
    local_area: '',
    tax_authority: 'New York State Department of Taxation and Finance'
  },
  {
    id: '3',
    name: 'Texas',
    code: 'US-TX',
    country: 'US',
    state_province: 'TX',
    local_area: '',
    tax_authority: 'Texas Comptroller of Public Accounts'
  }
];

// Get all jurisdictions
export const getJurisdictions = async () => {
  return [...mockJurisdictions];
};

// Add a new jurisdiction
export const addJurisdiction = async (jurisdictionData) => {
  const newId = (Math.max(...mockJurisdictions.map(j => parseInt(j.id))) + 1).toString();
  const newJurisdiction = { ...jurisdictionData, id: newId };
  mockJurisdictions.push(newJurisdiction);
  return newJurisdiction;
};

// Update a jurisdiction
export const updateJurisdiction = async (id, jurisdictionData) => {
  const index = mockJurisdictions.findIndex(j => j.id === id);
  if (index === -1) {
    throw new Error('Jurisdiction not found');
  }
  mockJurisdictions[index] = { ...jurisdictionData, id };
  return mockJurisdictions[index];
};

// Delete a jurisdiction
export const deleteJurisdiction = async (id) => {
  const index = mockJurisdictions.findIndex(j => j.id === id);
  if (index === -1) {
    throw new Error('Jurisdiction not found');
  }
  mockJurisdictions.splice(index, 1);
  return { success: true };
}; 