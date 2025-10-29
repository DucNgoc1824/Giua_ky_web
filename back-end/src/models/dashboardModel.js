const db = require('../config/db');

const dashboardModel = {
  getStudentCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Students');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  getLecturerCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Lecturers');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  getClassCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Classes');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },
  
  getSubjectCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Subjects');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Thống kê cho Admin Dashboard
  getGradeDistribution: async () => {
    try {
      const [rows] = await db.query(`
        SELECT 
          letter_grade,
          COUNT(*) as count
        FROM Grades
        WHERE letter_grade IS NOT NULL
        GROUP BY letter_grade
        ORDER BY 
          CASE letter_grade
            WHEN 'A+' THEN 1
            WHEN 'A' THEN 2
            WHEN 'B+' THEN 3
            WHEN 'B' THEN 4
            WHEN 'C+' THEN 5
            WHEN 'C' THEN 6
            WHEN 'D+' THEN 7
            WHEN 'D' THEN 8
            WHEN 'F' THEN 9
          END
      `);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getAverageGPA: async () => {
    try {
      const [rows] = await db.query(`
        SELECT ROUND(AVG(gpa_score), 2) as avg_gpa
        FROM Grades
        WHERE gpa_score IS NOT NULL
      `);
      return rows[0].avg_gpa || 0;
    } catch (error) {
      throw error;
    }
  },

  // Thống kê cho Lecturer Dashboard
  getLecturerStats: async (lecturerId) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          COUNT(DISTINCT la.class_id) as class_count,
          COUNT(DISTINCT s.student_id) as student_count,
          (
            SELECT COUNT(*) 
            FROM Grades g
            JOIN Students st ON g.student_id = st.student_id
            JOIN Lecturer_Assignments la2 ON st.class_id = la2.class_id
            WHERE la2.lecturer_id = ? AND g.subject_id IN (
              SELECT subject_id FROM Lecturer_Subjects WHERE lecturer_id = ?
            )
          ) as total_grades,
          (
            SELECT ROUND(AVG(g.total_score), 2)
            FROM Grades g
            JOIN Students st ON g.student_id = st.student_id
            JOIN Lecturer_Assignments la2 ON st.class_id = la2.class_id
            WHERE la2.lecturer_id = ? AND g.subject_id IN (
              SELECT subject_id FROM Lecturer_Subjects WHERE lecturer_id = ?
            ) AND g.total_score IS NOT NULL
          ) as avg_score
        FROM Lecturer_Assignments la
        LEFT JOIN Students s ON s.class_id = la.class_id
        WHERE la.lecturer_id = ?
      `, [lecturerId, lecturerId, lecturerId, lecturerId, lecturerId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getLecturerGradeDistribution: async (lecturerId) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          g.letter_grade,
          COUNT(*) as count
        FROM Grades g
        JOIN Students s ON g.student_id = s.student_id
        JOIN Lecturer_Assignments la ON s.class_id = la.class_id
        WHERE la.lecturer_id = ? 
          AND g.subject_id IN (SELECT subject_id FROM Lecturer_Subjects WHERE lecturer_id = ?)
          AND g.letter_grade IS NOT NULL
        GROUP BY g.letter_grade
        ORDER BY 
          CASE g.letter_grade
            WHEN 'A+' THEN 1
            WHEN 'A' THEN 2
            WHEN 'B+' THEN 3
            WHEN 'B' THEN 4
            WHEN 'C+' THEN 5
            WHEN 'C' THEN 6
            WHEN 'D+' THEN 7
            WHEN 'D' THEN 8
            WHEN 'F' THEN 9
          END
      `, [lecturerId, lecturerId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Thống kê cho Student Dashboard
  getStudentStats: async (studentId) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          ROUND(AVG(g.gpa_score), 2) as gpa,
          COUNT(DISTINCT g.subject_id) as subject_count,
          COUNT(*) as total_grades,
          ROUND(AVG(g.attendance_score), 1) as avg_attendance
        FROM Grades g
        WHERE g.student_id = ? AND g.gpa_score IS NOT NULL
      `, [studentId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  getStudentGradesBySubject: async (studentId) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          subj.subject_code,
          subj.subject_name,
          g.total_score,
          g.letter_grade,
          g.gpa_score
        FROM Grades g
        JOIN Subjects subj ON g.subject_id = subj.subject_id
        WHERE g.student_id = ? AND g.total_score IS NOT NULL
        ORDER BY subj.subject_code
      `, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  getStudentGradeTrend: async (studentId) => {
    try {
      const [rows] = await db.query(`
        SELECT 
          g.semester,
          ROUND(AVG(g.gpa_score), 2) as avg_gpa,
          ROUND(AVG(g.total_score), 2) as avg_score
        FROM Grades g
        WHERE g.student_id = ? AND g.gpa_score IS NOT NULL
        GROUP BY g.semester
        ORDER BY g.semester
      `, [studentId]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = dashboardModel;