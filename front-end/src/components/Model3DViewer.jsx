import React, { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, Center, Stage } from '@react-three/drei';
import { FiRotateCw, FiZoomIn, FiZoomOut, FiMaximize2, FiAlertCircle } from 'react-icons/fi';
import PropTypes from 'prop-types';
import '../assets/Model3DViewer.css';

// Component hiển thị model 3D
function Model({ url }) {
  const gltf = useGLTF(url, true, (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  
  useEffect(() => {
    if (gltf && gltf.scene) {
      console.log('✅ Model loaded successfully');
    }
  }, [gltf]);
  
  if (!gltf || !gltf.scene) {
    return null;
  }
  
  return <primitive object={gltf.scene} />;
}

Model.propTypes = {
  url: PropTypes.string.isRequired
};

// Component Loading Spinner
function LoadingSpinner() {
  return (
    <div className="model3d-loading">
      <div className="spinner"></div>
      <p>Đang tải mô hình 3D...</p>
    </div>
  );
}

// Error Display Component
function ErrorDisplay({ error, onClose }) {
  return (
    <div className="model3d-error-display">
      <FiAlertCircle size={48} color="#ff6b6b" />
      <h3>Không thể tải mô hình 3D</h3>
      <p className="error-message">{error || 'File có thể bị hỏng hoặc không đúng định dạng GLB/GLTF'}</p>
      <div className="error-suggestions">
        <p><strong>Gợi ý:</strong></p>
        <ul>
          <li>Kiểm tra file có đúng định dạng .glb hoặc .gltf</li>
          <li>Thử tải lại file hoặc sử dụng file khác</li>
          <li>File có thể quá lớn (tối đa 50MB)</li>
        </ul>
      </div>
      <button className="btn-close-error" onClick={onClose}>Đóng</button>
    </div>
  );
}

ErrorDisplay.propTypes = {
  error: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

// Component Model3DViewer chính
function Model3DViewer({ modelUrl, title, onClose }) {
  const controlsRef = useRef();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef();
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset camera về vị trí ban đầu
  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Zoom in
  const handleZoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(1.2);
      controlsRef.current.update();
    }
  };

  // Zoom out
  const handleZoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(1.2);
      controlsRef.current.update();
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle errors
  const handleError = (error) => {
    console.error('3D Model Error:', error);
    setHasError(true);
    setErrorMessage(error.message || 'Không thể tải mô hình 3D');
  };

  return (
    <div className="model3d-viewer-overlay" onClick={onClose}>
      <div 
        className="model3d-viewer-container" 
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="model3d-header">
          <h3>{title || 'Xem mô hình 3D'}</h3>
          <button className="close-btn" onClick={onClose} aria-label="Đóng">
            ×
          </button>
        </div>

        {/* Show error or canvas */}
        {hasError ? (
          <ErrorDisplay error={errorMessage} onClose={onClose} />
        ) : (
          <div className="model3d-canvas-wrapper">
          <Canvas shadows dpr={[1, 2]} onError={handleError}>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            
            {/* Lighting */}
            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1} 
              castShadow 
            />
            <pointLight position={[-10, -10, -5]} intensity={0.5} />

            {/* Environment for reflections */}
            <Environment preset="studio" />

            {/* Model với Suspense */}
            <Suspense fallback={null}>
              <Center>
                <Stage environment="city" intensity={0.6}>
                  <Model url={modelUrl} />
                </Stage>
              </Center>
            </Suspense>

            {/* Controls */}
            <OrbitControls 
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={1}
              maxDistance={20}
              autoRotate={false}
              autoRotateSpeed={2}
            />
          </Canvas>

          {/* Loading overlay */}
          <Suspense fallback={<LoadingSpinner />} />
          </div>
        )}

        {/* Controls Bar - Only show if no error */}
        {!hasError && (
        <div className="model3d-controls">
          <button 
            className="control-btn" 
            onClick={handleReset}
            title="Reset camera"
          >
            <FiRotateCw /> Reset
          </button>
          <button 
            className="control-btn" 
            onClick={handleZoomIn}
            title="Zoom in"
          >
            <FiZoomIn /> Phóng to
          </button>
          <button 
            className="control-btn" 
            onClick={handleZoomOut}
            title="Zoom out"
          >
            <FiZoomOut /> Thu nhỏ
          </button>
          <button 
            className="control-btn" 
            onClick={toggleFullscreen}
            title="Fullscreen"
          >
            <FiMaximize2 /> {isFullscreen ? 'Thoát' : 'Toàn màn hình'}
          </button>
        </div>
        )}

        {/* Instructions - Only show if no error */}
        {!hasError && (
        <div className="model3d-instructions">
          <p>💡 <strong>Hướng dẫn:</strong> Kéo chuột để xoay | Cuộn chuột để zoom | Chuột phải để di chuyển</p>
        </div>
        )}
      </div>
    </div>
  );
}

Model3DViewer.propTypes = {
  modelUrl: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default Model3DViewer;
