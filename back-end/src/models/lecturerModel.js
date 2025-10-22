const db = require('../config/db');

const lecturerModel = {
  // 1. Lấy tất cả giảng viên (JOIN 2 bảng)
  getAll: async () => {
    const query = `
      SELECT 
        l.lecturer_id, l.lecturer_code, l.department,
        u.full_name, u.email, u.username
      FROM Lecturers l
      JOIN Users u ON l.user_id = u.user_id
      ORDER BY l.lecturer_code;
    `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giảng viên:', error);
      throw error;
    }
  },

  // 2. Lấy 1 giảng viên (chi tiết)
  getById: async (lecturerId) => {
    const query = `
      SELECT 
        l.lecturer_id, l.lecturer_code, l.department,
        u.user_id, u.full_name, u.email, u.username, u.role_id
      FROM Lecturers l
      JOIN Users u ON l.user_id = u.user_id
      WHERE l.lecturer_id = ?;
    `;
    try {
      const [rows] = await db.query(query, [lecturerId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm giảng viên:', error);
      throw error;
    }
  },

  // 3. Cập nhật thông tin giảng viên (cả bảng Users và Lecturers)
  update: async (lecturerId, userId, lecturerData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // SỬA DÒNG NÀY:
      const { full_name, email, department } = lecturerData;
      
      const userQuery = 'UPDATE Users SET full_name = ?, email = ? WHERE user_id = ?';
      // SỬA DÒNG NÀY:
      await connection.execute(userQuery, [full_name, email, userId]);

      const lecturerQuery = 'UPDATE Lecturers SET department = ? WHERE lecturer_id = ?';
      await connection.execute(lecturerQuery, [department, lecturerId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Lỗi transaction khi cập nhật lecturer:', error);
      throw error;
    } finally {
      connection.release();
    }
  },
  findByUserId: async (userId) => {
    const query = 'SELECT lecturer_id FROM Lecturers WHERE user_id = ?';
    try {
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm lecturer by user_id:', error);
      throw error;
    }
  },
  
  // 4. Xóa giảng viên (Chỉ cần xóa User, bảng Lecturer sẽ tự xóa theo)
  delete: async (userId) => {
     const query = 'DELETE FROM Users WHERE user_id = ?';
    try {
      // 'ON DELETE CASCADE' sẽ tự động xóa hàng trong Lecturers
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows;
    } catch (error)
    {
      console.error('Lỗi khi xóa giảng viên (user):', error);
      throw error;
    }
  }
};

module.exports = lecturerModel;