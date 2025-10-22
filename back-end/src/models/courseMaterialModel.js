const db = require('../config/db');

const courseMaterialModel = {
  // 1. Thêm tài liệu mới
  create: async (subject_id, title, url, added_by_user_id) => {
    const query = `
      INSERT INTO Course_Materials (subject_id, title, url, added_by_user_id)
      VALUES (?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [
        subject_id,
        title,
        url,
        added_by_user_id,
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi thêm tài liệu:', error);
      throw error;
    }
  },

  // 2. Lấy tài liệu theo Môn học (dùng cho Sinh viên)
  findBySubject: async (subject_id) => {
    const query = `
      SELECT cm.material_id, cm.title, cm.url, cm.created_at, u.full_name as added_by
      FROM Course_Materials cm
      JOIN Users u ON cm.added_by_user_id = u.user_id
      WHERE cm.subject_id = ?
      ORDER BY cm.created_at DESC;
    `;
    try {
      const [rows] = await db.query(query, [subject_id]);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy tài liệu theo môn học:', error);
      throw error;
    }
  },

  // 3. Xóa tài liệu
  delete: async (material_id) => {
    const query = 'DELETE FROM Course_Materials WHERE material_id = ?';
    try {
      const [result] = await db.execute(query, [material_id]);
      return result.affectedRows; // 1 nếu thành công
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
      throw error;
    }
  },
  
  // (Chúng ta có thể thêm hàm getById hoặc update sau nếu cần)
};

module.exports = courseMaterialModel;