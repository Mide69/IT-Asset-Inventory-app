const express = require('express');
const router = express.Router();
const { validateStudent } = require('../middleware/validation');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

router.post('/', validateStudent, createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', validateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;