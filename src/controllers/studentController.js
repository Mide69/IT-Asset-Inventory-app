const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const studentData = { ...req.body, picture: req.file ? `/uploads/${req.file.filename}` : null };
    const student = await Student.create(studentData);
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    const message = error.message.includes('unique') ? 'Email already exists' : 'Failed to create student';
    res.status(error.message.includes('unique') ? 409 : 500).json({ success: false, message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll(req.query);
    res.json({ success: true, data: students, count: students.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch students' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch student' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    
    const studentData = { ...req.body, picture: req.file ? `/uploads/${req.file.filename}` : student.picture };
    const updatedStudent = await Student.update(req.params.id, studentData);
    res.json({ success: true, data: updatedStudent });
  } catch (error) {
    const message = error.message.includes('unique') ? 'Email already exists' : 'Failed to update student';
    res.status(error.message.includes('unique') ? 409 : 500).json({ success: false, message });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete student' });
  }
};

module.exports = { createStudent, getAllStudents, getStudentById, updateStudent, deleteStudent };