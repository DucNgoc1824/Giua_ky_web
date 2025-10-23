// Script tự động gán môn học cho giảng viên
const db = require('./src/config/db');

async function assignSubjects() {
  try {
    console.log('=== BẮT ĐẦU GÁN MÔN HỌC CHO GIẢNG VIÊN ===\n');
    
    // 1. Tạo bảng nếu chưa tồn tại
    console.log('1. Tạo bảng Lecturer_Subjects...');
    await db.query(`
      CREATE TABLE IF NOT EXISTS Lecturer_Subjects (
        lecturer_subject_id INT AUTO_INCREMENT PRIMARY KEY,
        lecturer_id INT NOT NULL,
        subject_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (lecturer_id) REFERENCES Lecturers(lecturer_id) ON DELETE CASCADE,
        FOREIGN KEY (subject_id) REFERENCES Subjects(subject_id) ON DELETE CASCADE,
        
        UNIQUE KEY unique_lecturer_subject (lecturer_id, subject_id)
      )
    `);
    console.log('✓ Bảng Lecturer_Subjects đã sẵn sàng\n');
    
    // 2. Lấy danh sách giảng viên
    console.log('2. Lấy danh sách giảng viên...');
    const [lecturers] = await db.query(`
      SELECT l.lecturer_id, l.lecturer_code, u.full_name 
      FROM Lecturers l 
      JOIN Users u ON l.user_id = u.user_id
      ORDER BY l.lecturer_id
    `);
    console.log(`✓ Tìm thấy ${lecturers.length} giảng viên\n`);
    
    // 3. Lấy danh sách môn học
    console.log('3. Lấy danh sách môn học...');
    const [subjects] = await db.query(`
      SELECT subject_id, subject_code, subject_name 
      FROM Subjects
      ORDER BY subject_id
    `);
    console.log(`✓ Tìm thấy ${subjects.length} môn học\n`);
    
    if (lecturers.length === 0 || subjects.length === 0) {
      console.log('❌ Không có giảng viên hoặc môn học để gán!');
      process.exit(1);
    }
    
    // 4. Xóa dữ liệu cũ (nếu có)
    console.log('4. Xóa dữ liệu cũ...');
    await db.query('DELETE FROM Lecturer_Subjects');
    console.log('✓ Đã xóa dữ liệu cũ\n');
    
    // 5. Chia đều môn học cho giảng viên
    console.log('5. Gán môn học cho từng giảng viên:\n');
    const subjectsPerLecturer = Math.ceil(subjects.length / lecturers.length);
    let totalAssigned = 0;
    
    for (let i = 0; i < lecturers.length; i++) {
      const lecturer = lecturers[i];
      const startIdx = i * subjectsPerLecturer;
      const endIdx = Math.min(startIdx + subjectsPerLecturer, subjects.length);
      
      console.log(`--- ${lecturer.lecturer_code} (${lecturer.full_name}) ---`);
      
      for (let j = startIdx; j < endIdx; j++) {
        const subject = subjects[j];
        
        try {
          await db.query(
            'INSERT INTO Lecturer_Subjects (lecturer_id, subject_id) VALUES (?, ?)',
            [lecturer.lecturer_id, subject.subject_id]
          );
          
          console.log(`  ✓ ${subject.subject_code} - ${subject.subject_name}`);
          totalAssigned++;
        } catch (err) {
          if (err.code !== 'ER_DUP_ENTRY') {
            console.log(`  ✗ Lỗi khi gán môn ${subject.subject_code}: ${err.message}`);
          }
        }
      }
      console.log('');
    }
    
    // 6. Hiển thị kết quả
    console.log('=== KẾT QUẢ ===');
    console.log(`✅ Đã gán ${totalAssigned} môn học cho ${lecturers.length} giảng viên`);
    console.log(`📊 Trung bình mỗi giảng viên dạy ${Math.round(totalAssigned/lecturers.length)} môn\n`);
    
    // 7. Hiển thị tổng kết
    console.log('=== TỔNG KẾT ===');
    const [summary] = await db.query(`
      SELECT 
        l.lecturer_code,
        u.full_name,
        COUNT(ls.subject_id) as total_subjects
      FROM Lecturers l
      JOIN Users u ON l.user_id = u.user_id
      LEFT JOIN Lecturer_Subjects ls ON l.lecturer_id = ls.lecturer_id
      GROUP BY l.lecturer_id
      ORDER BY l.lecturer_code
    `);
    
    console.table(summary);
    
    console.log('\n✅ HOÀN THÀNH! Bây giờ bạn có thể test API và Frontend.');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ LỖI:', error.message);
    console.error(error);
    process.exit(1);
  }
}

assignSubjects();
