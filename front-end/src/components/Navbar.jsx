import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../assets/MainLayout.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          ☰
        </button>
        <div className="navbar-brand">
          Hệ thống Quản lý Sinh viên - PTIT
        </div>
      </div>
      <div className="navbar-user">
        <span>{user?.fullName || user?.username}</span>
        <button onClick={logout} className="logout-button">
          Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default Navbar;