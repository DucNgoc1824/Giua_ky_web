import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/MainLayout.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      onClose();
    }
  };

  const commonLinks = (
    <li>
      <NavLink 
        to="/" 
        end
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        onClick={handleLinkClick}
      >
        📊 Dashboard
      </NavLink>
    </li>
  );

  const adminLinks = (
    <>
      <li>
        <NavLink 
          to="/students"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          👨‍🎓 Quản lý Sinh viên
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/lecturers"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          👨‍🏫 Quản lý Giảng viên
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/classes"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          🏫 Quản lý Lớp học
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/subjects"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          📚 Quản lý Môn học
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          📁 Quản lý Tài liệu
        </NavLink>
      </li>
    </>
  );

  const lecturerLinks = (
    <>
      <li>
        <NavLink 
          to="/manage-grades"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          ✏️ Nhập/Sửa Điểm
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/view-grades"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          📋 Xem Điểm
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/tickets-inbox"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          📬 Hòm thư Hỏi đáp
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          📁 Quản lý Tài liệu
        </NavLink>
      </li>
    </>
  );

  const studentLinks = (
    <li>
      <NavLink 
        to="/my-grades"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        onClick={handleLinkClick}
      >
        🎯 Xem điểm
      </NavLink>
    </li>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <h3>📚 Menu</h3>
      </div>
      <ul className="sidebar-nav">
        {commonLinks}
        
        {user?.roleId === 1 && adminLinks}
        {user?.roleId === 2 && lecturerLinks}
        {user?.roleId === 3 && studentLinks}
      </ul>
    </aside>
  );
};

export default Sidebar;