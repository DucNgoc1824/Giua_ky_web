const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const {
  verifyToken,
  isLecturerOrAdmin,
  isStudent,
} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', isLecturerOrAdmin, gradeController.upsertGrade);
router.get('/my-grades', isStudent, gradeController.getMyGrades);
router.get(
  '/subject/:subjectId/semester/:semester',
  isLecturerOrAdmin,
  gradeController.getGradesBySubjectAndSemester
);
router.get(
  '/subject/:subjectId',
  isLecturerOrAdmin,
  gradeController.getGradesBySubject
);
router.get(
  '/student/:studentId',
  gradeController.getGradesForStudent  // Bỏ isLecturerOrAdmin - cho phép sinh viên xem điểm của mình
);

module.exports = router;