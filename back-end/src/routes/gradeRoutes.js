const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const {
  verifyToken,
  isLecturerOrAdmin,
  isStudent,
} = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ API DƯỚI ĐÂY ===
// Yêu cầu phải đăng nhập (có token)
router.use(verifyToken);

// 1. API Nhập điểm (POST /api/grades)
// Yêu cầu là Giảng viên HOẶC Admin
router.post('/', isLecturerOrAdmin, gradeController.upsertGrade);

// 2. API Sinh viên tự xem điểm (GET /api/grades/my-grades)
// Yêu cầu là Sinh viên
router.get('/my-grades', isStudent, gradeController.getMyGrades);

// 3. API Giảng viên/Admin xem điểm của SV khác (GET /api/grades/student/:studentId)
// Yêu cầu là Giảng viên HOẶC Admin
router.get(
  '/student/:studentId',
  isLecturerOrAdmin,
  gradeController.getGradesForStudent
);

module.exports = router;