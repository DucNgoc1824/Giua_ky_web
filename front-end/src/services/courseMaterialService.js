import api from './api';

const courseMaterialService = {
  getMaterialsBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/materials/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addMaterial: async (formData) => {
    try {
      const response = await api.post('/materials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteMaterial: async (materialId) => {
    try {
      const response = await api.delete(`/materials/${materialId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default courseMaterialService;