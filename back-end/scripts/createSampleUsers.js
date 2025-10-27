// Script tạo users mẫu (Admin, Lecturers, Students)
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createSampleUsers() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Đã kết nối đến database\n');
    
    // Hash mật khẩu mặc định (123456 cho tất cả)
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    console.log('=== TẠO USERS MẪU ===\n');

    // 1. Tạo Admin
    console.log('1️⃣  Tạo Admin...');
    try {
      const [adminResult] = await connection.execute(
        'INSERT INTO Users (username, password_hash, full_name, email, role_id) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin@school.edu.vn', 1]
      );
      console.log(`   ✓ Admin created (ID: ${adminResult.insertId})`);
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('   ⚠️  Admin đã tồn tại, bỏ qua');
      } else {
        throw err;
      }
    }

    // 2. Tạo Giảng viên (10 người)
    console.log('\n2️⃣  Tạo Giảng viên (10 người)...');
    const lecturerNames = [
      'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Văn Cường', 'Phạm Thị Dung', 'Hoàng Văn Em',
      'Vũ Thị Phương', 'Đỗ Văn Giang', 'Bùi Thị Hoa', 'Đinh Văn Inh', 'Ngô Thị Kim'
    ];
    const departments = ['CNTT', 'KHMT', 'HTTT', 'CNTT', 'KHMT', 'HTTT', 'CNTT', 'KHMT', 'HTTT', 'CNTT'];

    for (let i = 0; i < 10; i++) {
      const lecturerCode = `GV${String(i + 1).padStart(3, '0')}`;
      const username = `gv${String(i + 1).padStart(2, '0')}`;
      const email = `${username}@school.edu.vn`;
      
      try {
        // Tạo User
        const [userResult] = await connection.execute(
          'INSERT INTO Users (username, password_hash, full_name, email, role_id) VALUES (?, ?, ?, ?, ?)',
          [username, hashedPassword, lecturerNames[i], email, 2]
        );
        
        // Tạo Lecturer
        await connection.execute(
          'INSERT INTO Lecturers (user_id, lecturer_code, department) VALUES (?, ?, ?)',
          [userResult.insertId, lecturerCode, departments[i]]
        );
        
        console.log(`   ✓ ${lecturerCode} - ${lecturerNames[i]} (${departments[i]})`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  ${username} đã tồn tại, bỏ qua`);
        } else {
          throw err;
        }
      }
    }

    // 3. Tạo Lớp học
    console.log('\n3️⃣  Tạo Lớp học...');
    const classes = [
      { code: 'CNTT1', name: 'Công nghệ thông tin 1' },
      { code: 'CNTT2', name: 'Công nghệ thông tin 2' },
      { code: 'KHMT1', name: 'Khoa học máy tính 1' },
      { code: 'HTTT1', name: 'Hệ thống thông tin 1' }
    ];

    const classIds = [];
    for (const cls of classes) {
      try {
        const [result] = await connection.execute(
          'INSERT INTO Classes (class_code, class_name) VALUES (?, ?)',
          [cls.code, cls.name]
        );
        classIds.push(result.insertId);
        console.log(`   ✓ ${cls.code} - ${cls.name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          const [existing] = await connection.execute(
            'SELECT class_id FROM Classes WHERE class_code = ?',
            [cls.code]
          );
          classIds.push(existing[0].class_id);
          console.log(`   ⚠️  ${cls.code} đã tồn tại, bỏ qua`);
        } else {
          throw err;
        }
      }
    }

    // 4. Tạo Sinh viên (40 người - 10 người/lớp)
    console.log('\n4️⃣  Tạo Sinh viên (40 người)...');
    const firstNames = ['An', 'Bình', 'Cường', 'Dũng', 'Em', 'Phương', 'Giang', 'Hoa', 'Inh', 'Kim'];
    const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm'];
    
    let studentCount = 0;
    for (let classIndex = 0; classIndex < classIds.length; classIndex++) {
      const classId = classIds[classIndex];
      const classCode = classes[classIndex].code;
      
      console.log(`\n   Lớp ${classCode}:`);
      
      for (let i = 0; i < 10; i++) {
        studentCount++;
        const studentCode = `SV${String(studentCount).padStart(3, '0')}`;
        const username = `sv${String(studentCount).padStart(2, '0')}`;
        const fullName = `${lastNames[classIndex]} Văn ${firstNames[i]}`;
        const email = `${username}@student.school.edu.vn`;
        
        try {
          // Tạo User
          const [userResult] = await connection.execute(
            'INSERT INTO Users (username, password_hash, full_name, email, role_id) VALUES (?, ?, ?, ?, ?)',
            [username, hashedPassword, fullName, email, 3]
          );
          
          // Tạo Student
          await connection.execute(
            'INSERT INTO Students (user_id, student_code, class_id) VALUES (?, ?, ?)',
            [userResult.insertId, studentCode, classId]
          );
          
          console.log(`     ✓ ${studentCode} - ${fullName}`);
        } catch (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            console.log(`     ⚠️  ${username} đã tồn tại, bỏ qua`);
          } else {
            throw err;
          }
        }
      }
    }

    // 5. Tạo Môn học
    console.log('\n5️⃣  Tạo Môn học...');
    const subjects = [
      { code: 'IT001', name: 'Nhập môn lập trình', credits: 4 },
      { code: 'IT002', name: 'Cấu trúc dữ liệu và giải thuật', credits: 4 },
      { code: 'IT003', name: 'Lập trình hướng đối tượng', credits: 4 },
      { code: 'IT004', name: 'Cơ sở dữ liệu', credits: 4 },
      { code: 'IT005', name: 'Mạng máy tính', credits: 4 },
      { code: 'IT006', name: 'Công nghệ Web', credits: 4 },
      { code: 'IT007', name: 'Hệ điều hành', credits: 4 },
      { code: 'IT008', name: 'Trí tuệ nhân tạo', credits: 4 }
    ];

    for (const subject of subjects) {
      try {
        await connection.execute(
          'INSERT INTO Subjects (subject_code, subject_name, credits) VALUES (?, ?, ?)',
          [subject.code, subject.name, subject.credits]
        );
        console.log(`   ✓ ${subject.code} - ${subject.name} (${subject.credits} tín chỉ)`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`   ⚠️  ${subject.code} đã tồn tại, bỏ qua`);
        } else {
          throw err;
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ TẠO DỮ LIỆU MẪU THÀNH CÔNG!');
    console.log('='.repeat(60));
    console.log('\n📊 THỐNG KÊ:');
    console.log('   - 1 Admin');
    console.log('   - 10 Giảng viên');
    console.log('   - 40 Sinh viên');
    console.log('   - 4 Lớp học');
    console.log('   - 8 Môn học');
    console.log('\n🔑 MẬT KHẨU MẶC ĐỊNH: 123456 (cho tất cả users)');
    console.log('\n📝 TÀI KHOẢN TEST:');
    console.log('   - Admin:       admin / 123456');
    console.log('   - Giảng viên:  gv01 - gv10 / 123456');
    console.log('   - Sinh viên:   sv01 - sv40 / 123456');
    console.log('\n🎯 BƯỚC TIẾP THEO:');
    console.log('   1. Chạy: node scripts/assignLecturerSubjects.js');
    console.log('   2. Chạy: node scripts/createSampleAssignments.js');
    console.log('   3. Khởi động server: npm start');
    console.log('   4. Truy cập: http://localhost:5173\n');

    await connection.end();

  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error(error);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

createSampleUsers();
