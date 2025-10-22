const userModel = require('../models/userModel'); // Cần để tạo user
const studentModel = require('../models/studentModel'); // Cần để CRUD student
const bcrypt = require('bcryptjs');

const studentController = {
  // 1. Tạo Sinh viên mới
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
      const roleId = 3; // 3 là role 'student'

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

      // Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const userData = { username, passwordHash, fullName, email, roleId };
      const studentData = { studentCode, classId };

      // Gọi hàm transaction
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
        // Lỗi này có thể do trùng username, email hoặc student_code
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

  // 2. Lấy tất cả sinh viên
  getAllStudents: async (req, res) => {
    try {
      const students = await studentModel.getAll();
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. Lấy 1 sinh viên
  getStudentById: async (req, res) => {
    try {
      const { id } = req.params; // id này là student_id
      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 4. Cập nhật sinh viên
  updateStudent: async (req, res) => {
     try {
      const { id } = req.params; 
      // SỬA DÒNG NÀY:
      const { full_name, email, date_of_birth, address } = req.body;

      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }

      // SỬA BIẾN NÀY:
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
  
  // 5. Xóa sinh viên
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params; // student_id

      // Lấy thông tin user_id từ student_id
      const student = await studentModel.getById(id);
      if (!student) {
        return res.status(404).json({ message: 'Không tìm thấy sinh viên.' });
      }
      
      // Chúng ta xóa user, student sẽ tự xóa theo
      const affectedRows = await studentModel.delete(student.user_id); 
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy user liên kết.' });
      }
      res.status(200).json({ message: 'Xóa sinh viên thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = studentController;