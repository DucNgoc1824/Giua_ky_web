const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  getAdminStats: async (req, res) => {
    try {
      const [studentCount, lecturerCount, classCount, subjectCount] =
        await Promise.all([
          dashboardModel.getStudentCount(),
          dashboardModel.getLecturerCount(),
          dashboardModel.getClassCount(),
          dashboardModel.getSubjectCount(),
        ]);

      res.status(200).json({
        students: studentCount,
        lecturers: lecturerCount,
        classes: classCount,
        subjects: subjectCount,
      });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
  },
};

module.exports = dashboardController;