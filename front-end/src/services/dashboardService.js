import api from './api';

const dashboardService = {
  // Lấy thống kê của Admin
  getAdminStats: async () => {
    try {
      // GET /api/dashboard/admin-stats
      // Token Admin sẽ tự động được gắn vào
      const response = await api.get('/dashboard/admin-stats');
      return response.data; // Trả về { students: 1, lecturers: 1, ... }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error);
      throw error.response.data;
    }
  },
};

export default dashboardService;