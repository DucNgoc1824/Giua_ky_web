const express = require('express');
const router = express.Router();
const lecturerController = require('../controllers/lecturerController');
const { verifyToken, isAdmin, isLecturerOrAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/:id/subjects', isLecturerOrAdmin, lecturerController.getSubjectsByLecturer);

router.use(isAdmin);

router.post('/', lecturerController.createLecturer);
router.get('/', lecturerController.getAllLecturers);
router.get('/:id', lecturerController.getLecturerById);
router.put('/:id', lecturerController.updateLecturer);
router.delete('/:id', lecturerController.deleteLecturer);
router.post('/:id/subjects', lecturerController.addSubjectToLecturer);
router.delete('/:id/subjects/:subjectId', lecturerController.removeSubjectFromLecturer);

module.exports = router;