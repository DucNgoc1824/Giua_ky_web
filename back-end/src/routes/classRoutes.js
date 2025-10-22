const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ CÁC ROUTE BÊN DƯỚI ===
// Mọi API trong file này đều yêu cầu:
// 1. Phải đăng nhập (verifyToken)
// 2. Phải là Admin (isAdmin)
router.use(verifyToken, isAdmin);

// === ĐỊNH NGHĨA CÁC ROUTE CRUD ===

// 1. POST /api/classes
// (Tạo lớp mới)
router.post('/', classController.createClass);

// 2. GET /api/classes
// (Lấy tất cả lớp)
router.get('/', classController.getAllClasses);

// 3. GET /api/classes/:id
// (Lấy 1 lớp)
router.get('/:id', classController.getClassById);

// 4. PUT /api/classes/:id
// (Cập nhật 1 lớp)
router.put('/:id', classController.updateClass);

// 5. DELETE /api/classes/:id
// (Xóa 1 lớp)
router.delete('/:id', classController.deleteClass);

module.exports = router;