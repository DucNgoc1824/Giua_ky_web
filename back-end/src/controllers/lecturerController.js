const userModel = require('../models/userModel');
const lecturerModel = require('../models/lecturerModel');
const bcrypt = require('bcryptjs');

const lecturerController = {
  createLecturer: async (req, res) => {
    try {
      const {
        username,
        password,
        full_name,
        email,
        lecturer_code,
        department,
      } = req.body;
      const roleId = 2;

      if (
        !username ||
        !password ||
        !full_name ||
        !email ||
        !lecturer_code ||
        !department
      ) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userData = { username, passwordHash, full_name, email, roleId };
      const lecturerData = { lecturer_code, department };

      const newUserId = await userModel.createUserAndLinkLecturer(
        userData,
        lecturerData
      );

      res.status(201).json({
        message: 'Tạo giảng viên thành công!',
        userId: newUserId,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res
          .status(409)
          .json({ message: 'Thông tin (username/email/mã GV) đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getAllLecturers: async (req, res) => {
    try {
      const lecturers = await lecturerModel.getAll();
      res.status(200).json(lecturers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getLecturerById: async (req, res) => {
    try {
      const { id } = req.params;
      const lecturer = await lecturerModel.getById(id);
      if (!lecturer) {
        return res.status(404).json({ message: 'Không tìm thấy giảng viên.' });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateLecturer: async (req, res) => {
     try {
      const { id } = req.params;
      const { full_name, email, department } = req.body;

      const lecturer = await lecturerModel.getById(id);
      if (!lecturer) {
        return res.status(404).json({ message: 'Không tìm thấy giảng viên.' });
      }

      const lecturerData = { full_name, email, department };
      
      await lecturerModel.update(id, lecturer.user_id, lecturerData);
      
      res.status(200).json({ message: 'Cập nhật thông tin giảng viên thành công.' });
    } catch (error) {
       if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  
  deleteLecturer: async (req, res) => {
    try {
      const { id } = req.params;

      const lecturer = await lecturerModel.getById(id);
      if (!lecturer) {
        return res.status(404).json({ message: 'Không tìm thấy giảng viên.' });
      }
      
      const affectedRows = await lecturerModel.delete(lecturer.user_id);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user liên kết.' });
      }
      res.status(200).json({ message: 'Xóa giảng viên thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getSubjectsByLecturer: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log('📚 Get Subjects by Lecturer');
      console.log('Lecturer ID:', id);
      console.log('👤 User:', req.user);
      
      const subjects = await lecturerModel.getSubjectsByLecturerId(id);
      console.log(`✅ Found ${subjects.length} subjects`);
      
      res.status(200).json(subjects);
    } catch (error) {
      console.error('❌ Get Subjects Error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy danh sách môn của giảng viên hiện tại (đang đăng nhập)
  getMySubjects: async (req, res) => {
    try {
      const lecturerId = req.user.lecturerId;
      
      if (!lecturerId) {
        return res.status(403).json({ message: 'Chỉ giảng viên mới có thể xem môn dạy' });
      }
      
      console.log('📚 Get My Subjects');
      console.log('Lecturer ID:', lecturerId);
      
      const subjects = await lecturerModel.getSubjectsByLecturerId(lecturerId);
      console.log(`✅ Found ${subjects.length} subjects`);
      
      res.status(200).json(subjects);
    } catch (error) {
      console.error('❌ Get My Subjects Error:', error.message);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  addSubjectToLecturer: async (req, res) => {
    try {
      const { id } = req.params;
      const { subject_id } = req.body;

      if (!subject_id) {
        return res.status(400).json({ message: 'Vui lòng cung cấp subject_id' });
      }

      await lecturerModel.addSubjectToLecturer(id, subject_id);
      res.status(201).json({ message: 'Đã thêm môn dạy cho giảng viên thành công' });
    } catch (error) {
      if (error.message === 'Giảng viên đã được phân môn này rồi') {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  removeSubjectFromLecturer: async (req, res) => {
    try {
      const { id, subjectId } = req.params;
      
      const affectedRows = await lecturerModel.removeSubjectFromLecturer(id, subjectId);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy môn này trong danh sách môn dạy của giảng viên' });
      }
      
      res.status(200).json({ message: 'Đã xóa môn dạy thành công' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = lecturerController;