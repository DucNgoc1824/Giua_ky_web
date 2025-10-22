const db = require('../config/db');

const studentModel = {
  // 1. Lấy tất cả sinh viên (JOIN 3 bảng)
  getAll: async () => {
    // Lấy thông tin SV, tên User và mã Lớp
    const query = `
      SELECT 
        s.student_id, s.student_code, s.date_of_birth, s.address,
        u.full_name, u.email, u.username,
        c.class_code
      FROM Students s
      JOIN Users u ON s.user_id = u.user_id
      JOIN Classes c ON s.class_id = c.class_id
      ORDER BY s.student_code;
    `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
      throw error;
    }
  },

  // 2. Lấy 1 sinh viên (chi tiết)
  getById: async (studentId) => {
    const query = `
      SELECT 
        s.student_id, s.student_code, s.date_of_birth, s.address,
        u.user_id, u.full_name, u.email, u.username, u.role_id,
        c.class_id, c.class_code
      FROM Students s
      JOIN Users u ON s.user_id = u.user_id
      JOIN Classes c ON s.class_id = c.class_id
      WHERE s.student_id = ?;
    `;
    try {
      const [rows] = await db.query(query, [studentId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm sinh viên:', error);
      throw error;
    }
  },

  // 3. Cập nhật thông tin sinh viên
  // (Chúng ta sẽ cập nhật cả bảng Users và Students)
  update: async (studentId, userId, studentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // SỬA DÒNG NÀY:
      const { full_name, email, date_of_birth, address } = studentData;
      
      const userQuery = 'UPDATE Users SET full_name = ?, email = ? WHERE user_id = ?';
      // SỬA DÒNG NÀY:
      await connection.execute(userQuery, [full_name, email, userId]);

      const studentQuery = 'UPDATE Students SET date_of_birth = ?, address = ? WHERE student_id = ?';
      await connection.execute(studentQuery, [date_of_birth, address, studentId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Lỗi transaction khi cập nhật student:', error);
      throw error;
    } finally {
      connection.release();
    }
  },
  
  // 4. Xóa sinh viên
  // (Chỉ cần xóa User, bảng Student sẽ tự động xóa theo - ON DELETE CASCADE)
  delete: async (userId) => {
     const query = 'DELETE FROM Users WHERE user_id = ?';
    try {
      // Vì CSDL đã thiết lập 'ON DELETE CASCADE' cho student.user_id
      // nên khi xóa User, hàng liên quan trong Student cũng tự động bị xóa.
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows;
    } catch (error)
    {
      console.error('Lỗi khi xóa sinh viên (user):', error);
      throw error;
    }
  },
  findByUserId: async (userId) => {
    const query = 'SELECT student_id FROM Students WHERE user_id = ?';
    try {
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      console.error('Lỗi khi tìm student by user_id:', error);
      throw error;
    }
  },
};

module.exports = studentModel;