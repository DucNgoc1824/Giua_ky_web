const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getAdminStats: async (req, res) => {
    try {
      const [studentCount, lecturerCount, classCount, subjectCount, gradeDistribution, avgGPA] =
        await Promise.all([
          dashboardModel.getStudentCount(),
          dashboardModel.getLecturerCount(),
          dashboardModel.getClassCount(),
          dashboardModel.getSubjectCount(),
          dashboardModel.getGradeDistribution(),
          dashboardModel.getAverageGPA(),
        ]);

      res.status(200).json({
        students: studentCount,
        lecturers: lecturerCount,
        classes: classCount,
        subjects: subjectCount,
        gradeDistribution,
        avgGPA,
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getLecturerStats: async (req, res) => {
    try {
      const lecturerId = req.user.lecturerId;
      console.log('📊 Get Lecturer Stats for ID:', lecturerId);

      const [stats, gradeDistribution] = await Promise.all([
        dashboardModel.getLecturerStats(lecturerId),
        dashboardModel.getLecturerGradeDistribution(lecturerId),
      ]);

      res.status(200).json({
        classes: stats.class_count || 0,
        students: stats.student_count || 0,
        totalGrades: stats.total_grades || 0,
        avgScore: stats.avg_score || 0,
        gradeDistribution,
      });
    } catch (error) {
      console.error('❌ Error getting lecturer stats:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },

  getStudentStats: async (req, res) => {
    try {
      const studentId = req.user.studentId;
      console.log('📊 Get Student Stats for ID:', studentId);

      const [stats, gradesBySubject, gradeTrend] = await Promise.all([
        dashboardModel.getStudentStats(studentId),
        dashboardModel.getStudentGradesBySubject(studentId),
        dashboardModel.getStudentGradeTrend(studentId),
      ]);

      res.status(200).json({
        gpa: stats.gpa || 0,
        subjects: stats.subject_count || 0,
        totalGrades: stats.total_grades || 0,
        avgAttendance: stats.avg_attendance || 0,
        gradesBySubject,
        gradeTrend,
      });
    } catch (error) {
      console.error('❌ Error getting student stats:', error);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = dashboardController;