import api from './api';

const studentService = {
  getAllStudents: async () => {
    try {
      const response = await api.get('/students');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateStudent: async (studentId, studentData) => {
    try {
      const response = await api.put(`/students/${studentId}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteStudent: async (studentId) => {
    try {
      const response = await api.delete(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  getStudentById: async (studentId) => {
     try {
      const response = await api.get(`/students/${studentId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  searchStudents: async (searchTerm) => {
    try {
      const response = await api.get('/students/search/name', {
        params: { q: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default studentService;