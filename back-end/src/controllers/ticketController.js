const ticketModel = require('../models/ticketModel');
const studentModel = require('../models/studentModel');
const assignmentModel = require('../models/assignmentModel');

const ticketController = {
  createTicket: async (req, res) => {
    try {
      const student_id = req.user.studentId; 
      const { subject_id, semester, message_text } = req.body;

      if (!subject_id || !semester || !message_text) {
        return res
          .status(400)
          .json({ message: 'Vui lòng chọn Môn, nhập Học kỳ và Nội dung.' });
      }
      
      if (message_text.length > 255) {
         return res.status(400).json({ message: 'Tin nhắn không được quá 255 ký tự.' });
      }

      const class_id = await studentModel.getClassId(student_id);
      if (!class_id) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin lớp của sinh viên.' });
      }

      const lecturer_id = await assignmentModel.findLecturerForCourse(
        subject_id,
        class_id,
        semester
      );

      const newTicketId = await ticketModel.create(
        student_id,
        subject_id,
        lecturer_id,
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

  getMyTickets: async (req, res) => {
    try {
      const student_id = req.user.studentId;
      const tickets = await ticketModel.findByStudent(student_id);
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

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