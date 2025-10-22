const ticketModel = require('../models/ticketModel');
const studentModel = require('../models/studentModel');
const assignmentModel = require('../models/assignmentModel');

const ticketController = {
  // 1. (SV) Tạo Ticket
  createTicket: async (req, res) => {
    try {
      // Lấy từ Token
      const student_id = req.user.studentId; 
      // Lấy từ Form
      const { subject_id, semester, message_text } = req.body;

      if (!subject_id || !semester || !message_text) {
        return res
          .status(400)
          .json({ message: 'Vui lòng chọn Môn, nhập Học kỳ và Nội dung.' });
      }
      
      if (message_text.length > 255) {
         return res.status(400).json({ message: 'Tin nhắn không được quá 255 ký tự.' });
      }

      // 1. Tìm Lớp của SV
      const class_id = await studentModel.getClassId(student_id);
      if (!class_id) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin lớp của sinh viên.' });
      }

      // 2. Tìm GV được phân công
      const lecturer_id = await assignmentModel.findLecturerForCourse(
        subject_id,
        class_id,
        semester
      );
      // lecturer_id có thể là null nếu Admin chưa phân công

      // 3. Tạo Ticket
      const newTicketId = await ticketModel.create(
        student_id,
        subject_id,
        lecturer_id, // Gửi null nếu không tìm thấy
        message_text
      );

      res
        .status(201)
        .json({ message: 'Gửi hỏi đáp/khiếu nại thành công!', ticketId: newTicketId });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res.status(404).json({ message: 'Không tìm thấy Môn học này.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 2. (SV) Lấy các ticket đã gửi
  getMyTickets: async (req, res) => {
    try {
      const student_id = req.user.studentId;
      const tickets = await ticketModel.findByStudent(student_id);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. (GV) Lấy "Hòm thư"
  getTicketInbox: async (req, res) => {
    try {
      const lecturer_id = req.user.lecturerId;
      const tickets = await ticketModel.findByLecturer(lecturer_id);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = ticketController;