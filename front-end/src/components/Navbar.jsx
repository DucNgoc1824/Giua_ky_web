import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaBars, 
  FaSignOutAlt, 
  FaChevronDown,
  FaUserCircle
} from 'react-icons/fa';
import '../assets/MainLayout.css';

const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1: return 'Quản trị viên';
      case 2: return 'Giảng viên';
      case 3: return 'Sinh viên';
      default: return 'Người dùng';
    }
  };

  const getAvatarColor = (roleId) => {
    switch(roleId) {
      case 1: return '#E2211C'; // Admin - Red
      case 2: return '#4CAF50'; // Lecturer - Green
      case 3: return '#2196F3'; // Student - Blue
      default: return '#9E9E9E';
    }
  };

  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="menu-toggle" onClick={onMenuToggle} aria-label="Toggle menu">
          <FaBars />
        </button>
        <div className="navbar-brand">
          Hệ thống Quản lý Sinh viên - PTIT
        </div>
      </div>
      
      <div className="navbar-actions">
        {/* User Dropdown */}
        <div className="user-menu" ref={dropdownRef}>
          <button 
            className="user-menu-button"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div 
              className="user-avatar"
              style={{ backgroundColor: getAvatarColor(user?.roleId) }}
            >
              {user?.fullName?.charAt(0) || <FaUserCircle />}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.fullName || user?.username}</span>
              <span className="user-role">{getRoleName(user?.roleId)}</span>
            </div>
            <FaChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
          </button>

          {showDropdown && (
            <div className="user-dropdown">
              <div className="dropdown-header">
                <div 
                  className="dropdown-avatar"
                  style={{ backgroundColor: getAvatarColor(user?.roleId) }}
                >
                  {user?.fullName?.charAt(0) || <FaUserCircle />}
                </div>
                <div>
                  <div className="dropdown-name">{user?.fullName || user?.username}</div>
                  <div className="dropdown-email">{user?.email || user?.username}</div>
                </div>
              </div>
              <div className="dropdown-divider"></div>
              <button className="dropdown-item" onClick={logout}>
                <FaSignOutAlt />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;