const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.post('/', assignmentController.createAssignment);
router.get('/', assignmentController.getAllAssignments);
router.delete('/:id', assignmentController.deleteAssignment);

module.exports = router;