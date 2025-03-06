// Define proper types for our objects
interface TaxRateInfo {
  rate: number;
  name: string;
}

interface TaxRule {
  name: string;
  description: string;
  applies: (product: Product) => boolean;
  modify: (rate: number) => number;
}

interface TaxRates {
  [key: string]: TaxRateInfo;
}

interface TaxRules {
  [key: string]: TaxRule[];
}

export interface Product {
  name: string;
  type: string;
  price: number | string;
  quantity: number | string;
}

export interface CustomerLocation {
  country: string;
  state?: string;
  city?: string;
  postalCode?: string;
  vatId?: string;
}

// Tax rates by jurisdiction
export const taxRates: TaxRates = {
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
export const taxRules: TaxRules = {
  'US-CA': [
    { 
      name: 'Digital Products Exemption',
      description: 'Some digital products are exempt from sales tax in California',
      applies: (product) => ['E-book', 'Digital Media'].includes(product.type),
      modify: (rate) => 0
    }
  ],
  'US-NY': [
    {
      name: 'Educational Materials Discount',
      description: 'Educational materials have a reduced tax rate in New York',
      applies: (product) => product.type === 'Online Course',
      modify: (rate) => rate * 0.5
    }
  ],
  'UK-': [
    {
      name: 'Zero-rated Publications',
      description: 'Certain digital publications are zero-rated in the UK',
      applies: (product) => product.type === 'E-book',
      modify: (rate) => 0
    }
  ]
};

// Calculate tax for a single product with rules
export const calculateTaxWithRules = (product: Product, location: CustomerLocation): number => {
  const locationKey = `${location.country}-${location.state || ''}`;
  let taxRate = taxRates[locationKey]?.rate || 0;
  
  // Check if any rules apply
  const rules = taxRules[locationKey] || [];
  let exemptionApplied = false;
  let exemptionName = '';
  
  for (const rule of rules) {
    if (rule.applies(product)) {
      taxRate = rule.modify(taxRate);
      exemptionApplied = true;
      exemptionName = rule.name;
      break;
    }
  }
  
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const quantity = typeof product.quantity === 'string' ? parseInt(product.quantity) : product.quantity;
  
  return (price * quantity) * (taxRate / 100);
};

// Determine if a business has nexus in a jurisdiction
export const determineNexus = (businessLocation: string, customerLocation: CustomerLocation): boolean => {
  // Simple implementation - in a real app this would be more complex
  if (businessLocation.startsWith(customerLocation.country)) {
    return true;
  }
  
  // Special case for EU countries
  if (businessLocation.startsWith('EU-') && customerLocation.country.startsWith('EU-')) {
    return true;
  }
  
  return false;
};

// Calculate tax for multiple products
export const calculateTax = (products: Product[], location: CustomerLocation) => {
  // Calculate subtotal
  let subtotal = 0;
  let totalTaxAmount = 0;
  
  for (const product of products) {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const quantity = typeof product.quantity === 'string' ? parseInt(product.quantity) : product.quantity;
    
    subtotal += price * quantity;
    
    // Calculate tax with rules
    const taxAmount = calculateTaxWithRules(product, location);
    totalTaxAmount += taxAmount;
  }
  
  const total = subtotal + totalTaxAmount;
  
  // Get jurisdiction name
  const locationKey = `${location.country}-${location.state || ''}`;
  const jurisdictionName = taxRates[locationKey]?.name || 'Unknown';
  
  return {
    subtotal: subtotal.toFixed(2),
    taxRate: taxRates[locationKey]?.rate || 0,
    taxAmount: totalTaxAmount.toFixed(2),
    total: total.toFixed(2),
    jurisdiction: jurisdictionName,
  };
};

// Calculate VAT for EU transactions
export const calculateVAT = (product: Product, customerLocation: CustomerLocation): number => {
  // VAT rates for different EU countries
  const vatRates: {[key: string]: number} = {
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