import api from './api';

const classService = {
  getAllClasses: async () => {
    try {
      const response = await api.get('/classes');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createClass: async (classData) => {
    try {
      const response = await api.post('/classes', classData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateClass: async (classId, classData) => {
    try {
      const response = await api.put(`/classes/${classId}`, classData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteClass: async (classId) => {
    try {
      const response = await api.delete(`/classes/${classId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default classService;