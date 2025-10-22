const db = require('../config/db');

const ticketModel = {
  // 1. (SV) Tạo Ticket mới
  create: async (student_id, subject_id, lecturer_id, message_text) => {
    const query = `
      INSERT INTO Tickets (student_id, subject_id, lecturer_id, message_text, status)
      VALUES (?, ?, ?, ?, 'Mới')
    `;
    try {
      // lecturer_id có thể là null (nếu Admin chưa phân công)
      const [result] = await db.execute(query, [
        student_id,
        subject_id,
        lecturer_id,
        message_text,
      ]);
      return result.insertId;
    } catch (error) {
      console.error('Lỗi khi tạo ticket:', error);
      throw error;
    }
  },

  // 2. (SV) Xem các ticket mình đã gửi
  findByStudent: async (student_id) => {
    const query = `
      SELECT 
        t.ticket_id, t.message_text, t.status, t.created_at,
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
      console.error('Lỗi khi SV lấy tickets:', error);
      throw error;
    }
  },

  // 3. (GV) Xem các ticket gửi đến mình
  findByLecturer: async (lecturer_id) => {
    const query = `
      SELECT 
        t.ticket_id, t.message_text, t.status, t.created_at,
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
      console.error('Lỗi khi GV lấy tickets:', error);
      throw error;
    }
  },
  
  // (Chúng ta có thể thêm hàm updateStatus (GV) sau)
};

module.exports = ticketModel;