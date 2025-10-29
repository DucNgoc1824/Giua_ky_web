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

// Routes mới
router.get('/:ticket_id', ticketController.getTicketById);
router.put('/:ticket_id/respond', isLecturerOrAdmin, ticketController.respondToTicket);

module.exports = router;