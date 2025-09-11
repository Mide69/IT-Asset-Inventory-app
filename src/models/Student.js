const db = require('../config/database');

class Student {
  static async create(data) {
    const { name, email, age, course, level, sex, department, picture } = data;
    const result = await db.query(
      'INSERT INTO students (name, email, age, course, level, sex, department, picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email, age, course, level, sex, department, picture]
    );
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (filters.search) {
      query += ` AND (name ILIKE $${++paramCount} OR email ILIKE $${paramCount} OR course ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }
    if (filters.level) {
      query += ` AND level = $${++paramCount}`;
      params.push(filters.level);
    }
    if (filters.sex) {
      query += ` AND sex = $${++paramCount}`;
      params.push(filters.sex);
    }
    if (filters.department) {
      query += ` AND department = $${++paramCount}`;
      params.push(filters.department);
    }
    
    const result = await db.query(query + ' ORDER BY created_at DESC', params);
    return result.rows;
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const { name, email, age, course, level, sex, department, picture } = data;
    const result = await db.query(
      'UPDATE students SET name = $1, email = $2, age = $3, course = $4, level = $5, sex = $6, department = $7, picture = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, email, age, course, level, sex, department, picture, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query('DELETE FROM students WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

module.exports = Student;