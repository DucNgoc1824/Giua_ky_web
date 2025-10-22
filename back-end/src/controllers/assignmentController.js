const assignmentModel = require('../models/assignmentModel');

const assignmentController = {
  // 1. (Admin) Tạo phân công
  createAssignment: async (req, res) => {
    try {
      const { lecturer_id, subject_id, class_id, semester } = req.body;

      if (!lecturer_id || !subject_id || !class_id || !semester) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ thông tin phân công.' });
      }

      const newAssignmentId = await assignmentModel.create(
        lecturer_id,
        subject_id,
        class_id,
        semester
      );
      res.status(201).json({
        message: 'Phân công giảng dạy thành công!',
        assignmentId: newAssignmentId,
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res
          .status(409)
          .json({ message: 'Môn học này đã được phân công cho lớp này trong học kỳ này.' });
      }
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        return res
          .status(404)
          .json({ message: 'Không tìm thấy Giảng viên, Môn học hoặc Lớp học.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 2. (Admin) Lấy tất cả phân công
  getAllAssignments: async (req, res) => {
    try {
      const assignments = await assignmentModel.getAll();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. (Admin) Xóa phân công
  deleteAssignment: async (req, res) => {
    try {
      const { id } = req.params; // assignment_id
      const affectedRows = await assignmentModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy phân công.' });
      }
      res.status(200).json({ message: 'Xóa phân công thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = assignmentController;