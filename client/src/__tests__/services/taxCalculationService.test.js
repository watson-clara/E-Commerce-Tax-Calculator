import { 
  calculateTax, 
  calculateTaxWithRules, 
  determineNexus,
  calculateVAT
} from '../../services/taxCalculationService';

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
    
    // Add more tests as needed...
  });
  
  // More test groups...
}); 