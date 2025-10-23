const db = require('../config/db');

const dashboardModel = {
  getStudentCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Students');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  getLecturerCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Lecturers');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  getClassCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Classes');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },
  
  getSubjectCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Subjects');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = dashboardModel;