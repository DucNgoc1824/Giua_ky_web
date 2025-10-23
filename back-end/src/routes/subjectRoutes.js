const express = require('express');
const router = express.Router();
const subjectController = require('../controllers/subjectController');
const {
  verifyToken,
  isAdmin,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', isLecturerOrAdmin, subjectController.getAllSubjects);
router.get('/:id', isLecturerOrAdmin, subjectController.getSubjectById);
router.post('/', isAdmin, subjectController.createSubject);
router.put('/:id', isAdmin, subjectController.updateSubject);
router.delete('/:id', isAdmin, subjectController.deleteSubject);

module.exports = router;