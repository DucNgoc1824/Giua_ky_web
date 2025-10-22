const subjectModel = require('../models/subjectModel');

const subjectController = {
  // 1. Tạo môn học mới
  createSubject: async (req, res) => {
    try {
      // SỬA DÒNG NÀY:
      const { subject_code, subject_name, credits } = req.body;
      if (!subject_code || !subject_name || !credits) { // SỬA DÒNG NÀY
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ mã, tên và số tín chỉ.' });
      }
      const newSubjectId = await subjectModel.create(
        subject_code, // SỬA DÒNG NÀY
        subject_name, // SỬA DÒNG NÀY
        credits
      );
      res
        .status(201)
        .json({ message: 'Tạo môn học thành công!', subjectId: newSubjectId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Mã môn học đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 2. Lấy tất cả môn học
  getAllSubjects: async (req, res) => {
    try {
      const subjects = await subjectModel.getAll();
      res.status(200).json(subjects);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. Lấy 1 môn học
  getSubjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const subject = await subjectModel.getById(id);
      if (!subject) {
        return res.status(404).json({ message: 'Không tìm thấy môn học.' });
      }
      res.status(200).json(subject);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 4. Cập nhật môn học
  updateSubject: async (req, res) => {
    try {
      const { id } = req.params;
      // SỬA DÒNG NÀY:
      const { subject_code, subject_name, credits } = req.body;
      if (!subject_code || !subject_name || !credits) { // SỬA DÒNG NÀY
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ thông tin.' });
      }
      const affectedRows = await subjectModel.update(
        id,
        subject_code, // SỬA DÒNG NÀY
        subject_name, // SỬA DÒNG NÀY
        credits
      );
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy môn học.' });
      }
      res.status(200).json({ message: 'Cập nhật môn học thành công.' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Mã môn học đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 5. Xóa môn học
  deleteSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await subjectModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy môn học.' });
      }
      res.status(200).json({ message: 'Xóa môn học thành công.' });
    } catch (error) {
       // Xử lý lỗi nếu xóa môn đang có điểm (lỗi Foreign Key)
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ message: 'Không thể xóa môn học này vì đã có sinh viên được nhập điểm.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = subjectController;