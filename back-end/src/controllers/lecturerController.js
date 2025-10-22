const userModel = require('../models/userModel');
const lecturerModel = require('../models/lecturerModel');
const bcrypt = require('bcryptjs');

const lecturerController = {
  // 1. Tạo Giảng viên mới
  createLecturer: async (req, res) => {
    try {
      // SỬA DÒNG NÀY:
      const {
        username,
        password,
        full_name, // <-- Sửa
        email,
        lecturer_code, // <-- Sửa
        department,
      } = req.body;
      const roleId = 2; // role 'lecturer'

      if (
        !username ||
        !password ||
        !full_name || // <-- Sửa
        !email ||
        !lecturer_code || // <-- Sửa
        !department
      ) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // SỬA BIẾN NÀY:
      const userData = { username, passwordHash, full_name, email, roleId };
      // SỬA BIẾN NÀY:
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

  // 2. Lấy tất cả giảng viên
  getAllLecturers: async (req, res) => {
    try {
      const lecturers = await lecturerModel.getAll();
      res.status(200).json(lecturers);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. Lấy 1 giảng viên
  getLecturerById: async (req, res) => {
    try {
      const { id } = req.params; // id này là lecturer_id
      const lecturer = await lecturerModel.getById(id);
      if (!lecturer) {
        return res.status(404).json({ message: 'Không tìm thấy giảng viên.' });
      }
      res.status(200).json(lecturer);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 4. Cập nhật giảng viên
  updateLecturer: async (req, res) => {
     try {
      const { id } = req.params; // lecturer_id
      // SỬA DÒNG NÀY:
      const { full_name, email, department } = req.body;

      const lecturer = await lecturerModel.getById(id);
      if (!lecturer) {
        return res.status(404).json({ message: 'Không tìm thấy giảng viên.' });
      }

      // SỬA BIẾN NÀY:
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
  
  // 5. Xóa giảng viên
  deleteLecturer: async (req, res) => {
    try {
      const { id } = req.params; // lecturer_id

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
  }
};

module.exports = lecturerController;