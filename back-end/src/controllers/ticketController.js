const ticketModel = require('../models/ticketModel');
const studentModel = require('../models/studentModel');
const lecturerModel = require('../models/lecturerModel');

const ticketController = {
  createTicket: async (req, res) => {
    try {
      console.log('📨 Nhận request tạo ticket:', req.body);
      console.log('👤 User info:', req.user);
      
      const student_id = req.user.studentId; 
      const { subject_id, semester, message_text } = req.body;

      if (!subject_id || !semester || !message_text) {
        console.log('❌ Thiếu thông tin:', { subject_id, semester, message_text });
        return res
          .status(400)
          .json({ message: 'Vui lòng chọn Môn, nhập Học kỳ và Nội dung.' });
      }
      
      if (message_text.length > 255) {
         return res.status(400).json({ message: 'Tin nhắn không được quá 255 ký tự.' });
      }

      console.log('🔍 Tìm class_id cho student_id:', student_id);
      const class_id = await studentModel.getClassId(student_id);
      console.log('📚 Class ID:', class_id);
      
      if (!class_id) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin lớp của sinh viên.' });
      }

      console.log('🔍 Tìm giảng viên cho:', { subject_id, class_id, semester });
      const lecturer_id = await lecturerModel.findLecturerForCourse(
        subject_id,
        class_id,
        semester
      );
      console.log('👨‍🏫 Lecturer ID:', lecturer_id);

      // Nếu không tìm thấy giảng viên phân công, cho phép gửi với lecturer_id = null
      // Ticket sẽ được gửi tới hệ thống chung
      console.log('💾 Tạo ticket với:', { student_id, subject_id, lecturer_id: lecturer_id || null, message_text });
      const newTicketId = await ticketModel.create(
        student_id,
        subject_id,
        lecturer_id || null,
        message_text
      );
      console.log('✅ Tạo ticket thành công, ID:', newTicketId);

      res
        .status(201)
        .json({ message: 'Gửi thắc mắc thành công!', ticketId: newTicketId });
    } catch (error) {
      console.error('❌ Lỗi tạo ticket:', error);
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
      res.status(200).json({
        success: true,
        data: tickets
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server', 
        error: error.message 
      });
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

  // Phản hồi ticket (Giảng viên)
  respondToTicket: async (req, res) => {
    try {
      const { ticket_id } = req.params;
      const { response_text } = req.body;

      if (!response_text || response_text.trim() === '') {
        return res.status(400).json({ message: 'Vui lòng nhập nội dung phản hồi.' });
      }

      const affectedRows = await ticketModel.respondToTicket(ticket_id, response_text);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy ticket.' });
      }

      res.status(200).json({ message: 'Phản hồi thành công!' });
    } catch (error) {
      console.error('❌ Lỗi phản hồi ticket:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy chi tiết ticket
  getTicketById: async (req, res) => {
    try {
      const { ticket_id } = req.params;
      const ticket = await ticketModel.getById(ticket_id);
      
      if (!ticket) {
        return res.status(404).json({ message: 'Không tìm thấy ticket.' });
      }

      res.status(200).json(ticket);
    } catch (error) {
      console.error('❌ Lỗi lấy chi tiết ticket:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = ticketController;