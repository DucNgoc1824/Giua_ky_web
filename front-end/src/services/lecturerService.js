import api from './api';

const lecturerService = {
  // 1. Lấy tất cả giảng viên
  getAllLecturers: async () => {
    try {
      const response = await api.get('/lecturers');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách GV:', error);
      throw error.response.data;
    }
  },

  // 2. Lấy chi tiết 1 GV
  getLecturerById: async (lecturerId) => {
    try {
      const response = await api.get(`/lecturers/${lecturerId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết GV:', error);
      throw error.response.data;
    }
  },

  // 3. Tạo giảng viên mới
  createLecturer: async (lecturerData) => {
    try {
      const response = await api.post('/lecturers', lecturerData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo GV:', error);
      throw error.response.data;
    }
  },

  // 4. Cập nhật giảng viên
  updateLecturer: async (lecturerId, lecturerData) => {
    try {
      const response = await api.put(`/lecturers/${lecturerId}`, lecturerData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật GV:', error);
      throw error.response.data;
    }
  },

  // 5. Xóa giảng viên
  deleteLecturer: async (lecturerId) => {
    try {
      const response = await api.delete(`/lecturers/${lecturerId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa GV:', error);
      throw error.response.data;
    }
  },
};

export default lecturerService;