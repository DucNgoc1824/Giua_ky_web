const db = require('../config/db');

const userModel = {
  findUserByUsername: async (username) => {
    const query = 'SELECT * FROM Users WHERE username = ?';
    try {
      const [rows] = await db.query(query, [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

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
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  createUserAndLinkStudent: async (userData, studentData) => {
    const connection = await db.getConnection(); 
    try {
      await connection.beginTransaction(); 

      const { username, passwordHash, full_name, email, roleId } = userData;
      const userQuery = `
        INSERT INTO Users (username, password_hash, full_name, email, role_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.execute(userQuery, [
        username,
        passwordHash,
        full_name,
        email,
        roleId,
      ]);

      const newUserId = userResult.insertId; 

      const { student_code, class_id } = studentData;
      const studentQuery = `
        INSERT INTO Students (student_code, user_id, class_id)
        VALUES (?, ?, ?)
      `;
      await connection.execute(studentQuery, [
        student_code,
        newUserId,
        class_id,
      ]);

      await connection.commit(); 
      return newUserId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  createUserAndLinkLecturer: async (userData, lecturerData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { username, passwordHash, full_name, email, roleId } = userData;
      const userQuery = `
        INSERT INTO Users (username, password_hash, full_name, email, role_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      const [userResult] = await connection.execute(userQuery, [
        username,
        passwordHash,
        full_name,
        email,
        roleId,
      ]);

      const newUserId = userResult.insertId;

      const { lecturer_code, department } = lecturerData;
      const lecturerQuery = `
        INSERT INTO Lecturers (lecturer_code, user_id, department)
        VALUES (?, ?, ?)
      `;
      await connection.execute(lecturerQuery, [
        lecturer_code,
        newUserId,
        department,
      ]);

      await connection.commit();
      return newUserId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Get user email (masked) by username
  getEmailByUsername: async (username) => {
    const query = 'SELECT email FROM Users WHERE username = ?';
    try {
      const [rows] = await db.query(query, [username]);
      return rows[0]?.email || null;
    } catch (error) {
      throw error;
    }
  },

  // Update password
  updatePassword: async (username, newPasswordHash) => {
    const query = 'UPDATE Users SET password_hash = ? WHERE username = ?';
    try {
      const [result] = await db.execute(query, [newPasswordHash, username]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userModel;