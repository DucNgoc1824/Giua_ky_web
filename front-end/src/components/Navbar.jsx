import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/MainLayout.css'; // Chúng ta sẽ tạo file CSS chung này ngay sau đây

const Navbar = () => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout từ "kho"

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        Hệ thống Quản lý Sinh viên - PTIT
      </div>
      <div className="navbar-user">
        <span>Chào, {user?.fullName || user?.username}!</span>
        <button onClick={logout} className="logout-button">
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;