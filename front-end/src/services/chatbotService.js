import api from './api';

const chatbotService = {
    // Hỏi chatbot
    askQuestion: async (question, subjectId) => {
        const response = await api.post('/chatbot/ask', {
            question,
            subject_id: subjectId
        });
        return response.data;
    },

    // Lấy lịch sử chat
    getChatHistory: async (subjectId) => {
        const params = subjectId ? { subject_id: subjectId } : {};
        const response = await api.get('/chatbot/history', { params });
        return response.data;
    }
};

export default chatbotService;
