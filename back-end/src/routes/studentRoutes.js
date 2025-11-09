const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  verifyToken,
  isAdmin,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/search/name', isLecturerOrAdmin, studentController.searchStudents);
router.get('/user/:userId', studentController.getStudentByUserId); // API mới cho Android
router.get('/', isLecturerOrAdmin, studentController.getAllStudents);
router.get('/:id', isLecturerOrAdmin, studentController.getStudentById);
router.post('/', isAdmin, studentController.createStudent);
router.put('/:id', isAdmin, studentController.updateStudent);
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;