import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaTachometerAlt, 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaSchool, 
  FaBook, 
  FaFolderOpen,
  FaPencilAlt,
  FaClipboardList,
  FaInbox,
  FaTrophy,
  FaTasks
} from 'react-icons/fa';
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
        <FaTachometerAlt className="nav-icon" />
        <span>Dashboard</span>
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
          <FaUserGraduate className="nav-icon" />
          <span>Quản lý Sinh viên</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/lecturers"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaChalkboardTeacher className="nav-icon" />
          <span>Quản lý Giảng viên</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/classes"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaSchool className="nav-icon" />
          <span>Quản lý Lớp học</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/subjects"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaBook className="nav-icon" />
          <span>Quản lý Môn học</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaFolderOpen className="nav-icon" />
          <span>Quản lý Tài liệu</span>
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
          <FaPencilAlt className="nav-icon" />
          <span>Nhập/Sửa Điểm</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/view-grades"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaClipboardList className="nav-icon" />
          <span>Xem Điểm</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/tickets-inbox"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaInbox className="nav-icon" />
          <span>Hòm thư Hỏi đáp</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaFolderOpen className="nav-icon" />
          <span>Quản lý Tài liệu</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/assignments"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaTasks className="nav-icon" />
          <span>Quản lý Bài tập</span>
        </NavLink>
      </li>
    </>
  );

  const studentLinks = (
    <>
      <li>
        <NavLink 
          to="/my-grades"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaTrophy className="nav-icon" />
          <span>Xem điểm</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaFolderOpen className="nav-icon" />
          <span>Tài liệu học tập</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/tickets-inbox"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaInbox className="nav-icon" />
          <span>Hỏi đáp</span>
        </NavLink>
      </li>
      <li>
        <NavLink 
          to="/assignments"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          onClick={handleLinkClick}
        >
          <FaTasks className="nav-icon" />
          <span>Bài tập</span>
        </NavLink>
      </li>
    </>
  );

  return (
    <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
      <div className="sidebar-header">
        <FaBook className="sidebar-logo" />
        <h3>Menu</h3>
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