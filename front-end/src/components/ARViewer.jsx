import React from 'react';
import PropTypes from 'prop-types';
import '@google/model-viewer';

/**
 * ARViewer Component - Augmented Reality Model Viewer
 * Uses Google's model-viewer for AR support on iOS and Android
 * 
 * Features:
 * - AR Quick Look (iOS)
 * - Scene Viewer (Android)
 * - WebXR for VR headsets
 */

function ARViewer({ modelUrl, title, posterUrl, onClose }) {
  return (
    <div className="ar-viewer-overlay" onClick={onClose}>
      <div className="ar-viewer-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ar-viewer-header">
          <h3>{title || 'AR Viewer'}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        {/* Model Viewer */}
        <model-viewer
          src={modelUrl}
          poster={posterUrl}
          alt={title}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          environment-image="neutral"
          shadow-intensity="1"
          auto-rotate
          style={{
            width: '100%',
            height: '600px',
            backgroundColor: '#1a1a1a'
          }}
        >
          {/* AR Button */}
          <button 
            slot="ar-button" 
            style={{
              backgroundColor: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
          >
            👋 Xem AR trên điện thoại
          </button>

          {/* Loading message */}
          <div className="progress-bar" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
        </model-viewer>

        {/* Instructions */}
        <div className="ar-instructions">
          <h4>📱 Hướng dẫn sử dụng AR:</h4>
          <ul>
            <li><strong>iOS (iPhone/iPad):</strong> Click "Xem AR" → Quét sàn nhà → Đặt model</li>
            <li><strong>Android:</strong> Click "Xem AR" → Cho phép camera → Quét mặt phẳng</li>
            <li><strong>Desktop:</strong> Quét QR code bằng điện thoại để xem AR</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

ARViewer.propTypes = {
  modelUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  posterUrl: PropTypes.string, // Optional poster image while loading
  onClose: PropTypes.func.isRequired
};

export default ARViewer;
