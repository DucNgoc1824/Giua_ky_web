require('dotenv').config();
const mysql = require('mysql2/promise');

async function createSampleAssignments() {
  let connection;
  try {
    // Kết nối đến database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'school_management',
    });

    console.log('✅ Đã kết nối đến database');

    // Kiểm tra xem đã có dữ liệu trong Lecturer_Assignments chưa
    const [existingData] = await connection.query(
      'SELECT COUNT(*) as count FROM Lecturer_Assignments'
    );
    
    if (existingData[0].count > 0) {
      console.log(`⚠️  Đã có ${existingData[0].count} phân công trong database.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        readline.question('Bạn có muốn xóa hết và tạo lại? (yes/no): ', resolve);
      });
      readline.close();
      
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        await connection.query('DELETE FROM Lecturer_Assignments');
        console.log('✅ Đã xóa dữ liệu cũ');
      } else {
        console.log('❌ Hủy bỏ thao tác');
        await connection.end();
        return;
      }
    }

    // Lấy thông tin giảng viên và môn học họ có thể dạy từ Lecturer_Subjects
    const [lecturerSubjects] = await connection.query(`
      SELECT 
        ls.lecturer_id,
        ls.subject_id,
        l.lecturer_code,
        u.full_name AS lecturer_name,
        s.subject_code,
        s.subject_name
      FROM Lecturer_Subjects ls
      JOIN Lecturers l ON ls.lecturer_id = l.lecturer_id
      JOIN Users u ON l.user_id = u.user_id
      JOIN Subjects s ON ls.subject_id = s.subject_id
      ORDER BY ls.lecturer_id, ls.subject_id
    `);

    if (lecturerSubjects.length === 0) {
      console.log('❌ Không có dữ liệu trong bảng Lecturer_Subjects!');
      console.log('   Vui lòng chạy script assignLecturerSubjects.js trước.');
      await connection.end();
      return;
    }

    console.log(`\n📋 Tìm thấy ${lecturerSubjects.length} quan hệ giảng viên-môn học:`);
    lecturerSubjects.forEach(ls => {
      console.log(`   - ${ls.lecturer_code} (${ls.lecturer_name}) → ${ls.subject_code} (${ls.subject_name})`);
    });

    // Lấy danh sách lớp học
    const [classes] = await connection.query('SELECT class_id, class_code FROM Classes LIMIT 5');
    
    if (classes.length === 0) {
      console.log('❌ Không có lớp học trong database!');
      await connection.end();
      return;
    }

    console.log(`\n📚 Tìm thấy ${classes.length} lớp học để phân công`);

    // Tạo phân công cho học kỳ 2024-1 và 2024-2
    const semesters = ['2024-1', '2024-2'];
    const assignments = [];

    for (const ls of lecturerSubjects) {
      for (const semester of semesters) {
        // Mỗi giảng viên dạy môn đó cho 2 lớp đầu tiên
        for (let i = 0; i < Math.min(2, classes.length); i++) {
          assignments.push({
            lecturer_id: ls.lecturer_id,
            subject_id: ls.subject_id,
            class_id: classes[i].class_id,
            semester: semester,
            lecturer_name: ls.lecturer_name,
            subject_name: ls.subject_name,
            class_code: classes[i].class_code,
          });
        }
      }
    }

    console.log(`\n🔄 Đang tạo ${assignments.length} phân công...`);

    // Insert dữ liệu
    for (const assign of assignments) {
      await connection.query(
        `INSERT INTO Lecturer_Assignments (lecturer_id, subject_id, class_id, semester)
         VALUES (?, ?, ?, ?)`,
        [assign.lecturer_id, assign.subject_id, assign.class_id, assign.semester]
      );
      console.log(`   ✓ ${assign.lecturer_name} dạy ${assign.subject_name} cho lớp ${assign.class_code} - ${assign.semester}`);
    }

    console.log(`\n✅ Đã tạo thành công ${assignments.length} phân công!`);
    console.log('\n📊 Tổng kết:');
    console.log(`   - Số giảng viên: ${new Set(assignments.map(a => a.lecturer_id)).size}`);
    console.log(`   - Số môn học: ${new Set(assignments.map(a => a.subject_id)).size}`);
    console.log(`   - Số lớp học: ${new Set(assignments.map(a => a.class_id)).size}`);
    console.log(`   - Số học kỳ: ${semesters.length}`);

    await connection.end();
    console.log('\n🎉 Hoàn tất!');

  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    if (connection) {
      await connection.end();
    }
    process.exit(1);
  }
}

// Chạy script
createSampleAssignments();
