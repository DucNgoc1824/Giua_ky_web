const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const userController = {
  // GET /users/profile - Get current user profile
  getProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const profile = await userModel.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
      }

      // Remove sensitive data
      delete profile.password_hash;

      res.status(200).json(profile);
    } catch (error) {
      console.error('❌ Error getting profile:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // PUT /users/profile - Update user profile
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { full_name, email, phone, date_of_birth, address, department, position } = req.body;

      // Update basic user info
      await userModel.updateUserProfile(userId, { full_name, email, phone });

      // Update role-specific info
      if (req.user.roleId === 3 && req.user.studentId) {
        // Student
        await userModel.updateStudentInfo(req.user.studentId, { date_of_birth, address });
      } else if (req.user.roleId === 2 && req.user.lecturerId) {
        // Lecturer
        await userModel.updateLecturerInfo(req.user.lecturerId, { department, position });
      }

      res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // PUT /users/change-password - Change password
  changePassword: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
      }

      // Get current user
      const user = await userModel.findUserByUsername(req.user.username);
      
      if (!user) {
        return res.status(404).json({ message: 'Không tìm thấy người dùng' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng' });
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await userModel.updatePassword(userId, newPasswordHash);

      res.status(200).json({ message: 'Đổi mật khẩu thành công!' });
    } catch (error) {
      console.error('❌ Error changing password:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = userController;
