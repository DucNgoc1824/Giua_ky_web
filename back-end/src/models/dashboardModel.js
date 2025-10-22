const db = require('../config/db');

const dashboardModel = {
  // Đếm số lượng sinh viên
  getStudentCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Students');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Đếm số lượng giảng viên
  getLecturerCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Lecturers');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },

  // Đếm số lượng lớp học
  getClassCount: async () => {
    try {
      const [rows] = await db.query('SELECT COUNT(*) as count FROM Classes');
      return rows[0].count;
    } catch (error) {
      throw error;
    }
  },
  
  // Đếm số lượng môn học
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