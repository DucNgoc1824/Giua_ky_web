const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { verifyToken, isStudent } = require('../middleware/authMiddleware');

// POST /api/chatbot/ask - Hỏi chatbot
router.post('/ask', verifyToken, isStudent, chatbotController.askQuestion);

// GET /api/chatbot/history - Lấy lịch sử chat
router.get('/history', verifyToken, isStudent, chatbotController.getChatHistory);

module.exports = router;
