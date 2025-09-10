const db = require('../config/database');

class Student {
  static async create(studentData) {
    const { name, email, age, course, level, sex, department, picture } = studentData;
    const result = await db.run(
      'INSERT INTO students (name, email, age, course, level, sex, department, picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, email, age, course, level, sex, department, picture]
    );
    return this.findById(result.id);
  }

  static async findAll(filters = {}) {
    let query = 'SELECT * FROM students WHERE 1=1';
    const params = [];
    
    if (filters.search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR course LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    
    if (filters.level) {
      query += ' AND level = ?';
      params.push(filters.level);
    }
    
    if (filters.sex) {
      query += ' AND sex = ?';
      params.push(filters.sex);
    }
    
    if (filters.department) {
      query += ' AND department = ?';
      params.push(filters.department);
    }
    
    query += ' ORDER BY created_at DESC';
    return await db.query(query, params);
  }

  static async findById(id) {
    const students = await db.query('SELECT * FROM students WHERE id = ?', [id]);
    return students[0] || null;
  }

  static async update(id, studentData) {
    const { name, email, age, course, level, sex, department, picture } = studentData;
    await db.run(
      'UPDATE students SET name = ?, email = ?, age = ?, course = ?, level = ?, sex = ?, department = ?, picture = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, age, course, level, sex, department, picture, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const result = await db.run('DELETE FROM students WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = Student;