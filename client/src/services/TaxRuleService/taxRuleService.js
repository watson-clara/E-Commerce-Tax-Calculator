// Mock tax rule data and service functions
const mockTaxRules = [
  {
    id: '1',
    jurisdiction_id: '1',
    product_type: 'Digital Software',
    rule_type: 'Threshold',
    threshold_value: 100,
    is_exempt: false,
    description: 'Sales tax applies only to purchases over $100'
  },
  {
    id: '2',
    jurisdiction_id: '2',
    product_type: 'E-book',
    rule_type: 'Exemption',
    threshold_value: 0,
    is_exempt: true,
    description: 'E-books are exempt from sales tax in New York'
  },
  {
    id: '3',
    jurisdiction_id: '3',
    product_type: 'Digital Media',
    rule_type: 'Special Rate',
    threshold_value: 0,
    is_exempt: false,
    description: 'Digital media has a special reduced tax rate'
  }
];

// Get all tax rules
export const getTaxRules = async () => {
  return [...mockTaxRules];
};

// Add a new tax rule
export const addTaxRule = async (taxRuleData) => {
  const newId = (Math.max(...mockTaxRules.map(r => parseInt(r.id))) + 1).toString();
  const newTaxRule = { ...taxRuleData, id: newId };
  mockTaxRules.push(newTaxRule);
  return newTaxRule;
};

// Update a tax rule
export const updateTaxRule = async (id, taxRuleData) => {
  const index = mockTaxRules.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Tax rule not found');
  }
  mockTaxRules[index] = { ...taxRuleData, id };
  return mockTaxRules[index];
};

// Delete a tax rule
export const deleteTaxRule = async (id) => {
  const index = mockTaxRules.findIndex(r => r.id === id);
  if (index === -1) {
    throw new Error('Tax rule not found');
  }
  mockTaxRules.splice(index, 1);
  return { success: true };
}; 