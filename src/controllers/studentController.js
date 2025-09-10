const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const studentData = {
      ...req.body,
      picture: req.file ? `/uploads/${req.file.filename}` : null
    };
    const student = await Student.create(studentData);
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

const getAllStudents = async (req, res) => {
  try {
    const filters = {
      search: req.query.search,
      level: req.query.level,
      sex: req.query.sex,
      department: req.query.department
    };
    const students = await Student.findAll(filters);
    res.json({
      success: true,
      data: students,
      count: students.length,
      filters: filters
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch students',
      error: error.message
    });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch student',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const studentData = {
      ...req.body,
      picture: req.file ? `/uploads/${req.file.filename}` : student.picture
    };
    const updatedStudent = await Student.update(req.params.id, studentData);
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};