const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentControllerNew');
const { verifyToken, isLecturer, isStudent } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ============ ASSIGNMENTS ============

// Lấy danh sách bài tập (cả GV và SV)
router.get('/', verifyToken, assignmentController.getAssignments);

// Lấy bài tập của 1 sinh viên (cho Android app)
router.get('/student/:studentId', verifyToken, assignmentController.getAssignmentsByStudent);

// Lấy chi tiết bài tập
router.get('/:id', verifyToken, assignmentController.getAssignmentById);

// Tạo bài tập mới (chỉ GV)
router.post('/', verifyToken, isLecturer, assignmentController.createAssignment);

// Cập nhật bài tập (chỉ GV)
router.put('/:id', verifyToken, isLecturer, assignmentController.updateAssignment);

// Xóa bài tập (chỉ GV)
router.delete('/:id', verifyToken, isLecturer, assignmentController.deleteAssignment);

// ============ SUBMISSIONS ============

// Nộp bài (chỉ SV)
router.post('/submit', verifyToken, isStudent, upload.single('file'), assignmentController.submitAssignment);

// Lấy danh sách bài nộp của 1 bài tập (chỉ GV)
router.get('/:id/submissions', verifyToken, isLecturer, assignmentController.getSubmissions);

// Chấm điểm bài nộp (chỉ GV)
router.put('/submissions/:id/grade', verifyToken, isLecturer, assignmentController.gradeSubmission);

module.exports = router;
