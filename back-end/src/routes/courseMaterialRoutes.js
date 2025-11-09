const express = require('express');
const router = express.Router();
const courseMaterialController = require('../controllers/courseMaterialController');
const {
  verifyToken,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

const uploadMiddleware = require('../middleware/uploadMiddleware');

router.use(verifyToken);

router.post(
  '/',
  [verifyToken, isLecturerOrAdmin, uploadMiddleware.single('file')],
  courseMaterialController.addMaterial
);
router.get(
  '/subject/:subjectId',
  courseMaterialController.getMaterialsForSubject
);
router.get(
  '/student/:studentId',
  courseMaterialController.getMaterialsByStudent
);
router.delete('/:id', isLecturerOrAdmin, courseMaterialController.deleteMaterial);

module.exports = router;