import api from './api';

const subjectService = {
  // 1. Lấy tất cả môn học
  getAllSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học:', error);
      throw error.response.data;
    }
  },

  // 2. Tạo môn học mới
  createSubject: async (subjectData) => {
    // subjectData là { subject_code: "...", subject_name: "...", credits: 3 }
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo môn học:', error);
      throw error.response.data;
    }
  },

  // 3. Cập nhật môn học
  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await api.put(`/subjects/${subjectId}`, subjectData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật môn học:', error);
      throw error.response.data;
    }
  },

  // 4. Xóa môn học
  deleteSubject: async (subjectId) => {
    try {
      const response = await api.delete(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa môn học:', error);
      throw error.response.data;
    }
  },
};

export default subjectService;