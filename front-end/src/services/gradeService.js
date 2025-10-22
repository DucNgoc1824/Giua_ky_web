import api from './api';

const gradeService = {
  // 1. API cho Sinh viên tự xem điểm
  getMyGrades: async () => {
    try {
      // GET /api/grades/my-grades
      // Token sẽ tự động được gắn vào (bởi api.js)
      // Backend sẽ đọc studentId từ token
      const response = await api.get('/grades/my-grades');
      return response.data; // Trả về mảng điểm
    } catch (error) {
      console.error('Lỗi khi lấy bảng điểm:', error);
      throw error.response.data;
    }
  },
  upsertGrade: async (gradeData) => {
    // gradeData là { student_id, subject_id, semester, ... }
    try {
      // POST /api/grades
      // Token (của GV/Admin) sẽ tự động được gắn vào
      const response = await api.post('/grades', gradeData);
      return response.data; // Trả về { message: "..." }
    } catch (error) {
      console.error('Lỗi khi cập nhật điểm:', error);
      throw error.response.data;
    }
  },
  // (Chúng ta sẽ thêm các hàm cho Giảng viên sau)
  // getGradesForStudent: async (studentId) => { ... }
  // upsertGrade: async (gradeData) => { ... }
};

export default gradeService;