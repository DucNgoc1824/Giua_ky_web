import api from './api';

const studentService = {
  // 1. Lấy tất cả sinh viên
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data; // Mảng SV (đã JOIN)
    } catch (error) {
      console.error('Lỗi khi lấy danh sách SV:', error);
      throw error.response.data;
    }
  },

  // 2. Tạo sinh viên mới
  createStudent: async (studentData) => {
    // studentData là 1 object lớn { username, password, full_name, ... }
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo SV:', error);
      throw error.response.data;
    }
  },

  // 3. Cập nhật sinh viên
  updateStudent: async (studentId, studentData) => {
    // studentData là { full_name, email, date_of_birth, address }
    try {
      const response = await api.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật SV:', error);
      throw error.response.data;
    }
  },

  // 4. Xóa sinh viên
  deleteStudent: async (studentId) => {
    try {
      // Chú ý: Backend của chúng ta xóa SV bằng student_id,
      // controller sẽ tự tìm user_id để xóa.
      const response = await api.delete(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa SV:', error);
      throw error.response.data;
    }
  },
  
  // 5. Lấy chi tiết 1 SV (cần cho form Sửa)
  getStudentById: async (studentId) => {
     try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết SV:', error);
      throw error.response.data;
    }
  }
};

export default studentService;