const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const {
  verifyToken,
  isAdmin,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

router.use(verifyToken);

// Cho phép tất cả user đã login xem danh sách môn học
router.get('/', subjectController.getAllSubjects);
router.get('/enrolled/my-subjects', subjectController.getEnrolledSubjects); // Môn đang học của SV
router.get('/:id', subjectController.getSubjectById);
router.post('/', isAdmin, subjectController.createSubject);
router.put('/:id', isAdmin, subjectController.updateSubject);
router.delete('/:id', isAdmin, subjectController.deleteSubject);

module.exports = router;