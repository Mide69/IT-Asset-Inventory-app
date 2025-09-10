const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { validateStudent } = require('../middleware/validation');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

router.post('/', upload.single('picture'), validateStudent, createStudent);
router.get('/', getAllStudents);
router.get('/:id', getStudentById);
router.put('/:id', upload.single('picture'), validateStudent, updateStudent);
router.delete('/:id', deleteStudent);

module.exports = router;