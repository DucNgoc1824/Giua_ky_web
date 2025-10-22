const db = require('../config/db');

const assignmentModel = {
  // 1. Tạo phân công mới
  create: async (lecturer_id, subject_id, class_id, semester) => {
    const query = `
      INSERT INTO Lecturer_Assignments (lecturer_id, subject_id, class_id, semester)
      VALUES (?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [
        lecturer_id,
        subject_id,
        class_id,
        semester,
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo phân công:', error);
      throw error;
    }
  },

  // 2. Lấy tất cả phân công (JOIN 4 bảng để lấy tên)
  getAll: async () => {
    const query = `
      SELECT 
        a.assignment_id,
        a.semester,
        u.full_name AS lecturer_name,
        s.subject_name,
        c.class_code
      FROM Lecturer_Assignments a
      JOIN Lecturers l ON a.lecturer_id = l.lecturer_id
      JOIN Users u ON l.user_id = u.user_id
      JOIN Subjects s ON a.subject_id = s.subject_id
      JOIN Classes c ON a.class_id = c.class_id
      ORDER BY a.semester DESC, lecturer_name;
    `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách phân công:', error);
      throw error;
    }
  },

  // 3. Xóa phân công
  delete: async (assignment_id) => {
    const query = 'DELETE FROM Lecturer_Assignments WHERE assignment_id = ?';
    try {
      const [result] = await db.execute(query, [assignment_id]);
      return result.affectedRows;
    } catch (error) {
      console.error('Lỗi khi xóa phân công:', error);
      throw error;
    }
  },
  findLecturerForCourse: async (subject_id, class_id, semester) => {
    const query = `
      SELECT lecturer_id FROM Lecturer_Assignments
      WHERE subject_id = ? AND class_id = ? AND semester = ?
    `;
    try {
      const [rows] = await db.query(query, [subject_id, class_id, semester]);
      return rows[0] ? rows[0].lecturer_id : null;
    } catch (error) {
      console.error('Lỗi khi tìm GV phân công:', error);
      throw error;
    }
  },
};

module.exports = assignmentModel;