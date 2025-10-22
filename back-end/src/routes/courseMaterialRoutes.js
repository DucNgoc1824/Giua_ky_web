const express = require('express');
const router = express.Router();
const courseMaterialController = require('../controllers/courseMaterialController');
const {
  verifyToken,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ API DƯỚI ĐÂY ===
// Yêu cầu phải đăng nhập (có token)
router.use(verifyToken);

// 1. API Thêm tài liệu (POST /api/materials)
// Yêu cầu là Giảng viên HOẶC Admin
router.post('/', isLecturerOrAdmin, courseMaterialController.addMaterial);

// 2. API Lấy tài liệu của 1 môn (GET /api/materials/subject/:subjectId)
// (Ai đăng nhập cũng xem được, kể cả Sinh viên)
router.get(
  '/subject/:subjectId',
  courseMaterialController.getMaterialsForSubject
);

// 3. API Xóa tài liệu (DELETE /api/materials/:id)
// Yêu cầu là Giảng viên HOẶC Admin
router.delete('/:id', isLecturerOrAdmin, courseMaterialController.deleteMaterial);

module.exports = router;