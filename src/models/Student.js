const db = require('../config/database');

class Student {
  static async create(studentData) {
    const { name, email, age, course } = studentData;
    const result = await db.run(
      'INSERT INTO students (name, email, age, course) VALUES (?, ?, ?, ?)',
      [name, email, age, course]
    );
    return this.findById(result.id);
  }

  static async findAll() {
    return await db.query('SELECT * FROM students ORDER BY created_at DESC');
  }

  static async findById(id) {
    const students = await db.query('SELECT * FROM students WHERE id = ?', [id]);
    return students[0] || null;
  }

  static async update(id, studentData) {
    const { name, email, age, course } = studentData;
    await db.run(
      'UPDATE students SET name = ?, email = ?, age = ?, course = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, email, age, course, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    const result = await db.run('DELETE FROM students WHERE id = ?', [id]);
    return result.changes > 0;
  }
}

module.exports = Student;