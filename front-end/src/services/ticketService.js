import api from './api';

const ticketService = {
  // 1. (SV) Gửi ticket mới
  createTicket: async (ticketData) => {
    // ticketData là { subject_id, semester, message_text }
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi ticket:', error);
      throw error.response.data;
    }
  },

  // 2. (SV) Lấy các ticket đã gửi
  getMyTickets: async () => {
    try {
      const response = await api.get('/tickets/my-tickets');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy ticket của tôi:', error);
      throw error.response.data;
    }
  },

  // 3. (GV) Lấy hòm thư
  getTicketInbox: async () => {
    try {
      const response = await api.get('/tickets/inbox');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy hòm thư GV:', error);
      throw error.response.data;
    }
  },
};

export default ticketService;