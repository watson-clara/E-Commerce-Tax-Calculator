// Mock tax rate data and service functions
const mockTaxRates = [
  {
    id: '1',
    jurisdiction_id: '1',
    product_type: 'Digital Software',
    rate: 8.25,
    effective_date: '2023-01-01',
    end_date: ''
  },
  {
    id: '2',
    jurisdiction_id: '2',
    product_type: 'E-book',
    rate: 4.5,
    effective_date: '2023-01-01',
    end_date: ''
  },
  {
    id: '3',
    jurisdiction_id: '3',
    product_type: 'Digital Media',
    rate: 6.25,
    effective_date: '2023-01-01',
    end_date: ''
  }
];

// Get all tax rates
export const getTaxRates = async () => {
  return [...mockTaxRates];
};

// Add a new tax rate
export const addTaxRate = async (taxRateData) => {
  const newId = (Math.max(...mockTaxRates.map(t => parseInt(t.id))) + 1).toString();
  const newTaxRate = { ...taxRateData, id: newId };
  mockTaxRates.push(newTaxRate);
  return newTaxRate;
};

// Update a tax rate
export const updateTaxRate = async (id, taxRateData) => {
  const index = mockTaxRates.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Tax rate not found');
  }
  mockTaxRates[index] = { ...taxRateData, id };
  return mockTaxRates[index];
};

// Delete a tax rate
export const deleteTaxRate = async (id) => {
  const index = mockTaxRates.findIndex(t => t.id === id);
  if (index === -1) {
    throw new Error('Tax rate not found');
  }
  mockTaxRates.splice(index, 1);
  return { success: true };
}; 