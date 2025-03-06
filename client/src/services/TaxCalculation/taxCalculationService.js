// Tax rates by jurisdiction
export const taxRates = {
  'US-CA': { rate: 8.5, name: 'California' },
  'US-NY': { rate: 8.875, name: 'New York' },
  'US-TX': { rate: 6.25, name: 'Texas' },
  'US-FL': { rate: 6.0, name: 'Florida' },
  'CA-ON': { rate: 13.0, name: 'Ontario' },
  'CA-BC': { rate: 12.0, name: 'British Columbia' },
  'CA-QC': { rate: 14.975, name: 'Quebec' },
  'UK-': { rate: 20.0, name: 'United Kingdom' },
};

// Tax exemption rules
export const taxRules = {
  'US-CA': [
    { 
      name: 'Digital Products Exemption',
      description: 'Some digital products are exempt from sales tax in California',
      applies: (product) => ['E-book', 'Digital Media'].includes(product.type),
      modify: (rate) => 0 // Exempt
    },
    {
      name: 'SaaS Rule',
      description: 'SaaS products are taxable in California',
      applies: (product) => 
        product.type === 'Digital Software' && 
        product.name.toLowerCase().includes('saas'),
      modify: (rate) => rate // Standard rate
    }
  ],
  'US-NY': [
    {
      name: 'Educational Materials Exemption',
      description: 'Educational materials are exempt from sales tax in New York',
      applies: (product) => 
        product.type === 'E-book' && 
        product.name.toLowerCase().includes('education'),
      modify: (rate) => 0 // Exempt
    }
  ]
};

// Calculate tax for a set of products
export const calculateTax = (products, customerLocation) => {
  // Calculate subtotal
  const subtotal = products.reduce(
    (sum, product) => sum + (parseFloat(product.price) * parseInt(product.quantity)),
    0
  );
  
  // Determine tax rate based on location
  const locationKey = `${customerLocation.country}-${customerLocation.state || ''}`;
  
  // Apply tax rules for each product
  let totalTaxAmount = 0;
  
  for (const product of products) {
    const productSubtotal = parseFloat(product.price) * parseInt(product.quantity);
    const taxAmount = calculateTaxWithRules(product, customerLocation, productSubtotal);
    totalTaxAmount += taxAmount;
  }
  
  const total = subtotal + totalTaxAmount;
  const jurisdictionName = taxRates[locationKey]?.name || 'Unknown';
  
  return {
    subtotal: subtotal.toFixed(2),
    taxRate: taxRates[locationKey]?.rate || 0,
    taxAmount: totalTaxAmount.toFixed(2),
    total: total.toFixed(2),
    jurisdiction: jurisdictionName,
  };
};

// Apply tax rules to a specific product
export const calculateTaxWithRules = (product, customerLocation, subtotal = null) => {
  const locationKey = `${customerLocation.country}-${customerLocation.state || ''}`;
  const baseRate = taxRates[locationKey]?.rate || 0;
  const rules = taxRules[locationKey] || [];
  
  // If no subtotal provided, calculate it
  const productSubtotal = subtotal !== null ? 
    subtotal : 
    parseFloat(product.price) * parseInt(product.quantity);
  
  // Check if any rules apply to this product
  for (const rule of rules) {
    if (rule.applies(product)) {
      const modifiedRate = rule.modify(baseRate);
      return (productSubtotal * modifiedRate) / 100;
    }
  }
  
  // No rules apply, use standard rate
  return (productSubtotal * baseRate) / 100;
};

// Economic nexus thresholds by jurisdiction
export const nexusThresholds = {
  'US-CA': { revenue: 500000, transactions: 0 },
  'US-NY': { revenue: 500000, transactions: 100 },
  'US-TX': { revenue: 500000, transactions: 0 },
  'US-FL': { revenue: 100000, transactions: 200 }
};

// Determine if company has nexus in a jurisdiction
export const determineNexus = (company, jurisdiction) => {
  if (!nexusThresholds[jurisdiction]) {
    return false;
  }
  
  // Check if company exceeds thresholds
  const stateData = company.salesByState[jurisdiction] || { revenue: 0, transactions: 0 };
  const threshold = nexusThresholds[jurisdiction];
  
  if (!threshold) return false;
  
  return stateData.revenue >= threshold.revenue || 
         (threshold.transactions > 0 && stateData.transactions >= threshold.transactions);
};

// Calculate VAT for international sales
export const calculateVAT = (product, customerLocation) => {
  const vatRates = {
    'UK': 20,
    'EU-DE': 19,
    'EU-FR': 20,
    'EU-ES': 21
  };
  
  // B2B vs B2C determination (affects VAT in EU)
  const isB2B = customerLocation.vatId ? true : false;
  
  // Reverse charge mechanism for B2B within EU
  if (isB2B && customerLocation.country.startsWith('EU-')) {
    return 0; // Reverse charge applies
  }
  
  return vatRates[customerLocation.country] || 0;
}; 