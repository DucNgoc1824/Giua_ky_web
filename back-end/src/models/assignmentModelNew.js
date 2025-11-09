const db = require('../config/db');

const assignmentModel = {
  // ============ ASSIGNMENTS (Bài tập) ============
  
  // Tạo bài tập mới
  createAssignment: async (data) => {
    const { title, description, due_date, subject_id, lecturer_id } = data;
    const query = `
      INSERT INTO Assignments (title, description, due_date, subject_id, lecturer_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      const [result] = await db.execute(query, [title, description, due_date, subject_id, lecturer_id]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách bài tập của giảng viên
  getAssignmentsByLecturer: async (lecturer_id) => {
    const query = `
      SELECT 
        a.assignment_id,
        a.title,
        a.description,
        a.due_date,
        a.created_at,
        s.subject_name,
        s.subject_code,
        COUNT(DISTINCT sub.submission_id) AS total_submissions
      FROM Assignments a
      JOIN Subjects s ON a.subject_id = s.subject_id
      LEFT JOIN Submissions sub ON a.assignment_id = sub.assignment_id
      WHERE a.lecturer_id = ?
      GROUP BY a.assignment_id
      ORDER BY a.due_date DESC
    `;
    try {
      const [rows] = await db.query(query, [lecturer_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách bài tập của sinh viên (theo môn học mà sinh viên đang học)
  getAssignmentsByStudent: async (student_id) => {
    const query = `
      SELECT 
        a.assignment_id,
        a.title,
        a.description,
        a.due_date,
        a.created_at,
        s.subject_name,
        s.subject_code,
        u.full_name AS lecturer_name,
        sub.submission_id,
        sub.submitted_at,
        sub.score,
        sub.status,
        CASE 
          WHEN sub.submission_id IS NOT NULL THEN 'submitted'
          WHEN NOW() > a.due_date THEN 'overdue'
          ELSE 'pending'
        END AS submission_status
      FROM Assignments a
      JOIN Subjects s ON a.subject_id = s.subject_id
      JOIN Lecturers l ON a.lecturer_id = l.lecturer_id
      JOIN Users u ON l.user_id = u.user_id
      JOIN Students st ON st.student_id = ?
      LEFT JOIN Submissions sub ON a.assignment_id = sub.assignment_id AND sub.student_id = ?
      WHERE s.subject_id IN (
        SELECT DISTINCT subject_id 
        FROM Grades 
        WHERE student_id = ?
      )
      ORDER BY a.due_date DESC
    `;
    try {
      const [rows] = await db.query(query, [student_id, student_id, student_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết bài tập
  getAssignmentById: async (assignment_id) => {
    const query = `
      SELECT 
        a.*,
        s.subject_name,
        s.subject_code,
        u.full_name AS lecturer_name
      FROM Assignments a
      JOIN Subjects s ON a.subject_id = s.subject_id
      JOIN Lecturers l ON a.lecturer_id = l.lecturer_id
      JOIN Users u ON l.user_id = u.user_id
      WHERE a.assignment_id = ?
    `;
    try {
      const [rows] = await db.query(query, [assignment_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật bài tập
  updateAssignment: async (assignment_id, data) => {
    const { title, description, due_date } = data;
    const query = `
      UPDATE Assignments 
      SET title = ?, description = ?, due_date = ?
      WHERE assignment_id = ?
    `;
    try {
      const [result] = await db.execute(query, [title, description, due_date, assignment_id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Xóa bài tập
  deleteAssignment: async (assignment_id) => {
    const query = 'DELETE FROM Assignments WHERE assignment_id = ?';
    try {
      const [result] = await db.execute(query, [assignment_id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // ============ SUBMISSIONS (Bài nộp) ============

  // Nộp bài
  submitAssignment: async (data) => {
    const { assignment_id, student_id, file_path, submission_text } = data;
    const query = `
      INSERT INTO Submissions (assignment_id, student_id, file_path, submission_text)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        file_path = VALUES(file_path),
        submission_text = VALUES(submission_text),
        submitted_at = CURRENT_TIMESTAMP
    `;
    try {
      const [result] = await db.execute(query, [assignment_id, student_id, file_path, submission_text]);
      return result.insertId || result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách bài nộp của 1 bài tập
  getSubmissionsByAssignment: async (assignment_id) => {
    const query = `
      SELECT 
        sub.submission_id,
        sub.file_path,
        sub.submission_text,
        sub.submitted_at,
        sub.score,
        sub.feedback,
        sub.status,
        st.student_code,
        u.full_name AS student_name,
        c.class_code
      FROM Submissions sub
      JOIN Students st ON sub.student_id = st.student_id
      JOIN Users u ON st.user_id = u.user_id
      LEFT JOIN Classes c ON st.class_id = c.class_id
      WHERE sub.assignment_id = ?
      ORDER BY sub.submitted_at DESC
    `;
    try {
      const [rows] = await db.query(query, [assignment_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Chấm điểm bài nộp
  gradeSubmission: async (submission_id, score, feedback) => {
    const query = `
      UPDATE Submissions 
      SET score = ?, feedback = ?, status = 'graded'
      WHERE submission_id = ?
    `;
    try {
      const [result] = await db.execute(query, [score, feedback, submission_id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Alias cho Android app (sử dụng getAssignmentsByStudent)
  getAssignmentsByStudentId: async (student_id) => {
    return assignmentModel.getAssignmentsByStudent(student_id);
  },
};

module.exports = assignmentModel;
