import React from 'react';
import { FaCheckCircle, FaUpload, FaEdit, FaUserPlus, FaClipboardList } from 'react-icons/fa';
import '../assets/ActivityTimeline.css';

const ActivityTimeline = ({ activities = [] }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'grade':
        return <FaCheckCircle className="activity-icon success" />;
      case 'upload':
        return <FaUpload className="activity-icon info" />;
      case 'edit':
        return <FaEdit className="activity-icon warning" />;
      case 'create':
        return <FaUserPlus className="activity-icon primary" />;
      case 'assignment':
        return <FaClipboardList className="activity-icon secondary" />;
      default:
        return <FaCheckCircle className="activity-icon" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="activity-timeline">
      <h3>Hoạt động gần đây</h3>
      <div className="timeline-container">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                {getIcon(activity.type)}
              </div>
              <div className="timeline-content">
                <p className="activity-text">{activity.text}</p>
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            <p>Chưa có hoạt động nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimeline;
