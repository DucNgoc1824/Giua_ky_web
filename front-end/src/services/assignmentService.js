import api from './api';

const assignmentService = {
  // 1. Lấy tất cả phân công (đã JOIN)
  getAllAssignments: async () => {
    try {
      const response = await api.get('/assignments');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phân công:', error);
      throw error.response.data;
    }
  },

  // 2. Tạo phân công mới
  createAssignment: async (assignmentData) => {
    // assignmentData là { lecturer_id, subject_id, class_id, semester }
    try {
      const response = await api.post('/assignments', assignmentData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo phân công:', error);
      throw error.response.data;
    }
  },

  // 3. Xóa phân công
  deleteAssignment: async (assignmentId) => {
    try {
      const response = await api.delete(`/assignments/${assignmentId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa phân công:', error);
      throw error.response.data;
    }
  },
};

export default assignmentService;