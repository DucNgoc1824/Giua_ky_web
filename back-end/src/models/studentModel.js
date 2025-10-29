const db = require('../config/db');

const studentModel = {
  getAll: async () => {
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
      throw error;
    }
  },

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
      throw error;
    }
  },

  update: async (studentId, userId, studentData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { full_name, email, date_of_birth, address } = studentData;
      
      const userQuery = 'UPDATE Users SET full_name = ?, email = ? WHERE user_id = ?';
      await connection.execute(userQuery, [full_name, email, userId]);

      const studentQuery = 'UPDATE Students SET date_of_birth = ?, address = ? WHERE student_id = ?';
      await connection.execute(studentQuery, [date_of_birth, address, studentId]);

      await connection.commit();
      return { success: true };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
  
  delete: async (userId) => {
    const query = 'DELETE FROM Users WHERE user_id = ?';
    try {
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  findByUserId: async (userId) => {
    const query = 'SELECT student_id FROM Students WHERE user_id = ?';
    try {
      const [rows] = await db.query(query, [userId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getClassId: async (student_id) => {
    const query = 'SELECT class_id FROM Students WHERE student_id = ?';
    try {
      const [rows] = await db.query(query, [student_id]);
      return rows[0]?.class_id || null;
    } catch (error) {
      throw error;
    }
  },

  searchByName: async (searchTerm) => {
    const query = `
      SELECT 
        s.student_id, s.student_code,
        u.full_name,
        c.class_code
      FROM Students s
      JOIN Users u ON s.user_id = u.user_id
      JOIN Classes c ON s.class_id = c.class_id
      WHERE u.full_name LIKE ?
      ORDER BY u.full_name
      LIMIT 20;
    `;
    try {
      const [rows] = await db.query(query, [`%${searchTerm}%`]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = studentModel;