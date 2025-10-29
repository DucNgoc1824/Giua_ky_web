import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaChevronRight } from 'react-icons/fa';
import '../assets/Breadcrumb.css';

const Breadcrumb = () => {
  const location = useLocation();
  
  // Map routes to Vietnamese labels
  const routeLabels = {
    '/': 'Trang chủ',
    '/students': 'Quản lý sinh viên',
    '/lecturers': 'Quản lý giảng viên',
    '/subjects': 'Quản lý môn học',
    '/classes': 'Quản lý lớp học',
    '/manage-grades': 'Quản lý điểm',
    '/view-grades': 'Xem điểm',
    '/my-grades': 'Điểm của tôi',
    '/materials': 'Tài liệu học tập',
    '/course-materials': 'Tài liệu học tập',
    '/tickets': 'Hòm thư góp ý',
    '/tickets-inbox': 'Hòm thư góp ý',
    '/assignments': 'Bài tập',
  };

  // Generate breadcrumb items from current path
  const pathnames = location.pathname.split('/').filter((x) => x);
  
  // Don't show breadcrumb on login page or home page
  if (location.pathname === '/login' || location.pathname === '/') {
    return null;
  }

  return (
    <nav className="breadcrumb-container" aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            <FaHome className="breadcrumb-icon" />
            <span>Trang chủ</span>
          </Link>
        </li>
        
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = routeLabels[routeTo] || name;

          return (
            <li key={routeTo} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              <FaChevronRight className="breadcrumb-separator" />
              {isLast ? (
                <span className="breadcrumb-current">{label}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
