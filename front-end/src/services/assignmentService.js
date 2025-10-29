import api from './api';

const assignmentService = {
  // ============ ASSIGNMENTS ============

  // Lấy danh sách bài tập (tự động phân biệt GV/SV)
  getAssignments: async () => {
    try {
      const response = await api.get('/assignments');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy chi tiết bài tập
  getAssignmentById: async (id) => {
    try {
      const response = await api.get(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Tạo bài tập mới (GV)
  createAssignment: async (data) => {
    try {
      const response = await api.post('/assignments', data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Cập nhật bài tập (GV)
  updateAssignment: async (id, data) => {
    try {
      const response = await api.put(`/assignments/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Xóa bài tập (GV)
  deleteAssignment: async (id) => {
    try {
      const response = await api.delete(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // ============ SUBMISSIONS ============

  // Nộp bài (SV)
  submitAssignment: async (formData) => {
    try {
      const response = await api.post('/assignments/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Lấy danh sách bài nộp của 1 bài tập (GV)
  getSubmissions: async (assignmentId) => {
    try {
      const response = await api.get(`/assignments/${assignmentId}/submissions`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  // Chấm điểm bài nộp (GV)
  gradeSubmission: async (submissionId, data) => {
    try {
      const response = await api.put(`/assignments/submissions/${submissionId}/grade`, data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default assignmentService;
