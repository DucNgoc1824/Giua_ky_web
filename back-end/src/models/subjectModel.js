const db = require('../config/db');

const subjectModel = {
  // 1. Tạo môn học mới
  create: async (subject_code, subject_name, credits) => {
    const query =
      'INSERT INTO Subjects (subject_code, subject_name, credits) VALUES (?, ?, ?)';
    try {
      const [result] = await db.execute(query, [
        subject_code, // SỬA DÒNG NÀY
        subject_name, // SỬA DÒNG NÀY
        credits,
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo môn học:', error);
      throw error;
    }
  },

  // 2. Lấy tất cả môn học
  getAll: async () => {
    const query = 'SELECT * FROM Subjects ORDER BY subject_code';
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách môn học:', error);
      throw error;
    }
  },

  // 3. Lấy 1 môn học theo ID
  getById: async (subjectId) => {
    const query = 'SELECT * FROM Subjects WHERE subject_id = ?';
    try {
      const [rows] = await db.query(query, [subjectId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm môn học:', error);
      throw error;
    }
  },

  // 4. Cập nhật môn học
  update: async (subjectId, subject_code, subject_name, credits) => {
    const query =
      'UPDATE Subjects SET subject_code = ?, subject_name = ?, credits = ? WHERE subject_id = ?';
    try {
      const [result] = await db.execute(query, [
        subject_code, // SỬA DÒNG NÀY
        subject_name, // SỬA DÒNG NÀY
        credits,
        subjectId,
      ]);
      return result.affectedRows;
    } catch (error) {
      console.error('Lỗi khi cập nhật môn học:', error);
      throw error;
    }
  },

  // 5. Xóa môn học
  delete: async (subjectId) => {
    const query = 'DELETE FROM Subjects WHERE subject_id = ?';
    try {
      const [result] = await db.execute(query, [subjectId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Lỗi khi xóa môn học:', error);
      throw error;
    }
  },
};

module.exports = subjectModel;