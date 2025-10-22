const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const {
  verifyToken,
  isStudent,
  isLecturerOrAdmin,
} = require('../middleware/authMiddleware');

// === BẢO VỆ TẤT CẢ ===
router.use(verifyToken);

// 1. POST /api/tickets (SV tạo ticket)
router.post('/', isStudent, ticketController.createTicket);

// 2. GET /api/tickets/my-tickets (SV xem ticket đã gửi)
router.get('/my-tickets', isStudent, ticketController.getMyTickets);

// 3. GET /api/tickets/inbox (GV xem hòm thư)
router.get('/inbox', isLecturerOrAdmin, ticketController.getTicketInbox);

module.exports = router;