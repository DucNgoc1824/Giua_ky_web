const db = require('../config/db');

const ticketModel = {
  create: async (student_id, subject_id, lecturer_id, message_text) => {
    const query = `
      INSERT INTO Tickets (student_id, subject_id, lecturer_id, message_text, status)
      VALUES (?, ?, ?, ?, 'Mới')
    `;
    try {
      const [result] = await db.execute(query, [
        student_id,
        subject_id,
        lecturer_id,
        message_text,
      ]);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  },

  findByStudent: async (student_id) => {
    const query = `
      SELECT 
        t.ticket_id, t.message_text, t.status, t.created_at,
        t.response_text, t.response_at,
        s.subject_name
      FROM Tickets t
      JOIN Subjects s ON t.subject_id = s.subject_id
      WHERE t.student_id = ?
      ORDER BY t.created_at DESC;
    `;
    try {
      const [rows] = await db.query(query, [student_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  findByLecturer: async (lecturer_id) => {
    const query = `
      SELECT 
        t.ticket_id, t.message_text, t.response_text, t.response_at,
        t.status, t.created_at,
        s.subject_name,
        u.full_name AS student_name,
        c.class_code
      FROM Tickets t
      JOIN Subjects s ON t.subject_id = s.subject_id
      JOIN Students st ON t.student_id = st.student_id
      JOIN Users u ON st.user_id = u.user_id
      JOIN Classes c ON st.class_id = c.class_id
      WHERE t.lecturer_id = ?
      ORDER BY t.created_at DESC;
    `;
    try {
      const [rows] = await db.query(query, [lecturer_id]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Phản hồi ticket
  respondToTicket: async (ticket_id, response_text) => {
    const query = `
      UPDATE Tickets 
      SET response_text = ?, 
          response_at = NOW(),
          status = 'Đã phản hồi'
      WHERE ticket_id = ?
    `;
    try {
      const [result] = await db.execute(query, [response_text, ticket_id]);
      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  },

  // Lấy chi tiết ticket
  getById: async (ticket_id) => {
    const query = `
      SELECT 
        t.ticket_id, t.message_text, t.response_text, t.response_at,
        t.status, t.created_at,
        s.subject_name, s.subject_code,
        u.full_name AS student_name,
        st.student_code,
        c.class_code
      FROM Tickets t
      JOIN Subjects s ON t.subject_id = s.subject_id
      JOIN Students st ON t.student_id = st.student_id
      JOIN Users u ON st.user_id = u.user_id
      JOIN Classes c ON st.class_id = c.class_id
      WHERE t.ticket_id = ?
    `;
    try {
      const [rows] = await db.query(query, [ticket_id]);
      return rows[0] || null;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = ticketModel;