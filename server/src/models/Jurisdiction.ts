export interface Jurisdiction {
  id?: number;
  name: string;
  code: string;
  country: string;
  state_province?: string;
  created_at?: Date;
  updated_at?: Date;
} 