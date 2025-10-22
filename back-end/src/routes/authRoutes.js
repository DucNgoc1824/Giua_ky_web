const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Import middleware
const { verifyToken } = require('../middleware/authMiddleware'); // <--- THÊM DÒNG NÀY

// POST /api/auth/register (Public)
router.post('/register', authController.register);

// POST /api/auth/login (Public)
router.post('/login', authController.login);

// GET /api/auth/me (Protected - Cần đăng nhập)
// verifyToken sẽ chạy trước authController.getCurrentUser
router.get('/me', verifyToken, authController.getCurrentUser); // <--- THÊM DÒNG NÀY

module.exports = router;