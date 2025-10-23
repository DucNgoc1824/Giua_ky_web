import React, { useState, useEffect } from 'react';
import subjectService from '../services/subjectService';
import lecturerService from '../services/lecturerService';
import courseMaterialService from '../services/courseMaterialService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
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

  if (isLoading) {
    return <div className="loading-text">Đang tải trang...</div>;
  }
  if (error && !isLoadingMaterials) {
     return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="course-material-page">
      <div className="page-header">
        <h1>📚 Quản lý Tài liệu Môn học</h1>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenAddModal} 
          disabled={!selectedSubjectId}
          title={!selectedSubjectId ? "Vui lòng chọn môn học trước" : "Thêm tài liệu mới"}
        >
          ➕ Thêm Tài liệu mới
        </button>
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
          <span style={{ fontWeight: '500' }}>Chọn một môn học bên dưới để xem và quản lý tài liệu</span>
        </div>
      )}

      <div className="form-group" style={{ maxWidth: '400px', marginBottom: '2rem' }}>
        <label htmlFor="subject_select" style={{ fontWeight: '600' }}>Chọn Môn học để quản lý:</label>
        <select
          id="subject_select"
          value={selectedSubjectId}
          onChange={(e) => setSelectedSubjectId(e.target.value)}
          style={{ padding: '0.75rem', fontSize: '1rem', marginTop: '0.5rem' }}
        >
          <option value="">-- Chọn môn học --</option>
          {subjects.map(s => (
            <option key={s.subject_id} value={s.subject_id}>
              {s.subject_code} - {s.subject_name}
            </option>
          ))}
        </select>
      </div>

      {isLoadingMaterials ? (
        <div className="loading-text">Đang tải tài liệu...</div>
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
                    <a 
                      href={`${BACKEND_URL}${material.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{fontWeight: '600', textDecoration: 'none'}}
                    >
                      {material.title}
                    </a>
                  </td>

                  <td>{material.added_by}</td>
                  <td>{new Date(material.created_at).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(material.material_id)}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  {selectedSubjectId ? 'Chưa có tài liệu nào cho môn này.' : 'Vui lòng chọn môn học.'}
                </td>
              </tr>
            )}
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
    </div>
  );
};

export default CourseMaterialPage;