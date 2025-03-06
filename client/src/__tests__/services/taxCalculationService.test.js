import { 
  calculateTax, 
  calculateTaxWithRules, 
  determineNexus,
  calculateVAT
} from '../../services/TaxCalculation/taxCalculationService';

describe('Tax Calculation Service', () => {
  // Basic tax calculation tests
  describe('calculateTax', () => {
    test('calculates tax correctly for a single product', () => {
      const products = [
        { name: 'Software License', type: 'Digital Software', price: 100, quantity: 1 }
      ];
      const location = { country: 'US', state: 'CA' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('100.00');
      expect(result.taxRate).toBe(8.5);
      expect(result.taxAmount).toBe('8.50');
      expect(result.total).toBe('108.50');
      expect(result.jurisdiction).toBe('California');
    });
    
    test('calculates tax correctly for multiple products', () => {
      const products = [
        { name: 'Software License', type: 'Digital Software', price: 100, quantity: 1 },
        { name: 'Support Plan', type: 'Subscription Service', price: 50, quantity: 2 }
      ];
      const location = { country: 'US', state: 'NY' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('200.00'); // 100 + (50 * 2)
      expect(result.taxRate).toBe(8.875);
      expect(result.taxAmount).toBe('17.75'); // 200 * 0.08875
      expect(result.total).toBe('217.75');
      expect(result.jurisdiction).toBe('New York');
    });
    
    test('handles string prices correctly', () => {
      const products = [
        { name: 'Software License', type: 'Digital Software', price: '99.99', quantity: 1 }
      ];
      const location = { country: 'US', state: 'TX' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('99.99');
      expect(result.taxRate).toBe(6.25);
      expect(result.taxAmount).toBe('6.25'); // 99.99 * 0.0625
      expect(result.total).toBe('106.24');
      expect(result.jurisdiction).toBe('Texas');
    });
    
    test('handles string quantities correctly', () => {
      const products = [
        { name: 'E-book', type: 'E-book', price: 10, quantity: '3' }
      ];
      const location = { country: 'US', state: 'FL' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('30.00'); // 10 * 3
      expect(result.taxRate).toBe(6.0);
      expect(result.taxAmount).toBe('1.80'); // 30 * 0.06
      expect(result.total).toBe('31.80');
      expect(result.jurisdiction).toBe('Florida');
    });
    
    test('returns 0 tax for unknown jurisdictions', () => {
      const products = [
        { name: 'Software License', type: 'Digital Software', price: 100, quantity: 1 }
      ];
      const location = { country: 'AU', state: 'NSW' }; // Australia not in our tax rates
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('100.00');
      expect(result.taxRate).toBe(0);
      expect(result.taxAmount).toBe('0.00');
      expect(result.total).toBe('100.00');
      expect(result.jurisdiction).toBe('Unknown');
    });
  });
  
  // Tax rules tests
  describe('calculateTaxWithRules', () => {
    test('applies tax exemption rules correctly', () => {
      const product = { 
        name: 'Programming E-book', 
        type: 'E-book', 
        price: 20, 
        quantity: 1 
      };
      const location = { country: 'US', state: 'CA' };
      
      const taxAmount = calculateTaxWithRules(product, location);
      
      // E-books are exempt in California according to our rules
      expect(taxAmount).toBe(0);
    });
    
    test('applies standard tax when no exemption applies', () => {
      const product = { 
        name: 'SaaS Platform', 
        type: 'Digital Software', 
        price: 100, 
        quantity: 1 
      };
      const location = { country: 'US', state: 'CA' };
      
      const taxAmount = calculateTaxWithRules(product, location);
      
      // Digital Software is taxable in California
      expect(taxAmount).toBe(8.5); // 100 * 0.085
    });
    
    test('applies special rules based on product name', () => {
      const product = { 
        name: 'Enterprise SaaS Platform', 
        type: 'Digital Software', 
        price: 1000, 
        quantity: 1 
      };
      const location = { country: 'US', state: 'CA' };
      
      const taxAmount = calculateTaxWithRules(product, location);
      
      // SaaS products are specifically taxable in California per our rules
      expect(taxAmount).toBe(85); // 1000 * 0.085
    });
  });
  
  // Nexus determination tests
  describe('determineNexus', () => {
    test('correctly identifies nexus when thresholds are exceeded', () => {
      const company = {
        salesByState: {
          'US-CA': { revenue: 600000, transactions: 250 }
        }
      };
      
      expect(determineNexus(company, 'US-CA')).toBe(true);
    });
    
    test('correctly identifies no nexus when thresholds are not met', () => {
      const company = {
        salesByState: {
          'US-TX': { revenue: 400000, transactions: 150 }
        }
      };
      
      expect(determineNexus(company, 'US-TX')).toBe(false);
    });
    
    test('handles missing state data', () => {
      const company = {
        salesByState: {
          'US-CA': { revenue: 600000, transactions: 250 }
        }
      };
      
      expect(determineNexus(company, 'US-NY')).toBe(false);
    });
  });
  
  // VAT calculation tests
  describe('calculateVAT', () => {
    test('calculates correct VAT rates for different countries', () => {
      const product = { 
        name: 'Software License', 
        type: 'Digital Software', 
        price: 100, 
        quantity: 1 
      };
      
      expect(calculateVAT(product, { country: 'UK' })).toBe(20);
      expect(calculateVAT(product, { country: 'EU-DE' })).toBe(19);
      expect(calculateVAT(product, { country: 'EU-FR' })).toBe(20);
    });
    
    test('applies reverse charge for B2B customers in EU', () => {
      const product = { 
        name: 'Enterprise License', 
        type: 'Digital Software', 
        price: 1000, 
        quantity: 1 
      };
      
      expect(calculateVAT(product, { 
        country: 'EU-DE', 
        vatId: 'DE123456789' 
      })).toBe(0);
    });
    
    test('does not apply reverse charge for B2B customers outside EU', () => {
      const product = { 
        name: 'Enterprise License', 
        type: 'Digital Software', 
        price: 1000, 
        quantity: 1 
      };
      
      expect(calculateVAT(product, { 
        country: 'UK', 
        vatId: 'GB123456789' 
      })).toBe(20);
    });
    
    test('returns 0 for countries without defined VAT rates', () => {
      const product = { 
        name: 'Software License', 
        type: 'Digital Software', 
        price: 100, 
        quantity: 1 
      };
      
      expect(calculateVAT(product, { country: 'AU' })).toBe(0);
    });
  });
}); 