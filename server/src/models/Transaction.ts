export interface Transaction {
  id?: number;
  transaction_date: Date;
  customer_id?: string;
  customer_location: {
    country: string;
    state_province?: string;
    city?: string;
    postal_code?: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    product_type: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
  subtotal: number;
  tax_amount: number;
  total: number;
  tax_details?: any;
  created_at?: Date;
  updated_at?: Date;
} 