const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  verifyToken,
  isAdmin,
  isLecturerOrAdmin, // Import middleware mới
} = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ ROUTE BÊN DƯỚI ===
// Mọi API trong file này đều yêu cầu phải đăng nhập
router.use(verifyToken);

// === PHÂN QUYỀN CỤ THỂ ===

/*
 * GET (Xem): Cho phép Giảng viên và Admin
 */
// GET /api/students (Lấy tất cả SV)
router.get('/', isLecturerOrAdmin, studentController.getAllStudents);

// GET /api/students/:id (Lấy 1 SV)
router.get('/:id', isLecturerOrAdmin, studentController.getStudentById);


/*
 * POST, PUT, DELETE (Chỉnh sửa): Chỉ Admin
 */
// POST /api/students (Tạo SV)
router.post('/', isAdmin, studentController.createStudent);

// PUT /api/students/:id (Cập nhật SV)
router.put('/:id', isAdmin, studentController.updateStudent);

// DELETE /api/students/:id (Xóa SV)
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;