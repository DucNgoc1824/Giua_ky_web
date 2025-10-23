import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import '../assets/DashboardPage.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getAdminStats();
        setStats(data);
      } catch (err) {
        setError(err.message || 'Không thể tải thống kê');
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="loading-text">Đang tải thống kê...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card stat-students">
          <div className="stat-icon">👥</div>
          <h3>Sinh viên</h3>
          <p className="stat-number">{stats.students}</p>
          <p className="stat-label">Tổng số sinh viên</p>
        </div>
        <div className="stat-card stat-lecturers">
          <div className="stat-icon">👨‍🏫</div>
          <h3>Giảng viên</h3>
          <p className="stat-number">{stats.lecturers}</p>
          <p className="stat-label">Đang giảng dạy</p>
        </div>
        <div className="stat-card stat-classes">
          <div className="stat-icon">🏫</div>
          <h3>Lớp học</h3>
          <p className="stat-number">{stats.classes}</p>
          <p className="stat-label">Lớp đang hoạt động</p>
        </div>
        <div className="stat-card stat-subjects">
          <div className="stat-icon">📚</div>
          <h3>Môn học</h3>
          <p className="stat-number">{stats.subjects}</p>
          <p className="stat-label">Môn trong chương trình</p>
        </div>
      </div>

      <div className="dashboard-features">
        <h3>Quản lý nhanh</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h4>Sinh viên</h4>
            <p>Quản lý thông tin sinh viên, lớp học và điểm số</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h4>Giảng viên</h4>
            <p>Phân công giảng dạy và quản lý môn học</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📖</div>
            <h4>Tài liệu</h4>
            <p>Quản lý tài liệu học tập và bài tập</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📧</div>
            <h4>Thắc mắc</h4>
            <p>Hỗ trợ và giải đáp thắc mắc sinh viên</p>
          </div>
        </div>
      </div>
    </>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h2>{getGreeting()}, {user.fullName}!</h2>
          <p>
            {user.roleId === 1 && 'Quản lý toàn diện hệ thống giáo dục'}
            {user.roleId === 2 && 'Giảng dạy và quản lý học phần của bạn'}
            {user.roleId === 3 && 'Theo dõi học tập và kết quả của bạn'}
          </p>
        </div>
      </div>

      {user.roleId === 1 ? (
        <AdminDashboard />
      ) : user.roleId === 2 ? (
        <div className="lecturer-dashboard">
          <div className="dashboard-features">
            <h3>Chức năng chính</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h4>Nhập điểm</h4>
                <p>Nhập và cập nhật điểm cho sinh viên</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📚</div>
                <h4>Tài liệu</h4>
                <p>Quản lý tài liệu giảng dạy của bạn</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📋</div>
                <h4>Bài tập</h4>
                <p>Giao và chấm bài tập sinh viên</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h4>Hỗ trợ</h4>
                <p>Giải đáp thắc mắc của sinh viên</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="student-dashboard">
          <div className="dashboard-features">
            <h3>Học tập của bạn</h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h4>Xem điểm</h4>
                <p>Theo dõi kết quả học tập các môn học</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📖</div>
                <h4>Tài liệu</h4>
                <p>Truy cập tài liệu học tập và bài giảng</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">✍️</div>
                <h4>Bài tập</h4>
                <p>Xem và nộp bài tập được giao</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📬</div>
                <h4>Hỏi đáp</h4>
                <p>Gửi thắc mắc cho giảng viên</p>
              </div>
            </div>
          </div>

          <div className="tips-section">
            <h3>Mẹo học tập</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">💡</span>
                <p>Kiểm tra điểm thường xuyên để nắm bắt tiến độ học tập</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">⏰</span>
                <p>Nộp bài tập đúng hạn để đảm bảo điểm quá trình tốt</p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">📚</span>
                <p>Tải tài liệu về và ôn tập trước mỗi buổi học</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;