const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const studentModel = require('../models/studentModel');
const lecturerModel = require('../models/lecturerModel');

const authController = {
  register: async (req, res) => {
    try {
      const { username, password, fullName, email, roleId } = req.body;

      if (!username || !password || !fullName || !email || !roleId) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin.' });
      }

      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUserId = await userModel.createUser(
        username,
        passwordHash,
        fullName,
        email,
        roleId
      );

      res.status(201).json({
        message: 'Đăng ký tài khoản thành công!',
        userId: newUserId,
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập username và password.' });
      }

      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Tên đăng nhập không tồn tại.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu không chính xác.' });
      }

      const payload = {
        userId: user.user_id,
        username: user.username,
        roleId: user.role_id,
      };

      if (user.role_id === 3) {
        const student = await studentModel.findByUserId(user.user_id);
        if (student) {
          payload.studentId = student.student_id;
        }
      }
      
      if (user.role_id === 2) {
        const lecturer = await lecturerModel.findByUserId(user.user_id);
        if (lecturer) {
          payload.lecturerId = lecturer.lecturer_id;
        }
      }

      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h', 
      });

      res.status(200).json({
        message: 'Đăng nhập thành công!',
        token: token,
        user: {
          userId: user.user_id,
          username: user.username,
          fullName: user.full_name,
          email: user.email,
          roleId: user.role_id,
          studentId: payload.studentId || null,
          lecturerId: payload.lecturerId || null,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getCurrentUser: async (req, res) => {
    try {
      const userInfo = {
        userId: req.user.userId,
        username: req.user.username,
        roleId: req.user.roleId,
      };
      res.status(200).json(userInfo);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = authController;