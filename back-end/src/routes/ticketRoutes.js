const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const {
  verifyToken,
  isStudent,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

router.use(verifyToken);

router.post('/', isStudent, ticketController.createTicket);
router.get('/my-tickets', isStudent, ticketController.getMyTickets);
router.get('/inbox', isLecturerOrAdmin, ticketController.getTicketInbox);

module.exports = router;