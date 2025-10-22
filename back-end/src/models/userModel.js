const db = require('../config/db'); // Import pool kết nối CSDL

const userModel = {
  // Hàm tìm kiếm user bằng username
  findUserByUsername: async (username) => {
    const query = 'SELECT * FROM Users WHERE username = ?';
    try {
      const [rows] = await db.query(query, [username]);
      return rows[0]; // Trả về user đầu tiên tìm thấy (hoặc undefined)
    } catch (error) {
      console.error('Lỗi khi tìm user by username:', error);
      throw error;
    }
  },

  // Hàm tạo user mới (dùng cho đăng ký)
  createUser: async (username, passwordHash, fullName, email, roleId) => {
    const query = `
      INSERT INTO Users (username, password_hash, full_name, email, role_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [
        username,
        passwordHash,
        fullName,
        email,
        roleId,
      ]);
      return result.insertId; // Trả về ID của user vừa được tạo
    } catch (error) {
      console.error('Lỗi khi tạo user:', error);
      throw error;
    }
  },
  createUserAndLinkStudent: async (userData, studentData) => {
    const connection = await db.getConnection(); 
    try {
      await connection.beginTransaction(); 

      // SỬA DÒNG NÀY:
      const { username, passwordHash, full_name, email, roleId } = userData;
      const userQuery = `
        INSERT INTO Users (username, password_hash, full_name, email, role_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.execute(userQuery, [
        username,
        passwordHash,
        full_name, // <-- Sửa
        email,
        roleId,
      ]);

      const newUserId = userResult.insertId; 

      // SỬA DÒNG NÀY:
      const { student_code, class_id } = studentData;
      const studentQuery = `
        INSERT INTO Students (student_code, user_id, class_id)
        VALUES (?, ?, ?)
      `;
      await connection.execute(studentQuery, [
        student_code, // <-- Sửa
        newUserId,
        class_id, // <-- Sửa
      ]);

      await connection.commit(); 
      return newUserId;
    } catch (error) {
      await connection.rollback(); // 6. Rollback (Hủy)
      console.error('Lỗi transaction khi tạo student:', error);
      throw error; // Ném lỗi để controller bắt
    } finally {
      connection.release(); // Luôn trả kết nối về pool dù thành công hay thất bại
    }
  },
  createUserAndLinkLecturer: async (userData, lecturerData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // SỬA DÒNG NÀY:
      const { username, passwordHash, full_name, email, roleId } = userData;
      const userQuery = `
        INSERT INTO Users (username, password_hash, full_name, email, role_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.execute(userQuery, [
        username,
        passwordHash,
        full_name, // <-- Sửa
        email,
        roleId,
      ]);

      const newUserId = userResult.insertId;

      // SỬA DÒNG NÀY:
      const { lecturer_code, department } = lecturerData;
      const lecturerQuery = `
        INSERT INTO Lecturers (lecturer_code, user_id, department)
        VALUES (?, ?, ?)
      `;
      await connection.execute(lecturerQuery, [
        lecturer_code, // <-- Sửa
        newUserId,
        department,
      ]);

      await connection.commit();
      return newUserId;
    } catch (error) {
      await connection.rollback();
      console.error('Lỗi transaction khi tạo lecturer:', error);
      throw error;
    } finally {
      connection.release();
    }
  },  
};

module.exports = userModel;