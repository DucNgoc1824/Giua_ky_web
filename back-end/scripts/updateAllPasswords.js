// Script tự động hash và update mật khẩu cho TẤT CẢ users trong database
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function updateAllPasswords() {
  let connection;
  try {
    connection = await db.getConnection();
    
    // 1. Lấy tất cả users từ database
    const [users] = await connection.query('SELECT user_id, username FROM Users');
    
    console.log(`=== Tìm thấy ${users.length} users ===\n`);
    
    // 2. Mật khẩu mặc định cho các loại users
    const defaultPasswords = {
      'admin': 'admin123',      // Admin dùng mật khẩu đặc biệt
      'default': 'password123'  // Tất cả users khác dùng password123
    };
    
    // 3. Loop qua từng user và update hash
    let updateCount = 0;
    for (const user of users) {
      // Xác định mật khẩu dựa vào username
      const password = user.username === 'admin' ? defaultPasswords.admin : defaultPasswords.default;
      
      // Tạo hash mới
      const hash = await bcrypt.hash(password, 10);
      
      // Update vào database
      await connection.query(
        'UPDATE Users SET password_hash = ? WHERE user_id = ?',
        [hash, user.user_id]
      );
      
      updateCount++;
      console.log(`✓ Updated: ${user.username} (ID: ${user.user_id}) với password: ${password}`);
    }
    
    console.log(`\n=== HOÀN THÀNH! ===`);
    console.log(`Đã update ${updateCount}/${users.length} users`);
    console.log('\nThông tin đăng nhập:');
    console.log('- Admin: admin / admin123');
    console.log('- Tất cả users khác: username / password123');
    
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

// Chạy script
updateAllPasswords();
