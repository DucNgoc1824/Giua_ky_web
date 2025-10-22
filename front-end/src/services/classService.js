import api from './api'; // Import instance axios trung tâm

const classService = {
  // 1. Lấy tất cả lớp học
  getAllClasses: async () => {
    try {
      // Nhớ là token đã được api.js tự động gắn vào header
      const response = await api.get('/classes');
      return response.data; // Trả về mảng [ { class_id: 1, ... }, ... ]
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lớp:', error);
      throw error.response.data;
    }
  },

  // 2. Tạo lớp học mới
  createClass: async (classData) => {
    // classData là object: { classCode: "...", major: "..." }
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo lớp:', error);
      throw error.response.data;
    }
  },

  // 3. Cập nhật lớp học
  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật lớp:', error);
      throw error.response.data;
    }
  },

  // 4. Xóa lớp học
  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa lớp:', error);
      throw error.response.data;
    }
  },
};

export default classService;