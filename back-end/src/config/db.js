const mysql = require('mysql2');
require('dotenv').config(); // Tải các biến từ file .env

// Tạo một "pool" kết nối thay vì một kết nối đơn lẻ
// Pool giúp quản lý nhiều kết nối cùng lúc và tái sử dụng chúng, hiệu quả hơn.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Thử kết nối để kiểm tra
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Lỗi khi kết nối CSDL MySQL:', err.message);
    return;
  }
  console.log('Đã kết nối thành công tới CSDL MySQL!');
  connection.release(); // Trả kết nối về pool
});

// Xuất pool này dưới dạng promise để dễ dàng sử dụng với async/await
module.exports = pool.promise();