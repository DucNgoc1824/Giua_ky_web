const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, isAdmin, isLecturer, isStudent } = require('../middleware/authMiddleware');

// Admin dashboard stats
router.get(
  '/admin-stats',
  verifyToken,
  isAdmin,
  dashboardController.getAdminStats
);

// Lecturer dashboard stats
router.get(
  '/lecturer-stats',
  verifyToken,
  isLecturer,
  dashboardController.getLecturerStats
);

// Student dashboard stats
router.get(
  '/student-stats',
  verifyToken,
  isStudent,
  dashboardController.getStudentStats
);

module.exports = router;