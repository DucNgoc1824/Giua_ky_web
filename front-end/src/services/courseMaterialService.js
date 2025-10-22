import api from './api';

const courseMaterialService = {
  // 1. Lấy tài liệu theo môn học (cho SV xem)
  getMaterialsBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/materials/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy tài liệu:', error);
      throw error.response.data;
    }
  },

  // 2. Thêm tài liệu mới (cho GV/Admin)
  addMaterial: async (formData) => {
    // formData bây giờ là một đối tượng FormData
    try {
      const response = await api.post('/materials', formData, {
        // Cần báo cho axios đây là 'multipart/form-data'
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi thêm tài liệu:', error);
      throw error.response.data;
    }
  },

  // 3. Xóa tài liệu (cho GV/Admin)
  deleteMaterial: async (materialId) => {
    try {
      const response = await api.delete(`/materials/${materialId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa tài liệu:', error);
      throw error.response.data;
    }
  },
};

export default courseMaterialService;