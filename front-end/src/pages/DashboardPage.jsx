import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import '../assets/DashboardPage.css'; // Import CSS mới

// Component con cho Dashboard của Admin
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
    <div className="stats-grid">
      <div className="stat-card">
        <h3>Tổng số Sinh viên</h3>
        <p className="stat-number">{stats.students}</p>
      </div>
      <div className="stat-card">
        <h3>Tổng số Giảng viên</h3>
        <p className="stat-number">{stats.lecturers}</p>
      </div>
      <div className="stat-card">
        <h3>Tổng số Lớp học</h3>
        <p className="stat-number">{stats.classes}</p>
      </div>
      <div className="stat-card">
        <h3>Tổng số Môn học</h3>
        <p className="stat-number">{stats.subjects}</p>
      </div>
    </div>
  );
};

// Component chính
const DashboardPage = () => {
  const { user } = useAuth(); // Lấy thông tin user

  return (
    <div className="dashboard-page">
      <div className="welcome-banner">
        <h2>Chào mừng, {user.fullName}!</h2>
        <p>
          Bạn đã đăng nhập với vai trò: 
          <strong>
            {user.roleId === 1 ? ' Quản trị viên' : 
             user.roleId === 2 ? ' Giảng viên' : ' Sinh viên'}
          </strong>
        </p>
      </div>

      {/* Hiển thị nội dung tùy theo vai trò */}
      {user.roleId === 1 ? (
        <AdminDashboard />
      ) : (
        <div className="user-dashboard">
          <h2>Bắt đầu</h2>
          <p>Sử dụng thanh điều hướng (sidebar) bên trái để truy cập các chức năng của bạn.</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;