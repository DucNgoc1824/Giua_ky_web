const materialModel = require('../models/courseMaterialModel');
const lecturerModel = require('../models/lecturerModel');

const courseMaterialController = {
  addMaterial: async (req, res) => {
    try {
      const { subject_id, title } = req.body;
      const added_by_user_id = req.user.userId;

      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn một file để upload.' });
      }
      
      const fileUrl = `/uploads/${req.file.filename}`;

      if (!subject_id || !title) {
        return res
          .status(400)
          .json({ message: 'Vui lòng nhập đủ Môn học và Tiêu đề.' });
      }

      // Kiểm tra nếu là giảng viên thì chỉ được upload tài liệu môn mình dạy
      if (req.user.roleId === 2) {
        const lecturerSubjects = await lecturerModel.getSubjectsByLecturerId(req.user.lecturerId);
        const isTeachingSubject = lecturerSubjects.some(s => s.subject_id == subject_id);
        
        if (!isTeachingSubject) {
          return res.status(403).json({ 
            message: 'Bạn chỉ được upload tài liệu cho các môn mà bạn đang dạy.' 
          });
        }
      }

      // Detect file type based on extension
      const path = require('path');
      const ext = path.extname(req.file.originalname).toLowerCase();
      let file_type = 'document'; // default
      
      if (['.glb', '.gltf'].includes(ext)) {
        file_type = '3d_model';
      } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        file_type = 'image';
      } else if (['.pdf'].includes(ext)) {
        file_type = 'pdf';
      } else if (['.zip'].includes(ext)) {
        file_type = 'archive';
      }

      console.log('🔍 Detected file type:', file_type);

      const newMaterialId = await materialModel.create(
        subject_id,
        title,
        fileUrl,
        added_by_user_id,
        file_type
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
  },

  // Lấy tài liệu của 1 sinh viên (cho Android app)
  getMaterialsByStudent: async (req, res) => {
    try {
      const { studentId } = req.params;
      console.log('📚 Fetching materials for student:', studentId);
      
      // Lấy tài liệu theo môn học mà sinh viên đang học
      const materials = await materialModel.findByStudentId(studentId);
      console.log(`✅ Found ${materials.length} materials for student`);
      
      res.status(200).json({
        success: true,
        data: materials
      });
    } catch (error) {
      console.error('❌ Get Materials for Student Error:', error.message);
      res.status(500).json({ 
        success: false,
        message: 'Lỗi server', 
        error: error.message 
      });
    }
  }
};

module.exports = courseMaterialController;