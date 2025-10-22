const db = require('../config/db');

const gradeModel = {
  // 1. Hàm UPSERT: Tạo mới hoặc cập nhật điểm
  upsert: async (student_id, subject_id, semester, midtermScore, finalScore) => {
    const query = `
      INSERT INTO Grades (student_id, subject_id, semester, midterm_score, final_score)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        midterm_score = VALUES(midterm_score),
        final_score = VALUES(final_score);
    `;
    try {
      const [result] = await db.execute(query, [
        student_id, // SỬA BIẾN NÀY
        subject_id, // SỬA BIẾN NÀY
        semester,
        midtermScore,
        finalScore,
      ]);
      return result;
    } catch (error) {
      console.error('Lỗi khi upsert điểm:', error);
      throw error;
    }
  },

  // 2. Hàm lấy bảng điểm cho 1 sinh viên (dùng cho sinh viên)
  findByStudentId: async (studentId) => {
    const query = `
      SELECT 
        g.semester,
        s.subject_code,
        s.subject_name,
        s.credits,
        g.midterm_score,
        g.final_score
      FROM Grades g
      JOIN Subjects s ON g.subject_id = s.subject_id
      WHERE g.student_id = ?
      ORDER BY g.semester, s.subject_name;
    `;
    try {
      const [rows] = await db.query(query, [studentId]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy bảng điểm sinh viên:', error);
      throw error;
    }
  },
  
  // (Bạn có thể thêm các hàm khác sau, vd: lấy điểm của cả 1 lớp)
};

module.exports = gradeModel;