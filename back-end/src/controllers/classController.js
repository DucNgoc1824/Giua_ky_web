const classModel = require('../models/classModel');

const classController = {
  createClass: async (req, res) => {
    try {
      const { class_code, major } = req.body; 
      if (!class_code || !major) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ mã lớp và ngành học.' });
      }
      const newClassId = await classModel.create(class_code, major); 
      res
        .status(201)
        .json({ message: 'Tạo lớp học thành công!', classId: newClassId });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Mã lớp đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getAllClasses: async (req, res) => {
    try {
      const classes = await classModel.getAll();
      res.status(200).json(classes);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const classInfo = await classModel.getById(id);
      if (!classInfo) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
      }
      res.status(200).json(classInfo);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const { class_code, major } = req.body; 
      if (!class_code || !major) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ mã lớp và ngành học.' });
      }
      const affectedRows = await classModel.update(id, class_code, major); 
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
      }
      res.status(200).json({ message: 'Cập nhật lớp học thành công.' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Mã lớp đã tồn tại.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      const affectedRows = await classModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy lớp học.' });
      }
      res.status(200).json({ message: 'Xóa lớp học thành công.' });
    } catch (error) {
      if (error.code === 'ER_ROW_IS_REFERENCED_2') {
         return res.status(400).json({ message: 'Không thể xóa lớp học này vì đang có sinh viên.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = classController;