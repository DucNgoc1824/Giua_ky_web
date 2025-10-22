const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

// Chỉ Admin mới được xem thống kê tổng quan
router.get(
  '/admin-stats',
  verifyToken,
  isAdmin,
  dashboardController.getAdminStats
);

module.exports = router;