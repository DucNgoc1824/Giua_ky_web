import api from './api';

const lecturerService = {
  getAllLecturers: async () => {
    try {
      const response = await api.get('/lecturers');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getLecturerById: async (lecturerId) => {
    try {
      const response = await api.get(`/lecturers/${lecturerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createLecturer: async (lecturerData) => {
    try {
      const response = await api.post('/lecturers', lecturerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateLecturer: async (lecturerId, lecturerData) => {
    try {
      const response = await api.put(`/lecturers/${lecturerId}`, lecturerData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteLecturer: async (lecturerId) => {
    try {
      const response = await api.delete(`/lecturers/${lecturerId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getSubjectsByLecturer: async (lecturerId) => {
    try {
      const response = await api.get(`/lecturers/${lecturerId}/subjects`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addSubjectToLecturer: async (lecturerId, subjectId) => {
    try {
      const response = await api.post(`/lecturers/${lecturerId}/subjects`, {
        subject_id: subjectId
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  removeSubjectFromLecturer: async (lecturerId, subjectId) => {
    try {
      const response = await api.delete(`/lecturers/${lecturerId}/subjects/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default lecturerService;