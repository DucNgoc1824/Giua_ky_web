const gradeModel = require('../models/gradeModel');

const gradeController = {
  upsertGrade: async (req, res) => {
    try {
      const { student_id, subject_id, semester, midterm_score, final_score } =
        req.body;

      console.log('📝 Grade Request:', { student_id, subject_id, semester, midterm_score, final_score });
      console.log('👤 User:', req.user);

      if (!student_id || !subject_id || !semester) {
        return res
          .status(400)
          .json({ message: 'Cần đủ thông tin SV, Môn học và Học kỳ.' });
      }
      
      const midScore = midterm_score !== undefined ? midterm_score : null;
      const finScore = final_score !== undefined ? final_score : null;

      await gradeModel.upsert(
        student_id,
        subject_id,
        semester,
        midScore,
        finScore
      );

      console.log('✅ Grade updated successfully');
      res.status(200).json({ message: 'Cập nhật điểm thành công.' });
    } catch (error) {
      console.error('❌ Grade Error:', error.message);
      console.error('Error Code:', error.code);
      console.error('Stack:', error.stack);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res
          .status(404)
          .json({ message: 'Không tìm thấy Sinh viên hoặc Môn học tương ứng.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getMyGrades: async (req, res) => {
    try {
      const studentId = req.user.studentId; 
      
      console.log('📊 Get My Grades Request');
      console.log('👤 User:', req.user);
      console.log('Student ID:', studentId);
      
      if (!studentId) {
         return res.status(403).json({ message: 'Token không chứa thông tin sinh viên.' });
      }

      const grades = await gradeModel.findByStudentId(studentId);
      console.log(`✅ Found ${grades.length} grades`);
      
      res.status(200).json(grades);
      
    } catch (error) {
      console.error('❌ Get My Grades Error:', error.message);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
  
  getGradesForStudent: async (req, res) => {
    try {
      const { studentId } = req.params;
      
      const grades = await gradeModel.findByStudentId(studentId);
      
      if (grades.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy điểm của sinh viên này.' });
      }
      
      res.status(200).json(grades);
      
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getGradesBySubjectAndSemester: async (req, res) => {
    try {
      const { subjectId, semester } = req.params;
      
      console.log('📊 Get Grades by Subject & Semester');
      console.log('Params:', { subjectId, semester });
      console.log('👤 User:', req.user);
      
      if (!subjectId || !semester) {
        return res.status(400).json({ message: 'Thiếu thông tin môn học hoặc học kỳ.' });
      }

      const grades = await gradeModel.findBySubjectAndSemester(subjectId, semester);
      console.log(`✅ Found ${grades.length} grades`);
      
      res.status(200).json(grades);
      
    } catch (error) {
      console.error('❌ Get Grades Error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getGradesBySubject: async (req, res) => {
    try {
      const { subjectId } = req.params;
      
      console.log('📊 Get Grades by Subject');
      console.log('Subject ID:', subjectId);
      console.log('👤 User:', req.user);
      
      if (!subjectId) {
        return res.status(400).json({ message: 'Thiếu thông tin môn học.' });
      }

      const grades = await gradeModel.findBySubject(subjectId);
      console.log(`✅ Found ${grades.length} grades`);
      
      res.status(200).json(grades);
      
    } catch (error) {
      console.error('❌ Get Grades by Subject Error:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = gradeController;