import api from './api';

const gradeService = {
  getMyGrades: async () => {
    try {
      const response = await api.get('/grades/my-grades');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  
  upsertGrade: async (gradeData) => {
    try {
      const response = await api.post('/grades', gradeData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getGradesBySubjectAndSemester: async (subjectId, semester) => {
    try {
      const response = await api.get(`/grades/subject/${subjectId}/semester/${semester}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getGradesBySubject: async (subjectId) => {
    try {
      const response = await api.get(`/grades/subject/${subjectId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
};

export default gradeService;