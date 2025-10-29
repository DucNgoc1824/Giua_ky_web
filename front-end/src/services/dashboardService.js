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

  getLecturerStats: async () => {
    try {
      const response = await api.get('/dashboard/lecturer-stats');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getStudentStats: async () => {
    try {
      const response = await api.get('/dashboard/student-stats');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default dashboardService;