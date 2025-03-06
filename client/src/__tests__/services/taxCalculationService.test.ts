import { 
  calculateTax, 
  calculateTaxWithRules, 
  determineNexus,
  calculateVAT,
  Product,
  CustomerLocation
} from '../../services/taxCalculationService';

describe('Tax Calculation Service', () => {
  // Basic tax calculation tests
  describe('calculateTax', () => {
    test('calculates tax correctly for a single product', () => {
      const products: Product[] = [
        { name: 'Software License', type: 'Digital Software', price: 100, quantity: 1 }
      ];
      const location: CustomerLocation = { country: 'US', state: 'CA' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('100.00');
      expect(result.taxRate).toBe(8.5);
      expect(result.taxAmount).toBe('8.50');
      expect(result.total).toBe('108.50');
      expect(result.jurisdiction).toBe('California');
    });
    
    test('calculates tax correctly for multiple products', () => {
      const products: Product[] = [
        { name: 'Software License', type: 'Digital Software', price: 100, quantity: 1 },
        { name: 'Support Plan', type: 'Subscription Service', price: 50, quantity: 2 }
      ];
      const location: CustomerLocation = { country: 'US', state: 'NY' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('200.00'); // 100 + (50 * 2)
      expect(result.taxRate).toBe(8.875);
      expect(result.taxAmount).toBe('17.75'); // 200 * 0.08875
      expect(result.total).toBe('217.75');
      expect(result.jurisdiction).toBe('New York');
    });
    
    test('handles string prices correctly', () => {
      const products: Product[] = [
        { name: 'Software License', type: 'Digital Software', price: '99.99', quantity: 1 }
      ];
      const location: CustomerLocation = { country: 'US', state: 'TX' };
      
      const result = calculateTax(products, location);
      
      expect(result.subtotal).toBe('99.99');
      expect(result.taxAmount).toBe('6.25'); // 99.99 * 0.0625
      expect(result.total).toBe('106.24');
    });
    
    test('throws error when no products are provided', () => {
      expect(() => {
        calculateTax([], { country: 'US', state: 'CA' });
      }).toThrow('No products provided');
    });
    
    test('throws error when location is invalid', () => {
      expect(() => {
        calculateTax([{ name: 'Test', type: 'Digital', price: 10, quantity: 1 }], { country: '', state: '' });
      }).toThrow('Customer location is required');
    });
  });
  
  // Tax rules and exemptions tests
  describe('calculateTaxWithRules', () => {
    test('applies California digital product exemption correctly', () => {
      const product: Product = { 
        name: 'Programming E-book', 
        type: 'E-book', 
        price: 29.99, 
        quantity: 1 
      };
      const location: CustomerLocation = { country: 'US', state: 'CA' };
      
      const result = calculateTaxWithRules(product, location);
      
      expect(result.taxRate).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.exemptionApplied).toBe(true);
      expect(result.exemptionName).toBe('Digital Products Exemption');
    });
    
    test('applies SaaS rule in California correctly', () => {
      const product: Product = { 
        name: 'SaaS Platform License', 
        type: 'Digital Software', 
        price: 299.99, 
        quantity: 1 
      };
      const location: CustomerLocation = { country: 'US', state: 'CA' };
      
      const result = calculateTaxWithRules(product, location);
      
      expect(result.taxRate).toBe(8.5);
      expect(result.taxAmount).toBe(25.49915); // 299.99 * 0.085
      expect(result.exemptionApplied).toBeUndefined();
    });
    
    test('applies UK zero-rated publications rule correctly', () => {
      const product: Product = { 
        name: 'Financial E-book', 
        type: 'E-book', 
        price: 19.99, 
        quantity: 1 
      };
      const location: CustomerLocation = { country: 'UK', state: '' };
      
      const result = calculateTaxWithRules(product, location);
      
      expect(result.taxRate).toBe(0);
      expect(result.taxAmount).toBe(0);
      expect(result.exemptionApplied).toBe(true);
      expect(result.exemptionName).toBe('Zero-rated Publications');
    });
    
    test('does not apply UK zero-rated rule to game e-books', () => {
      const product: Product = { 
        name: 'Game Strategy E-book', 
        type: 'E-book', 
        price: 14.99, 
        quantity: 1 
      };
      const location: CustomerLocation = { country: 'UK', state: '' };
      
      const result = calculateTaxWithRules(product, location);
      
      expect(result.taxRate).toBe(20);
      expect(result.taxAmount).toBe(2.998); // 14.99 * 0.2
      expect(result.exemptionApplied).toBeUndefined();
    });
  });
  
  // Nexus determination tests
  describe('determineNexus', () => {
    test('correctly determines nexus when revenue threshold is exceeded', () => {
      const company = {
        salesByState: {
          'US-CA': { revenue: 600000, transactions: 150 }
        }
      };
      
      expect(determineNexus(company, 'US-CA')).toBe(true);
    });
    
    test('correctly determines nexus when transaction threshold is exceeded', () => {
      const company = {
        salesByState: {
          'US-NY': { revenue: 300000, transactions: 150 }
        }
      };
      
      expect(determineNexus(company, 'US-NY')).toBe(true);
    });
    
    test('correctly determines no nexus when both thresholds are not met', () => {
      const company = {
        salesByState: {
          'US-FL': { revenue: 90000, transactions: 180 }
        }
      };
      
      expect(determineNexus(company, 'US-FL')).toBe(false);
    });
    
    test('correctly handles jurisdiction with no threshold data', () => {
      const company = {
        salesByState: {
          'US-CA': { revenue: 600000, transactions: 150 }
        }
      };
      
      expect(determineNexus(company, 'US-OR')).toBe(false);
    });
  });
  
  // VAT calculation tests
  describe('calculateVAT', () => {
    test('calculates standard VAT rate for B2C customers', () => {
      const product: Product = { 
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
      const product: Product = { 
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
      const product: Product = { 
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
      const product: Product = { 
        name: 'Software License', 
        type: 'Digital Software', 
        price: 100, 
        quantity: 1 
      };
      
      expect(calculateVAT(product, { country: 'AU' })).toBe(0);
    });
  });
}); 