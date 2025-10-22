const db = require('../config/db');

const classModel = {
  // 1. Tạo lớp mới
  create: async (class_code, major) => { 
    const query = 'INSERT INTO Classes (class_code, major) VALUES (?, ?)';
    try {
      // SỬA DÒNG NÀY:
      const [result] = await db.execute(query, [class_code, major]); 
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo lớp học:', error);
      throw error;
    }
  },

  // 2. Lấy tất cả lớp học
  getAll: async () => {
    const query = 'SELECT * FROM Classes ORDER BY class_code';
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lớp học:', error);
      throw error;
    }
  },

  // 3. Lấy 1 lớp học theo ID
  getById: async (classId) => {
    const query = 'SELECT * FROM Classes WHERE class_id = ?';
    try {
      const [rows] = await db.query(query, [classId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm lớp học:', error);
      throw error;
    }
  },

  // 4. Cập nhật lớp học
  update: async (classId, class_code, major) => { 
    const query =
      'UPDATE Classes SET class_code = ?, major = ? WHERE class_id = ?';
    try {
      // SỬA DÒNG NÀY:
      const [result] = await db.execute(query, [class_code, major, classId]);
      return result.affectedRows;
    } catch (error) {
      console.error('Lỗi khi cập nhật lớp học:', error);
      throw error;
    }
  },

  // 5. Xóa lớp học
  delete: async (classId) => {
    const query = 'DELETE FROM Classes WHERE class_id = ?';
    try {
      const [result] = await db.execute(query, [classId]);
      return result.affectedRows; // Trả về số dòng bị ảnh hưởng
    } catch (error) {
      console.error('Lỗi khi xóa lớp học:', error);
      throw error;
    }
  },
};

module.exports = classModel;