const db = require('../config/db');

const subjectModel = {
  create: async (subject_code, subject_name, credits) => {
    const query =
      'INSERT INTO Subjects (subject_code, subject_name, credits) VALUES (?, ?, ?)';
    try {
      const [result] = await db.execute(query, [
        subject_code,
        subject_name,
        credits,
      ]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    const query = 'SELECT * FROM Subjects ORDER BY subject_code';
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getById: async (subjectId) => {
    const query = 'SELECT * FROM Subjects WHERE subject_id = ?';
    try {
      const [rows] = await db.query(query, [subjectId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  update: async (subjectId, subject_code, subject_name, credits) => {
    const query =
      'UPDATE Subjects SET subject_code = ?, subject_name = ?, credits = ? WHERE subject_id = ?';
    try {
      const [result] = await db.execute(query, [
        subject_code,
        subject_name,
        credits,
        subjectId,
      ]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  delete: async (subjectId) => {
    const query = 'DELETE FROM Subjects WHERE subject_id = ?';
    try {
      const [result] = await db.execute(query, [subjectId]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy môn học đang học của sinh viên (có điểm)
  getEnrolledSubjects: async (studentId) => {
    const query = `
      SELECT DISTINCT s.subject_id, s.subject_code, s.subject_name, s.credits
      FROM Subjects s
      JOIN Grades g ON s.subject_id = g.subject_id
      WHERE g.student_id = ?
      ORDER BY s.subject_code
    `;
    try {
      const [rows] = await db.query(query, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = subjectModel;