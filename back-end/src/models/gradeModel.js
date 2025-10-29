const db = require('../config/db');

const gradeModel = {
  upsert: async (student_id, subject_id, semester, attendanceScore, practiceScore, midtermScore, finalScore) => {
    const query = `
      INSERT INTO Grades (student_id, subject_id, semester, attendance_score, practice_score, midterm_score, final_score)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        attendance_score = VALUES(attendance_score),
        practice_score = VALUES(practice_score),
        midterm_score = VALUES(midterm_score),
        final_score = VALUES(final_score);
    `;
    try {
      const [result] = await db.execute(query, [
        student_id,
        subject_id,
        semester,
        attendanceScore,
        practiceScore,
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
        g.attendance_score,
        g.practice_score,
        g.midterm_score,
        g.final_score,
        g.total_score,
        g.letter_grade,
        g.gpa_score
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
        g.attendance_score,
        g.practice_score,
        g.midterm_score,
        g.final_score,
        g.total_score,
        g.letter_grade,
        g.gpa_score
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
        g.attendance_score,
        g.practice_score,
        g.midterm_score,
        g.final_score,
        g.total_score,
        g.letter_grade,
        g.gpa_score
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
  },
};

module.exports = gradeModel;

module.exports = gradeModel;