import api from './api';

const ticketService = {
  createTicket: async (ticketData) => {
    try {
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getMyTickets: async () => {
    try {
      const response = await api.get('/tickets/my-tickets');
      // Backend trả về {success: true, data: [...]}
      return response.data.data || response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getTicketInbox: async () => {
    try {
      const response = await api.get('/tickets/inbox');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy chi tiết ticket
  getTicketById: async (ticketId) => {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Phản hồi ticket (Giảng viên)
  respondToTicket: async (ticketId, responseText) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/respond`, {
        response_text: responseText
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default ticketService;