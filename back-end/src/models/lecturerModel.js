const db = require('../config/db');

const lecturerModel = {
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
      throw error;
    }
  },

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
      throw error;
    }
  },

  update: async (lecturerId, userId, lecturerData) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { full_name, email, department } = lecturerData;
      
      const userQuery = 'UPDATE Users SET full_name = ?, email = ? WHERE user_id = ?';
      await connection.execute(userQuery, [full_name, email, userId]);

      const lecturerQuery = 'UPDATE Lecturers SET department = ? WHERE lecturer_id = ?';
      await connection.execute(lecturerQuery, [department, lecturerId]);

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
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
      throw error;
    }
  },
  
  delete: async (userId) => {
     const query = 'DELETE FROM Users WHERE user_id = ?';
    try {
      const [result] = await db.execute(query, [userId]);
      return result.affectedRows;
    } catch (error)
    {
      throw error;
    }
  },

  getSubjectsByLecturerId: async (lecturerId) => {
    const query = `
      SELECT DISTINCT
        s.subject_id,
        s.subject_code,
        s.subject_name,
        s.credits
      FROM Subjects s
      JOIN Lecturer_Assignments la ON s.subject_id = la.subject_id
      WHERE la.lecturer_id = ?
      ORDER BY s.subject_code;
    `;
    try {
      const [rows] = await db.query(query, [lecturerId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  addSubjectToLecturer: async (lecturerId, subjectId) => {
    const checkQuery = `
      SELECT * FROM Lecturer_Assignments 
      WHERE lecturer_id = ? AND subject_id = ?
    `;
    const insertQuery = `
      INSERT INTO Lecturer_Assignments (lecturer_id, subject_id)
      VALUES (?, ?)
    `;
    
    try {
      const [existing] = await db.query(checkQuery, [lecturerId, subjectId]);
      
      if (existing.length > 0) {
        throw new Error('Giảng viên đã được phân môn này rồi');
      }
      
      const [result] = await db.execute(insertQuery, [lecturerId, subjectId]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  removeSubjectFromLecturer: async (lecturerId, subjectId) => {
    const query = `
      DELETE FROM Lecturer_Assignments 
      WHERE lecturer_id = ? AND subject_id = ?
    `;
    try {
      const [result] = await db.execute(query, [lecturerId, subjectId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Tìm giảng viên dạy môn học cho lớp và học kỳ cụ thể
  findLecturerForCourse: async (subjectId, classId, semester) => {
    const query = `
      SELECT lecturer_id 
      FROM Lecturer_Assignments
      WHERE subject_id = ? AND class_id = ? AND semester = ?
      LIMIT 1
    `;
    try {
      const [rows] = await db.query(query, [subjectId, classId, semester]);
      return rows.length > 0 ? rows[0].lecturer_id : null;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = lecturerModel;