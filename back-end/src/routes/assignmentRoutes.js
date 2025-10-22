const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ ===
// Chỉ Admin mới được phép Phân công
router.use(verifyToken, isAdmin);

// 1. POST /api/assignments (Tạo)
router.post('/', assignmentController.createAssignment);

// 2. GET /api/assignments (Lấy tất cả)
router.get('/', assignmentController.getAllAssignments);

// 3. DELETE /api/assignments/:id (Xóa)
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;