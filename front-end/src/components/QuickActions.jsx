import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaCalendar, 
  FaFileUpload, 
  FaClipboardList,
  FaChartBar,
  FaEnvelope
} from 'react-icons/fa';
import '../assets/QuickActions.css';

const QuickActions = ({ role }) => {
  const navigate = useNavigate();

  const adminActions = [
    {
      icon: FaPlus,
      label: 'Thêm sinh viên',
      color: '#667eea',
      onClick: () => navigate('/students'),
    },
    {
      icon: FaPlus,
      label: 'Thêm giảng viên',
      color: '#764ba2',
      onClick: () => navigate('/lecturers'),
    },
    {
      icon: FaChartBar,
      label: 'Xem báo cáo',
      color: '#10b981',
      onClick: () => navigate('/'),
    },
    {
      icon: FaEnvelope,
      label: 'Góp ý',
      color: '#f59e0b',
      onClick: () => navigate('/tickets-inbox'),
    },
  ];

  const lecturerActions = [
    {
      icon: FaClipboardList,
      label: 'Quản lý điểm',
      color: '#667eea',
      onClick: () => navigate('/manage-grades'),
    },
    {
      icon: FaFileUpload,
      label: 'Tài liệu',
      color: '#10b981',
      onClick: () => navigate('/materials'),
    },
    {
      icon: FaCalendar,
      label: 'Lịch dạy',
      color: '#764ba2',
      onClick: () => navigate('/'),
    },
    {
      icon: FaEnvelope,
      label: 'Hòm thư',
      color: '#f59e0b',
      onClick: () => navigate('/tickets-inbox'),
    },
  ];

  const studentActions = [
    {
      icon: FaChartBar,
      label: 'Xem điểm',
      color: '#667eea',
      onClick: () => navigate('/my-grades'),
    },
    {
      icon: FaFileUpload,
      label: 'Tài liệu',
      color: '#10b981',
      onClick: () => navigate('/materials'),
    },
    {
      icon: FaEnvelope,
      label: 'Hỏi đáp',
      color: '#f59e0b',
      onClick: () => navigate('/tickets-inbox'),
    },
    {
      icon: FaCalendar,
      label: 'Lịch học',
      color: '#764ba2',
      onClick: () => navigate('/'),
    },
  ];

  const getActions = () => {
    switch (role) {
      case 1:
        return adminActions;
      case 2:
        return lecturerActions;
      case 3:
        return studentActions;
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <div className="quick-actions">
      <h3>Thao tác nhanh</h3>
      <div className="actions-grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="action-card"
            onClick={action.onClick}
            style={{ '--action-color': action.color }}
          >
            <div className="action-icon" style={{ backgroundColor: action.color }}>
              <action.icon />
            </div>
            <span className="action-label">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
