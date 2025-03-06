export interface TaxRate {
  id?: number;
  jurisdiction_id: number;
  rate: number;
  product_type: string;
  effective_date: Date;
  end_date?: Date;
  created_at?: Date;
  updated_at?: Date;
} 