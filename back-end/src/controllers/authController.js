const bcrypt = require('bcryptjs'); // Thư viện mã hóa mật khẩu
const jwt = require('jsonwebtoken'); // Thư viện tạo Token
const userModel = require('../models/userModel'); // Import model
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET; // Lấy khóa bí mật từ file .env
const studentModel = require('../models/studentModel');
const lecturerModel = require('../models/lecturerModel');

const authController = {
  // === 1. ĐĂNG KÝ ===
  register: async (req, res) => {
    try {
      const { username, password, fullName, email, roleId } = req.body;

      // 1. Kiểm tra dữ liệu đầu vào
      if (!username || !password || !fullName || !email || !roleId) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ thông tin.' });
      }

      // 2. Kiểm tra xem username hoặc email đã tồn tại chưa
      const existingUser = await userModel.findUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: 'Tên đăng nhập đã tồn tại.' });
      }
      // (Bạn nên thêm cả bước kiểm tra email tồn tại tương tự)

      // 3. Mã hóa mật khẩu
      const salt = await bcrypt.genSalt(10); // Tạo "muối"
      const passwordHash = await bcrypt.hash(password, salt); // Băm mật khẩu

      // 4. Lưu user mới vào CSDL (sử dụng model)
      const newUserId = await userModel.createUser(
        username,
        passwordHash,
        fullName,
        email,
        roleId
      );

      // 5. Trả về thành công
      res.status(201).json({
        message: 'Đăng ký tài khoản thành công!',
        userId: newUserId,
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // === 2. ĐĂNG NHẬP ===
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

      // === PHẦN CẬP NHẬT ===
      // Tạo payload cơ bản
      const payload = {
        userId: user.user_id,
        username: user.username,
        roleId: user.role_id,
      };

      // Nếu là Sinh viên (roleId = 3), lấy student_id
      if (user.role_id === 3) {
        const student = await studentModel.findByUserId(user.user_id);
        if (student) {
          payload.studentId = student.student_id; // Thêm studentId vào token
        }
      }
      
      // Nếu là Giảng viên (roleId = 2), lấy lecturer_id
      if (user.role_id === 2) {
        const lecturer = await lecturerModel.findByUserId(user.user_id);
        if (lecturer) {
          payload.lecturerId = lecturer.lecturer_id; // Thêm lecturerId vào token
        }
      }
      // (Admin (roleId = 1) không cần ID cụ thể)
      // === KẾT THÚC CẬP NHẬT ===

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
          // Gửi kèm studentId hoặc lecturerId (nếu có) về cho client
          studentId: payload.studentId || null,
          lecturerId: payload.lecturerId || null,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  // === 3. LẤY THÔNG TIN USER HIỆN TẠI (Protected) ===
  getCurrentUser: async (req, res) => {
    // Hàm này chỉ chạy NẾU middleware verifyToken thành công
    // Thông tin user đã được middleware giải mã và gán vào req.user
    try {
      // Chúng ta có thể lấy lại thông tin đầy đủ từ CSDL nếu muốn
      // nhưng tạm thời chỉ cần trả lại thông tin từ token là đủ
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