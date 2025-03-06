import db from '../db';

interface Product {
  product_id: string;
  product_name: string;
  product_type: string;
  quantity: number;
  unit_price: number;
}

interface CustomerLocation {
  country: string;
  state_province?: string;
  city?: string;
  postal_code?: string;
}

interface TaxCalculationResult {
  subtotal: number;
  tax_amount: number;
  total: number;
  tax_details: {
    jurisdiction: string;
    rate: number;
    tax_amount: number;
  }[];
}

export async function calculateTax(
  products: Product[],
  customerLocation: CustomerLocation
): Promise<TaxCalculationResult> {
  try {
    // Calculate subtotal
    const subtotal = products.reduce(
      (sum, product) => sum + product.unit_price * product.quantity,
      0
    );
    
    // Find applicable jurisdictions based on customer location
    const jurisdictionsResult = await db.query(
      `SELECT * FROM jurisdictions 
       WHERE country = $1 
       AND (state_province = $2 OR state_province IS NULL)`,
      [customerLocation.country, customerLocation.state_province]
    );
    
    const jurisdictions = jurisdictionsResult.rows;
    
    // Initialize tax details
    const taxDetails: { jurisdiction: string; rate: number; tax_amount: number }[] = [];
    let totalTaxAmount = 0;
    
    // Calculate tax for each product and jurisdiction
    for (const product of products) {
      for (const jurisdiction of jurisdictions) {
        // Get applicable tax rate for this product type and jurisdiction
        const taxRateResult = await db.query(
          `SELECT * FROM tax_rates 
           WHERE jurisdiction_id = $1 
           AND product_type = $2 
           AND effective_date <= CURRENT_DATE 
           AND (end_date IS NULL OR end_date >= CURRENT_DATE) 
           ORDER BY effective_date DESC 
           LIMIT 1`,
          [jurisdiction.id, product.product_type]
        );
        
        if (taxRateResult.rows.length > 0) {
          const taxRate = taxRateResult.rows[0];
          
          // Check if there are any special tax rules
          const taxRulesResult = await db.query(
            `SELECT * FROM tax_rules 
             WHERE jurisdiction_id = $1`,
            [jurisdiction.id]
          );
          
          const taxRules = taxRulesResult.rows;
          let shouldApplyTax = true;
          
          // Apply tax rules logic (simplified for now)
          for (const rule of taxRules) {
            // This is a simplified example - in a real app, you'd have more complex rule processing
            if (rule.rule_logic.exemptProductTypes && 
                rule.rule_logic.exemptProductTypes.includes(product.product_type)) {
              shouldApplyTax = false;
              break;
            }
          }
          
          if (shouldApplyTax) {
            const productSubtotal = product.unit_price * product.quantity;
            const productTaxAmount = productSubtotal * (taxRate.rate / 100);
            
            // Add to tax details
            const existingDetailIndex = taxDetails.findIndex(
              detail => detail.jurisdiction === jurisdiction.name
            );
            
            if (existingDetailIndex >= 0) {
              taxDetails[existingDetailIndex].tax_amount += productTaxAmount;
            } else {
              taxDetails.push({
                jurisdiction: jurisdiction.name,
                rate: taxRate.rate,
                tax_amount: productTaxAmount
              });
            }
            
            totalTaxAmount += productTaxAmount;
          }
        }
      }
    }
    
    // Round to 2 decimal places
    totalTaxAmount = Math.round(totalTaxAmount * 100) / 100;
    const total = subtotal + totalTaxAmount;
    
    // Format tax details
    taxDetails.forEach(detail => {
      detail.tax_amount = Math.round(detail.tax_amount * 100) / 100;
    });
    
    return {
      subtotal,
      tax_amount: totalTaxAmount,
      total,
      tax_details: taxDetails
    };
  } catch (error) {
    console.error('Error calculating tax:', error);
    throw new Error('Failed to calculate tax');
  }
} 