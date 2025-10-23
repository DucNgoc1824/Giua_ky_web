import api from './api';

const subjectService = {
  getAllSubjects: async () => {
    try {
      const response = await api.get('/subjects');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createSubject: async (subjectData) => {
    try {
      const response = await api.post('/subjects', subjectData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateSubject: async (subjectId, subjectData) => {
    try {
      const response = await api.put(`/subjects/${subjectId}`, subjectData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteSubject: async (subjectId) => {
    try {
      const response = await api.delete(`/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default subjectService;