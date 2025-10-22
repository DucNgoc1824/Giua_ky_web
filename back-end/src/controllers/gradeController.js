const gradeModel = require('../models/gradeModel');

const gradeController = {
  upsertGrade: async (req, res) => {
    try {
      // SỬA CÁC BIẾN NÀY:
      const { student_id, subject_id, semester, midterm_score, final_score } =
        req.body;

      // SỬA CÁC BIẾN NÀY:
      if (!student_id || !subject_id || !semester) {
        return res
          .status(400)
          .json({ message: 'Cần đủ thông tin SV, Môn học và Học kỳ.' });
      }
      
      // SỬA CÁC BIẾN NÀY:
      const midScore = midterm_score !== undefined ? midterm_score : null;
      const finScore = final_score !== undefined ? final_score : null;


      await gradeModel.upsert(
        student_id, // SỬA BIẾN NÀY
        subject_id, // SỬA BIẾN NÀY
        semester,
        midScore,
        finScore
      );

      res.status(200).json({ message: 'Cập nhật điểm thành công.' });
    } catch (error) {
       if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res
          .status(404)
          .json({ message: 'Không tìm thấy Sinh viên hoặc Môn học tương ứng.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 2. API cho Sinh viên tự xem điểm
  getMyGrades: async (req, res) => {
    // Chỉ Sinh viên (role 3) mới được vào hàm này (Do middleware isStudent)
    try {
      // Lấy studentId từ token (đã được giải mã bởi middleware verifyToken)
      const studentId = req.user.studentId; 
      
      if (!studentId) {
         return res.status(403).json({ message: 'Token không chứa thông tin sinh viên.' });
      }

      const grades = await gradeModel.findByStudentId(studentId);
      res.status(200).json(grades);
      
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  
  // 3. API cho Admin/GV xem điểm của 1 SV bất kỳ
  getGradesForStudent: async (req, res) => {
    // Chỉ Giảng viên (role 2) hoặc Admin (role 1) mới được vào hàm này
    try {
      const { studentId } = req.params; // Lấy studentId từ URL
      
      const grades = await gradeModel.findByStudentId(studentId);
      
      if (grades.length === 0) {
        // Vẫn trả về 200 nhưng mảng rỗng, hoặc 404 tùy bạn
        return res.status(404).json({ message: 'Không tìm thấy điểm của sinh viên này.' });
      }
      
      res.status(200).json(grades);
      
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = gradeController;