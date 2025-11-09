const assignmentModel = require('../models/assignmentModelNew');
const lecturerModel = require('../models/lecturerModel');

const assignmentController = {
  // ============ ASSIGNMENTS ============

  // Tạo bài tập mới (Giảng viên)
  createAssignment: async (req, res) => {
    try {
      const { title, description, due_date, subject_id } = req.body;
      const lecturer_id = req.user.lecturerId;

      if (!title || !due_date || !subject_id || !lecturer_id) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      // Kiểm tra giảng viên có dạy môn này không
      const lecturerSubjects = await lecturerModel.getSubjectsByLecturerId(lecturer_id);
      const isTeachingSubject = lecturerSubjects.some(s => s.subject_id == subject_id);
      
      if (!isTeachingSubject) {
        return res.status(403).json({ 
          message: 'Bạn chỉ được giao bài tập cho các môn mà bạn đang dạy.' 
        });
      }

      const assignmentId = await assignmentModel.createAssignment({
        title,
        description,
        due_date,
        subject_id,
        lecturer_id,
      });

      res.status(201).json({
        message: 'Tạo bài tập thành công',
        assignmentId,
      });
    } catch (error) {
      console.error('❌ Error creating assignment:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy danh sách bài tập (Giảng viên hoặc Sinh viên)
  getAssignments: async (req, res) => {
    try {
      const { roleId, lecturerId, studentId } = req.user;

      let assignments;
      if (roleId === 2) {
        // Giảng viên
        assignments = await assignmentModel.getAssignmentsByLecturer(lecturerId);
      } else if (roleId === 3) {
        // Sinh viên
        assignments = await assignmentModel.getAssignmentsByStudent(studentId);
      } else {
        return res.status(403).json({ message: 'Không có quyền truy cập' });
      }

      res.json(assignments);
    } catch (error) {
      console.error('❌ Error getting assignments:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy chi tiết bài tập
  getAssignmentById: async (req, res) => {
    try {
      const { id } = req.params;
      const assignment = await assignmentModel.getAssignmentById(id);

      if (!assignment) {
        return res.status(404).json({ message: 'Không tìm thấy bài tập' });
      }

      res.json(assignment);
    } catch (error) {
      console.error('❌ Error getting assignment:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Cập nhật bài tập (Giảng viên)
  updateAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, due_date } = req.body;

      const updated = await assignmentModel.updateAssignment(id, {
        title,
        description,
        due_date,
      });

      if (updated === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bài tập' });
      }

      res.json({ message: 'Cập nhật bài tập thành công' });
    } catch (error) {
      console.error('❌ Error updating assignment:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Xóa bài tập (Giảng viên)
  deleteAssignment: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await assignmentModel.deleteAssignment(id);

      if (deleted === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bài tập' });
      }

      res.json({ message: 'Xóa bài tập thành công' });
    } catch (error) {
      console.error('❌ Error deleting assignment:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // ============ SUBMISSIONS ============

  // Nộp bài (Sinh viên)
  submitAssignment: async (req, res) => {
    try {
      const { assignment_id, submission_text } = req.body;
      const student_id = req.user.studentId;
      const file_path = req.file ? req.file.path : null;

      if (!assignment_id || !student_id) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
      }

      const submissionId = await assignmentModel.submitAssignment({
        assignment_id,
        student_id,
        file_path,
        submission_text,
      });

      res.status(201).json({
        message: 'Nộp bài thành công',
        submissionId,
      });
    } catch (error) {
      console.error('❌ Error submitting assignment:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy danh sách bài nộp của 1 bài tập (Giảng viên)
  getSubmissions: async (req, res) => {
    try {
      const { id } = req.params;
      const submissions = await assignmentModel.getSubmissionsByAssignment(id);
      res.json(submissions);
    } catch (error) {
      console.error('❌ Error getting submissions:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Chấm điểm bài nộp (Giảng viên)
  gradeSubmission: async (req, res) => {
    try {
      const { id } = req.params;
      const { score, feedback } = req.body;

      if (score === undefined) {
        return res.status(400).json({ message: 'Thiếu điểm số' });
      }

      const updated = await assignmentModel.gradeSubmission(id, score, feedback);

      if (updated === 0) {
        return res.status(404).json({ message: 'Không tìm thấy bài nộp' });
      }

      res.json({ message: 'Chấm điểm thành công' });
    } catch (error) {
      console.error('❌ Error grading submission:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // Lấy bài tập của 1 sinh viên (cho Android app)
  getAssignmentsByStudent: async (req, res) => {
    try {
      const { studentId } = req.params;
      const assignments = await assignmentModel.getAssignmentsByStudentId(studentId);
      
      res.status(200).json({
        success: true,
        data: assignments
      });
    } catch (error) {
      console.error('❌ Error getting assignments for student:', error);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server', 
        error: error.message 
      });
    }
  },
};

module.exports = assignmentController;
