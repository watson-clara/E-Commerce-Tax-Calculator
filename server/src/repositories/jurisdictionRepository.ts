import db from '../db';

// Get all jurisdictions
export const getAllJurisdictions = async () => {
  const result = await db.query('SELECT * FROM jurisdictions ORDER BY name');
  return result.rows;
};

// Get jurisdiction by ID
export const getJurisdictionById = async (id: number) => {
  const result = await db.query('SELECT * FROM jurisdictions WHERE id = $1', [id]);
  return result.rows[0];
};

// Create new jurisdiction
export const createJurisdiction = async (jurisdiction: any) => {
  const { name, code, country, state_province, local_area, tax_authority } = jurisdiction;
  
  const result = await db.query(
    `INSERT INTO jurisdictions 
     (name, code, country, state_province, local_area, tax_authority) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [name, code, country, state_province || null, local_area || null, tax_authority || null]
  );
  
  return result.rows[0];
};

// Update jurisdiction
export const updateJurisdiction = async (id: number, jurisdiction: any) => {
  const { name, code, country, state_province, local_area, tax_authority } = jurisdiction;
  
  const result = await db.query(
    `UPDATE jurisdictions 
     SET name = $1, code = $2, country = $3, state_province = $4, 
         local_area = $5, tax_authority = $6, updated_at = CURRENT_TIMESTAMP
     WHERE id = $7
     RETURNING *`,
    [name, code, country, state_province || null, local_area || null, tax_authority || null, id]
  );
  
  return result.rows[0];
};

// Delete jurisdiction
export const deleteJurisdiction = async (id: number) => {
  const result = await db.query('DELETE FROM jurisdictions WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Find jurisdiction by location
export const findJurisdictionByLocation = async (country: string, state: string) => {
  const result = await db.query(
    'SELECT * FROM jurisdictions WHERE country = $1 AND state_province = $2',
    [country, state]
  );
  return result.rows[0];
}; 