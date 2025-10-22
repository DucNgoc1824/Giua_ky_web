const materialModel = require('../models/courseMaterialModel');

const courseMaterialController = {
  // 1. (GV/Admin) Thêm tài liệu
  addMaterial: async (req, res) => {
    try {
      // 1. Lấy 'title' và 'subject_id' từ req.body (dạng FormData)
      const { subject_id, title } = req.body;
      const added_by_user_id = req.user.userId;

      // 2. Kiểm tra xem file đã được upload chưa
      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn một file để upload.' });
      }
      
      // 3. Lấy đường dẫn của file (do multer tạo ra)
      // req.file.path sẽ là 'uploads/12345-tenfile.pdf'
      // Chúng ta sẽ lưu đường dẫn này vào CSDL (cột 'url')
      // Chúng ta cần chuẩn hóa nó thành /uploads/12345-tenfile.pdf
      const fileUrl = `/uploads/${req.file.filename}`;

      if (!subject_id || !title) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ Môn học và Tiêu đề.' });
      }

      const newMaterialId = await materialModel.create(
        subject_id,
        title,
        fileUrl, // <-- SỬA: Lưu fileUrl thay vì url từ body
        added_by_user_id
      );
      res
        .status(201)
        .json({ message: 'Upload tài liệu thành công!', materialId: newMaterialId });
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