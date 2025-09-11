const db = require('../config/database');

class Student {
  static async create(studentData) {
    const { name, email, age, course, level, sex, department, picture } = studentData;
    const result = await db.query(
      'INSERT INTO students (name, email, age, course, level, sex, department, picture) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email, age, course, level, sex, department, picture]
    );
    return result[0];
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    let paramCount = 0;
    
    if (filters.search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount} OR course ILIKE $${paramCount})`;
      params.push(`%${filters.search}%`);
    }
    
    if (filters.level) {
      paramCount++;
      query += ` AND level = $${paramCount}`;
      params.push(filters.level);
    }
    
    if (filters.sex) {
      paramCount++;
      query += ` AND sex = $${paramCount}`;
      params.push(filters.sex);
    }
    
    if (filters.department) {
      paramCount++;
      query += ` AND department = $${paramCount}`;
      params.push(filters.department);
    }
    
    query += ' ORDER BY created_at DESC';
    return await db.query(query, params);
  }

  static async findById(id) {
    const students = await db.query('SELECT * FROM students WHERE id = $1', [id]);
    return students[0] || null;
  }

  static async update(id, studentData) {
    const { name, email, age, course, level, sex, department, picture } = studentData;
    const result = await db.query(
      'UPDATE students SET name = $1, email = $2, age = $3, course = $4, level = $5, sex = $6, department = $7, picture = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [name, email, age, course, level, sex, department, picture, id]
    );
    return result[0];
  }

  static async delete(id) {
    const result = await db.run('DELETE FROM students WHERE id = $1', [id]);
    return result.changes > 0;
  }
}

module.exports = Student;