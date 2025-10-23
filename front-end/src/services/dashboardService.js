import api from './api';

const dashboardService = {
  getAdminStats: async () => {
    try {
      const response = await api.get('/dashboard/admin-stats');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default dashboardService;