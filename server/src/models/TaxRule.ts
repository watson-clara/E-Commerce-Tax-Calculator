export interface TaxRule {
  id?: number;
  jurisdiction_id: number;
  rule_name: string;
  rule_description?: string;
  rule_logic: any;
  created_at?: Date;
  updated_at?: Date;
} 