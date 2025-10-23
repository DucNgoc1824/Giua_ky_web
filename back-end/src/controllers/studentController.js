const userModel = require('../models/userModel');
const studentModel = require('../models/studentModel');
const bcrypt = require('bcryptjs');

const studentController = {
  createStudent: async (req, res) => {
    try {
      const {
        username,
        password,
        fullName,
        email,
        studentCode,
        classId,
      } = req.body;
      const roleId = 3;

      if (
        !username ||
        !password ||
        !fullName ||
        !email ||
        !studentCode ||
        !classId
      ) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userData = { username, passwordHash, fullName, email, roleId };
      const studentData = { studentCode, classId };

      const newUserId = await userModel.createUserAndLinkStudent(
        userData,
        studentData
      );

      res.status(201).json({
        message: 'Tạo sinh viên thành công!',
        userId: newUserId,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res
          .status(409)
          .json({ message: 'Thông tin (username/email/mã SV) đã tồn tại.' });
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res
          .status(404)
          .json({ message: 'Không tìm thấy Lớp học (classId) này.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getAllStudents: async (req, res) => {
    try {
      const students = await studentModel.getAll();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;
      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateStudent: async (req, res) => {
     try {
      const { id } = req.params; 
      const { full_name, email, date_of_birth, address } = req.body;

      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }

      const studentData = { full_name, email, date_of_birth, address };
      
      await studentModel.update(id, student.user_id, studentData);
      
      res.status(200).json({ message: 'Cập nhật thông tin sinh viên thành công.' });
    } catch (error) {
       if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Email đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;

      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }
      
      const affectedRows = await studentModel.delete(student.user_id); 
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user liên kết.' });
      }
      res.status(200).json({ message: 'Xóa sinh viên thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  searchStudents: async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: 'Vui lòng nhập từ khóa tìm kiếm.' });
      }
      const students = await studentModel.searchByName(q);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = studentController;