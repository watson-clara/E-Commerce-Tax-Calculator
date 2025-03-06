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
      applies: (product: any) => ['E-book', 'Digital Media'].includes(product.type),
      modify: (rate: number) => 0 // Exempt
    },
    {
      name: 'SaaS Rule',
      description: 'SaaS products are taxable in California',
      applies: (product: any) => 
        product.type === 'Digital Software' && 
        product.name.toLowerCase().includes('saas'),
      modify: (rate: number) => rate // Standard rate
    }
  ],
  'US-NY': [
    {
      name: 'Information Services',
      description: 'Information services are taxable in New York',
      applies: (product: any) => 
        product.type === 'Online Course' || 
        product.type === 'Subscription Service',
      modify: (rate: number) => rate
    }
  ],
  'UK-': [
    {
      name: 'Zero-rated Publications',
      description: 'Certain digital publications are zero-rated in the UK',
      applies: (product: any) => 
        product.type === 'E-book' && 
        !product.name.toLowerCase().includes('game'),
      modify: (rate: number) => 0
    }
  ]
};

export interface Product {
  id?: number;
  name: string;
  type: string;
  price: number | string;
  quantity: number;
}

export interface CustomerLocation {
  country: string;
  state: string;
  vatId?: string;
}

export interface TaxCalculationResult {
  subtotal: string;
  taxRate: number;
  taxAmount: string;
  total: string;
  jurisdiction: string;
  products: Product[];
  appliedRules?: {
    name: string;
    description: string;
    productId?: number;
    productName?: string;
  }[];
  exemptionApplied?: boolean;
  exemptionName?: string;
}

// Calculate tax for a product with rules applied
export const calculateTaxWithRules = (
  product: Product, 
  location: CustomerLocation
): { 
  taxRate: number; 
  taxAmount: number; 
  exemptionApplied?: boolean; 
  exemptionName?: string; 
} => {
  const locationKey = `${location.country}-${location.state}`;
  let taxRate = taxRates[locationKey]?.rate || 0;
  
  // Check if any rules apply
  const rules = taxRules[locationKey] || [];
  let exemptionApplied = false;
  let exemptionName = '';
  
  for (const rule of rules) {
    if (rule.applies(product)) {
      const originalRate = taxRate;
      taxRate = rule.modify(taxRate);
      
      // If rate was reduced to 0, it's an exemption
      if (originalRate > 0 && taxRate === 0) {
        exemptionApplied = true;
        exemptionName = rule.name;
      }
      
      break; // Apply first matching rule
    }
  }
  
  // Calculate tax amount
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const subtotal = price * product.quantity;
  const taxAmount = subtotal * (taxRate / 100);
  
  return { 
    taxRate, 
    taxAmount, 
    exemptionApplied, 
    exemptionName 
  };
};

// Calculate tax for multiple products
export const calculateTax = (
  products: Product[], 
  location: CustomerLocation
): TaxCalculationResult => {
  // Validate inputs
  if (!products.length) {
    throw new Error('No products provided');
  }
  
  if (!location.country) {
    throw new Error('Customer location is required');
  }
  
  // Calculate subtotal and tax for each product
  let subtotal = 0;
  let totalTaxAmount = 0;
  const appliedRules: any[] = [];
  
  products.forEach(product => {
    const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
    const productSubtotal = price * product.quantity;
    subtotal += productSubtotal;
    
    const { taxRate, taxAmount, exemptionApplied, exemptionName } = calculateTaxWithRules(product, location);
    totalTaxAmount += taxAmount;
    
    if (exemptionApplied) {
      appliedRules.push({
        name: exemptionName,
        description: `Tax exemption applied to ${product.name}`,
        productId: product.id,
        productName: product.name
      });
    }
  });
  
  // Calculate total
  const total = subtotal + totalTaxAmount;
  
  // Get jurisdiction name
  const locationKey = `${location.country}-${location.state}`;
  const jurisdictionName = taxRates[locationKey]?.name || 'Unknown';
  
  return {
    subtotal: subtotal.toFixed(2),
    taxRate: taxRates[locationKey]?.rate || 0,
    taxAmount: totalTaxAmount.toFixed(2),
    total: total.toFixed(2),
    jurisdiction: jurisdictionName,
    products: [...products],
    appliedRules: appliedRules.length ? appliedRules : undefined
  };
};

// Determine if a company has nexus in a jurisdiction
export const determineNexus = (
  company: { 
    salesByState: Record<string, { revenue: number; transactions: number }> 
  }, 
  jurisdiction: string
): boolean => {
  // Economic nexus thresholds by state
  const thresholds: Record<string, { revenue: number; transactions: number }> = {
    'US-CA': { revenue: 500000, transactions: 200 },
    'US-NY': { revenue: 500000, transactions: 100 },
    'US-TX': { revenue: 500000, transactions: 0 },
    'US-FL': { revenue: 100000, transactions: 200 }
  };
  
  // Check if company exceeds thresholds
  const stateData = company.salesByState[jurisdiction] || { revenue: 0, transactions: 0 };
  const threshold = thresholds[jurisdiction];
  
  if (!threshold) return false;
  
  return stateData.revenue >= threshold.revenue || 
         (threshold.transactions > 0 && stateData.transactions >= threshold.transactions);
};

// Calculate VAT for international sales
export const calculateVAT = (
  product: Product, 
  customerLocation: { 
    country: string; 
    vatId?: string 
  }
): number => {
  const vatRates: Record<string, number> = {
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