const materialModel = require('../models/courseMaterialModel');

const courseMaterialController = {
  // 1. (GV/Admin) Thêm tài liệu
  addMaterial: async (req, res) => {
    try {
      const { subject_id, title, url } = req.body;
      const added_by_user_id = req.user.userId; // Lấy từ token (đã qua middleware)

      if (!subject_id || !title || !url) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ Môn học, Tiêu đề và URL.' });
      }

      const newMaterialId = await materialModel.create(
        subject_id,
        title,
        url,
        added_by_user_id
      );
      res
        .status(201)
        .json({ message: 'Thêm tài liệu thành công!', materialId: newMaterialId });
    } catch (error) {
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res.status(404).json({ message: 'Không tìm thấy môn học này.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 2. (SV/GV/Admin) Lấy tài liệu của 1 môn
  getMaterialsForSubject: async (req, res) => {
    try {
      const { subjectId } = req.params; // Lấy ID môn học từ URL
      const materials = await materialModel.findBySubject(subjectId);
      res.status(200).json(materials);
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  // 3. (GV/Admin) Xóa tài liệu
  deleteMaterial: async (req, res) => {
     try {
      const { id } = req.params; // material_id
      
      // (Chúng ta có thể thêm logic kiểm tra xem người xóa có phải là người thêm,
      // nhưng tạm thời Admin/GV nào cũng xóa được)
      
      const affectedRows = await materialModel.delete(id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: 'Không tìm thấy tài liệu.' });
      }
      res.status(200).json({ message: 'Xóa tài liệu thành công.' });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  }
};

module.exports = courseMaterialController;