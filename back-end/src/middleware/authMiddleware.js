const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = {
  // Middleware kiểm tra token
  verifyToken: (req, res, next) => {
    // 1. Lấy token từ header của request
    // Token thường được gửi theo dạng: "Bearer [token_string]"
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách lấy phần token

    // 2. Nếu không có token -> Chặn
    if (!token) {
      return res.status(401).json({ message: 'Không tìm thấy token. Yêu cầu truy cập bị từ chối.' });
    }

    // 3. Nếu có token -> Kiểm tra tính hợp lệ
    try {
      // Giải mã token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Lưu thông tin user (đã giải mã) vào request
      // để các hàm controller phía sau có thể sử dụng
      req.user = decoded; 

      next(); // Cho phép request đi tiếp
    } catch (error) {
      // Nếu token không hợp lệ (hết hạn, sai chữ ký...)
      return res.status(403).json({ message: 'Token không hợp lệ.' });
    }
  },

  // Middleware kiểm tra vai trò Admin
  isAdmin: (req, res, next) => {
    // Middleware này phải chạy *sau* verifyToken
    // vì nó cần req.user
    if (req.user && req.user.roleId === 1) { // 1 là role_id của admin
      next(); // Là admin, cho đi tiếp
    } else {
      return res.status(403).json({ message: 'Yêu cầu quyền Admin.' });
    }
  },
  // Middleware kiểm tra vai trò Giảng viên (hoặc Admin)
  isLecturerOrAdmin: (req, res, next) => {
    // roleId = 2 (Giảng viên) hoặc 1 (Admin)
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