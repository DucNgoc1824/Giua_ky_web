const db = require('../config/db');

const gradeModel = {
  upsert: async (student_id, subject_id, semester, midtermScore, finalScore) => {
    const query = `
      INSERT INTO Grades (student_id, subject_id, semester, midterm_score, final_score)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        midterm_score = VALUES(midterm_score),
        final_score = VALUES(final_score);
    `;
    try {
      const [result] = await db.execute(query, [
        student_id,
        subject_id,
        semester,
        midtermScore,
        finalScore,
      ]);
      return result;
    } catch (error) {
      throw error;
    }
  },

  findByStudentId: async (studentId) => {
    const query = `
      SELECT 
        g.semester,
        s.subject_id, 
        s.subject_code,
        s.subject_name,
        s.credits,
        g.midterm_score,
        g.final_score
      FROM Grades g
      JOIN Subjects s ON g.subject_id = s.subject_id
      WHERE g.student_id = ?
      ORDER BY g.semester, s.subject_name;
    `;
    try {
      const [rows] = await db.query(query, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  
  findBySubjectAndSemester: async (subjectId, semester) => {
    const query = `
      SELECT 
        st.student_id,
        st.student_code,
        u.full_name AS student_name,
        c.class_code,
        g.midterm_score,
        g.final_score,
        ROUND((COALESCE(g.midterm_score, 0) * 0.4 + COALESCE(g.final_score, 0) * 0.6), 2) AS average_score
      FROM Students st
      JOIN Users u ON st.user_id = u.user_id
      JOIN Classes c ON st.class_id = c.class_id
      LEFT JOIN Grades g ON st.student_id = g.student_id 
        AND g.subject_id = ? 
        AND g.semester = ?
      ORDER BY c.class_code, st.student_code;
    `;
    try {
      const [rows] = await db.query(query, [subjectId, semester]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  findBySubject: async (subjectId) => {
    const query = `
      SELECT 
        g.semester,
        st.student_id,
        st.student_code,
        u.full_name AS student_name,
        c.class_code,
        g.midterm_score,
        g.final_score,
        ROUND((COALESCE(g.midterm_score, 0) * 0.4 + COALESCE(g.final_score, 0) * 0.6), 2) AS average_score
      FROM Grades g
      JOIN Students st ON g.student_id = st.student_id
      JOIN Users u ON st.user_id = u.user_id
      JOIN Classes c ON st.class_id = c.class_id
      WHERE g.subject_id = ?
      ORDER BY g.semester DESC, c.class_code, st.student_code;
    `;
    try {
      const [rows] = await db.query(query, [subjectId]);
      return rows;
    } catch (error) {
      throw error;
    }
  }
};

module.exports = gradeModel;