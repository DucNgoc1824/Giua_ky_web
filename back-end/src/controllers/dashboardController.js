const dashboardModel = require('../models/dashboardModel');

const dashboardController = {
  // Chỉ Admin mới được xem thống kê
  getAdminStats: async (req, res) => {
    try {
      // Gọi song song 4 hàm đếm
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
  
  // (Bạn có thể thêm hàm thống kê cho GV, SV nếu muốn)
};

module.exports = dashboardController;