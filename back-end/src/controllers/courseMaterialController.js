const materialModel = require('../models/courseMaterialModel');

const courseMaterialController = {
  addMaterial: async (req, res) => {
    try {
      const { subject_id, title } = req.body;
      const added_by_user_id = req.user.userId;

      console.log('📤 Upload Material Request:', { subject_id, title, user: req.user });

      if (!req.file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: 'Vui lòng chọn một file để upload.' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;
      console.log('📁 File:', req.file.filename);

      if (!subject_id || !title) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ Môn học và Tiêu đề.' });
      }

      const newMaterialId = await materialModel.create(
        subject_id,
        title,
        fileUrl,
        added_by_user_id
      );
      
      console.log('✅ Material uploaded successfully:', newMaterialId);
      
      res
        .status(201)
        .json({ message: 'Upload tài liệu thành công!', materialId: newMaterialId });
    } catch (error) {
      console.error('❌ Material Error:', error.message);
      console.error('Error Code:', error.code);
      console.error('Stack:', error.stack);
      
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
         return res.status(404).json({ message: 'Không tìm thấy môn học này.' });
      }
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getMaterialsForSubject: async (req, res) => {
    try {
      const { subjectId } = req.params;
      console.log('📚 Fetching materials for subject:', subjectId);
      
      const materials = await materialModel.findBySubject(subjectId);
      console.log(`✅ Found ${materials.length} materials`);
      
      res.status(200).json(materials);
    } catch (error) {
      console.error('❌ Get Materials Error:', error.message);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  deleteMaterial: async (req, res) => {
     try {
      const { id } = req.params;
      
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