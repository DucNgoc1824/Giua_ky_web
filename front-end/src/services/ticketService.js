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
      return response.data;
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
};

export default ticketService;