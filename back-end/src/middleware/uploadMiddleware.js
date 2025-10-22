const multer = require('multer');
const path = require('path');

// 1. Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
  // Nơi lưu file (thư mục 'uploads/' ở gốc)
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  // Tên file: Giữ tên gốc + thêm 1 dấu thời gian để tránh trùng
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, uniqueSuffix + '-' + file.originalname);
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// 2. Cấu hình bộ lọc (tùy chọn, vd: chỉ nhận PDF, DOCX)
const fileFilter = (req, file, cb) => {
  // Bạn có thể lọc file ở đây, tạm thời chấp nhận tất cả
  cb(null, true); 
};

// 3. Giới hạn kích thước file (ví dụ 10MB như bạn nói)
const limits = {
  fileSize: 10 * 1024 * 1024, // 10MB
};

// 4. Khởi tạo multer với các cấu hình trên
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits,
});

// Xuất middleware để "bắt" 1 file duy nhất tên là 'file'
// (Tên 'file' này phải trùng với tên ta đặt ở FormData frontend)
module.exports = upload.single('file');