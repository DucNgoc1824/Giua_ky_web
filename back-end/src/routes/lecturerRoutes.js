const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Bảo vệ tất cả, yêu cầu Admin
router.use(verifyToken, isAdmin);

// 1. POST /api/lecturers (Tạo GV)
router.post('/', lecturerController.createLecturer);

// 2. GET /api/lecturers (Lấy tất cả GV)
router.get('/', lecturerController.getAllLecturers);

// 3. GET /api/lecturers/:id (Lấy 1 GV)
router.get('/:id', lecturerController.getLecturerById);

// 4. PUT /api/lecturers/:id (Cập nhật GV)
router.put('/:id', lecturerController.updateLecturer);

// 5. DELETE /api/lecturers/:id (Xóa GV)
router.delete('/:id', lecturerController.deleteLecturer);

module.exports = router;