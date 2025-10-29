const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const otpManager = require('../utils/otpStore');
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

  // Step 1: Request OTP (forgot password)
  requestPasswordReset: async (req, res) => {
    try {
      const { username } = req.body;

      if (!username) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập.' });
      }

      // Check if user exists
      const user = await userModel.findUserByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'Tên đăng nhập không tồn tại.' });
      }

      // Get email (masked for privacy)
      const email = user.email;
      const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (match, p1, p2, p3) => {
        return p1 + '*'.repeat(p2.length) + p3;
      });

      // Generate OTP
      const otp = otpManager.generateOTP();
      otpManager.storeOTP(username, otp);

      // In production: Send email with OTP
      // For now: Return OTP in response (ONLY FOR DEVELOPMENT)
      console.log(`📧 OTP for ${username}: ${otp}`);

      res.status(200).json({
        message: 'Mã OTP đã được tạo thành công.',
        maskedEmail,
        otp // REMOVE THIS IN PRODUCTION!
      });
    } catch (error) {
      console.error('❌ Lỗi request password reset:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Step 2: Verify OTP and reset password
  resetPassword: async (req, res) => {
    try {
      const { username, otp, newPassword } = req.body;

      if (!username || !otp || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
      }

      // Verify OTP
      const otpResult = otpManager.verifyOTP(username, otp);
      if (!otpResult.success) {
        return res.status(400).json({ message: otpResult.message });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const newPasswordHash = await bcrypt.hash(newPassword, salt);

      // Update password
      const affectedRows = await userModel.updatePassword(username, newPasswordHash);
      
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không thể cập nhật mật khẩu.' });
      }

      console.log(`✅ Password reset successful for: ${username}`);
      res.status(200).json({ message: 'Đặt lại mật khẩu thành công!' });
    } catch (error) {
      console.error('❌ Lỗi reset password:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = authController;