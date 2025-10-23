const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  verifyToken: (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token. Yêu cầu truy cập bị từ chối.' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Token không hợp lệ.' });
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user && req.user.roleId === 1) {
      next();
    } else {
      return res.status(403).json({ message: 'Yêu cầu quyền Admin.' });
    }
  },
  isLecturerOrAdmin: (req, res, next) => {
    if (req.user && (req.user.roleId === 2 || req.user.roleId === 1)) {
      next();
    } else {
      return res.status(403).json({ message: 'Yêu cầu quyền Giảng viên hoặc Admin.' });
    }
  },

  // Middleware kiểm tra vai trò Sinh viên
  isStudent: (req, res, next) => {
    // roleId = 3 (Sinh viên)
    if (req.user && req.user.roleId === 3) {
      next();
    } else {
      return res.status(403).json({ message: 'Yêu cầu quyền Sinh viên.' });
    }
  },
   // (Tương tự, bạn có thể tạo isLecturer, isStudent nếu cần)
};

module.exports = authMiddleware;