import React, { useState, useEffect } from 'react';
import subjectService from '../services/subjectService';
import lecturerService from '../services/lecturerService';
import courseMaterialService from '../services/courseMaterialService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Model3DViewer from '../components/Model3DViewer';
import { FiEye, FiDownload, FiBox } from 'react-icons/fi';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';
const BACKEND_URL = 'http://localhost:8080';

const CourseMaterialPage = () => {
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [materials, setMaterials] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', file: null }); 
  const [formError, setFormError] = useState(null);

  // 3D Viewer state
  const [is3DViewerOpen, setIs3DViewerOpen] = useState(false);
  const [current3DModel, setCurrent3DModel] = useState(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let data;
        if (user?.roleId === 2 && user?.lecturerId) {
          data = await lecturerService.getSubjectsByLecturer(user.lecturerId);
        } else {
          data = await subjectService.getAllSubjects();
        }
        setSubjects(data);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách môn học.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, [user]);

  useEffect(() => {
    if (!selectedSubjectId) {
      setMaterials([]);
      return;
    }

    const fetchMaterials = async () => {
      setIsLoadingMaterials(true);
      setError(null);
      try {
        const data = await courseMaterialService.getMaterialsBySubject(selectedSubjectId);
        setMaterials(data);
      } catch (err) {
        setError(err.message || 'Không thể tải tài liệu cho môn này.');
      } finally {
        setIsLoadingMaterials(false);
      }
    };
    fetchMaterials();
  }, [selectedSubjectId]);

  const handleOpenAddModal = () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn một môn học trước khi thêm tài liệu.');
      return;
    }
    setFormData({ title: '', file: null });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'file') {
      setFormData(prev => ({ ...prev, file: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    if (!formData.file) {
      setFormError('Vui lòng chọn một file.');
      return;
    }
    
    const dataToSend = new FormData();
    dataToSend.append('subject_id', selectedSubjectId);
    dataToSend.append('title', formData.title);
    dataToSend.append('file', formData.file);

    try {
      await courseMaterialService.addMaterial(dataToSend);
      
      const data = await courseMaterialService.getMaterialsBySubject(selectedSubjectId);
      setMaterials(data);
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi thêm tài liệu.');
    }
  };

  const handleDelete = async (materialId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      try {
        await courseMaterialService.deleteMaterial(materialId);
        const data = await courseMaterialService.getMaterialsBySubject(selectedSubjectId);
        setMaterials(data);
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // Handle 3D model view
  const handle3DView = (material) => {
    setCurrent3DModel({
      url: `${BACKEND_URL}${material.url}`,
      title: material.title
    });
    setIs3DViewerOpen(true);
  };

  const handleClose3DViewer = () => {
    setIs3DViewerOpen(false);
    setCurrent3DModel(null);
  };

  // Check if file is 3D model
  const is3DModel = (material) => {
    return material.file_type === '3d_model' || 
           material.url?.toLowerCase().endsWith('.glb') || 
           material.url?.toLowerCase().endsWith('.gltf');
  };

  if (isLoading) {
    return <div className="loading-text">Đang tải trang...</div>;
  }
  if (error && !isLoadingMaterials) {
     return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="course-material-page">
      <div className="page-header">
        <h1>📚 {user?.roleId === 3 ? 'Tài liệu Học tập' : 'Quản lý Tài liệu Môn học'}</h1>
        {(user?.roleId === 1 || user?.roleId === 2) && (
          <button 
            className="btn btn-primary" 
            onClick={handleOpenAddModal} 
            disabled={!selectedSubjectId}
            title={!selectedSubjectId ? "Vui lòng chọn môn học trước" : "Thêm tài liệu mới"}
          >
            ➕ Thêm Tài liệu mới
          </button>
        )}
      </div>

      {!selectedSubjectId && (
        <div className="info-message" style={{ 
          backgroundColor: '#fff3cd', 
          color: '#856404', 
          padding: '1rem 1.5rem', 
          borderRadius: '8px',
          marginBottom: '1.5rem',
          border: '1px solid #ffeaa7',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>💡</span>
          <span style={{ fontWeight: '500' }}>
            {user?.roleId === 3 ? 'Chọn một môn học bên dưới để xem tài liệu' : 'Chọn một môn học bên dưới để xem và quản lý tài liệu'}
          </span>
        </div>
      )}

      <div className="form-group" style={{ maxWidth: '500px', marginBottom: '2rem' }}>
        <label htmlFor="subject_select" style={{ fontWeight: '600', fontSize: '1.1rem', marginBottom: '0.75rem', display: 'block' }}>
          📖 Chọn Môn học:
        </label>
        <select
          id="subject_select"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          style={{ 
            padding: '0.75rem 1rem', 
            fontSize: '1rem', 
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ddd',
            cursor: 'pointer'
          }}
        >
          <option value="">-- Chọn môn học để xem tài liệu --</option>
          {subjects.map(s => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_code} - {s.subject_name}
            </option>
          ))}
        </select>
        {selectedSubjectId && (
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            📄 {materials.length} tài liệu
          </div>
        )}
      </div>

      {!selectedSubjectId ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#999'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📚</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Chưa chọn môn học
          </div>
          <div style={{ fontSize: '0.95rem' }}>
            Vui lòng chọn môn học từ danh sách bên trên để xem tài liệu
          </div>
        </div>
      ) : isLoadingMaterials ? (
        <div className="loading-text">Đang tải tài liệu...</div>
      ) : materials.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          color: '#999'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
          <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            Chưa có tài liệu nào
          </div>
          <div style={{ fontSize: '0.95rem' }}>
            {subjects.find(s => s.subject_id === parseInt(selectedSubjectId))?.subject_name} chưa có tài liệu được tải lên
          </div>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Người thêm</th>
              <th>Ngày thêm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((material) => (
                <tr key={material.material_id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {/* Icon for 3D models */}
                      {is3DModel(material) && (
                        <FiBox style={{ color: '#667eea', fontSize: '20px' }} />
                      )}
                      
                      {/* Title with appropriate link/button */}
                      {is3DModel(material) ? (
                        <button
                          onClick={() => handle3DView(material)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#667eea',
                            fontWeight: '600',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontSize: '1rem',
                            padding: 0
                          }}
                          title="Xem mô hình 3D"
                        >
                          {material.title}
                        </button>
                      ) : (
                        <a 
                          href={`${BACKEND_URL}${material.url}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{fontWeight: '600', textDecoration: 'none'}}
                        >
                          {material.title}
                        </a>
                      )}
                    </div>
                  </td>

                  <td>{material.added_by}</td>
                  <td>{new Date(material.created_at).toLocaleDateString()}</td>
                  {(user?.roleId === 1 || user?.roleId === 2) && (
                    <td className="actions">
                      {/* View button for 3D models */}
                      {is3DModel(material) && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handle3DView(material)}
                          style={{ marginRight: '8px' }}
                          title="Xem 3D"
                        >
                          <FiEye /> Xem 3D
                        </button>
                      )}
                      
                      {/* Delete button */}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(material.material_id)}
                      >
                        Xóa
                      </button>
                    </td>
                  )}
                  
                  {/* Student view - show view and download buttons */}
                  {user?.roleId === 3 && (
                    <td className="actions">
                      {/* View button for 3D models */}
                      {is3DModel(material) && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handle3DView(material)}
                          style={{ marginRight: '8px' }}
                          title="Xem mô hình 3D"
                        >
                          <FiEye /> Xem 3D
                        </button>
                      )}
                      
                      {/* Download button for all files */}
                      <a
                        href={`${BACKEND_URL}${material.url}`}
                        download
                        className="btn btn-secondary"
                        style={{ textDecoration: 'none' }}
                        title="Tải xuống"
                      >
                        <FiDownload /> Tải về
                      </a>
                    </td>
                  )}
                </tr>
              ))
            ) : null}
          </tbody>
        </table>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Thêm Tài liệu mới">
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề (VD: Slide Bài 1)</label>
            <input
              type="text" id="title" name="title"
              value={formData.title} onChange={handleFormChange} required
            />
          </div>
          <div className="form-group">
            <label htmlFor="file">Chọn File (Tối đa 10MB)</label>
            <input
              type="file" id="file" name="file"
              onChange={handleFormChange} required
            />
          </div>
          
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Hủy</button>
            <button type="submit" className="btn btn-primary">Lưu</button>
          </div>
        </form>
      </Modal>

      {/* 3D Model Viewer */}
      {is3DViewerOpen && current3DModel && (
        <Model3DViewer 
          modelUrl={current3DModel.url}
          title={current3DModel.title}
          onClose={handleClose3DViewer}
        />
      )}
    </div>
  );
};

export default CourseMaterialPage;