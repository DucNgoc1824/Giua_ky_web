const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const {
  verifyToken,
  isAdmin,
  isLecturerOrAdmin, // Import middleware mới
} = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ ROUTE BÊN DƯỚI ===
router.use(verifyToken);

// === PHÂN QUYỀN CỤ THỂ ===

/*
 * GET (Xem): Cho phép Giảng viên và Admin
 */
// GET /api/subjects (Lấy tất cả môn học)
router.get('/', isLecturerOrAdmin, subjectController.getAllSubjects);

// GET /api/subjects/:id (Lấy 1 môn học)
router.get('/:id', isLecturerOrAdmin, subjectController.getSubjectById);


/*
 * POST, PUT, DELETE (Chỉnh sửa): Chỉ Admin
 */
// POST /api/subjects (Tạo môn học)
router.post('/', isAdmin, subjectController.createSubject);

// PUT /api/subjects/:id (Cập nhật môn học)
router.put('/:id', isAdmin, subjectController.updateSubject);

// 5. DELETE /api/subjects/:id (Xóa môn học)
router.delete('/:id', isAdmin, subjectController.deleteSubject);

module.exports = router;