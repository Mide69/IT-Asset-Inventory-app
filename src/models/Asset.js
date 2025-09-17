const db = require('../config/database');

class Asset {
  static async create(data) {
    const { asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes, image } = data;
    const result = await db.query(
      'INSERT INTO assets (asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes, image]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM assets WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (filters.search) {
      query += ` AND (asset_tag ILIKE $${++paramCount} OR name ILIKE $${paramCount} OR brand ILIKE $${paramCount} OR model ILIKE $${paramCount} OR assigned_to ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }
    if (filters.category) {
      query += ` AND category = $${++paramCount}`;
      params.push(filters.category);
    }
    if (filters.status) {
      query += ` AND status = $${++paramCount}`;
      params.push(filters.status);
    }
    if (filters.department) {
      query += ` AND department = $${++paramCount}`;
      params.push(filters.department);
    }
    if (filters.location) {
      query += ` AND location ILIKE $${++paramCount}`;
      params.push(`%${filters.location}%`);
    }
    
    const result = await db.query(query + ' ORDER BY created_at DESC', params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM assets WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes, image } = data;
    const result = await db.query(
      'UPDATE assets SET asset_tag = $1, name = $2, category = $3, brand = $4, model = $5, serial_number = $6, status = $7, location = $8, department = $9, assigned_to = $10, purchase_date = $11, warranty_expiry = $12, cost = $13, notes = $14, image = $15, updated_at = CURRENT_TIMESTAMP WHERE id = $16 RETURNING *',
      [asset_tag, name, category, brand, model, serial_number, status, location, department, assigned_to, purchase_date, warranty_expiry, cost, notes, image, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM assets WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Asset;