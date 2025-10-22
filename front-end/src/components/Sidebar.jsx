import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- 1. Import useAuth
import '../assets/MainLayout.css';

const Sidebar = () => {
  const { user } = useAuth(); // <--- 2. Lấy thông tin user (để biết roleId)

  // 3. Định nghĩa các link chung
  const commonLinks = (
    <li>
      <NavLink to="/" end
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Dashboard
      </NavLink>
    </li>
  );

  // 4. Định nghĩa các link chỉ Admin (roleId === 1) mới thấy
  const adminLinks = (
    <>
      <li>
        <NavLink to="/students"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Quản lý Sinh viên
        </NavLink>
      </li>
      <li>
        <NavLink to="/lecturers"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Quản lý Giảng viên
        </NavLink>
      </li>
      <li>
        <NavLink to="/classes"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Quản lý Lớp học
        </NavLink>
      </li>
      <li>
        <NavLink to="/subjects"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Quản lý Môn học
        </NavLink>
      </li>
      <li>
      <NavLink to="/materials" // <--- THÊM 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Quản lý Tài liệu
      </NavLink>
    </li>
    <li>
      <NavLink to="/assignments" // <--- THÊM
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Phân công Giảng dạy
      </NavLink>
    </li>
    </>
  );

    // 5. Định nghĩa các link chỉ Giảng viên (roleId === 2) mới thấy
  const lecturerLinks = (
    <>
      <li>
        <NavLink to="/manage-grades"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Nhập/Sửa Điểm
        </NavLink>
      </li>
      <li>
        <NavLink to="/tickets-inbox" // <--- LINK MỚI
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Hòm thư Hỏi đáp
        </NavLink>
      </li>
      <li>
        <NavLink to="/materials"
          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
        >
          Quản lý Tài liệu
        </NavLink>
      </li>
    </>
  );

  // 6. Định nghĩa các link chỉ Sinh viên (roleId === 3) mới thấy
  const studentLinks = (
    <li>
      <NavLink to="/my-grades"
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Xem điểm
      </NavLink>
    </li>
  );

  return (
    <aside className="sidebar">
      <ul className="sidebar-nav">
        {commonLinks}
        
        {/* 7. Dùng toán tử 3 ngôi để render link dựa trên vai trò */}
        {user?.roleId === 1 && adminLinks}
        {user?.roleId === 2 && lecturerLinks}
        {user?.roleId === 3 && studentLinks}

      </ul>
    </aside>
  );
};

export default Sidebar;