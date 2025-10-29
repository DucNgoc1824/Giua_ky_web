import React from 'react';
import '../assets/StatCard.css';

const StatCard = ({ icon: Icon, count, label, color = '#2196F3', onClick }) => {
  return (
    <div 
      className={`stat-card ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={{ '--card-color': color }}
    >
      <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
        <Icon style={{ color }} size={32} />
      </div>
      <div className="stat-content">
        <h3 className="stat-count">{count?.toLocaleString() || 0}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
};

export default StatCard;
