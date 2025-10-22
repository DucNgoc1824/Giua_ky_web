import React, { useState, useEffect } from 'react';
import subjectService from '../services/subjectService'; // Cần để lấy DS Môn
import courseMaterialService from '../services/courseMaterialService'; // Service mới
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const CourseMaterialPage = () => {
  // State
  const [subjects, setSubjects] = useState([]); // Danh sách môn học (cho dropdown)
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // Môn đang chọn
  const [materials, setMaterials] = useState([]); // Danh sách tài liệu của môn đó
  
  const [isLoading, setIsLoading] = useState(true); // Loading trang
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false); // Loading tài liệu
  const [error, setError] = useState(null);

  // State cho Modal (Thêm mới)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', url: '' });
  const [formError, setFormError] = useState(null);

  // 1. Tải danh sách Môn học (chỉ 1 lần)
  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await subjectService.getAllSubjects();
        setSubjects(data);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách môn học.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // 2. Tải danh sách Tài liệu (mỗi khi selectedSubjectId thay đổi)
  useEffect(() => {
    if (!selectedSubjectId) {
      setMaterials([]); // Nếu chưa chọn môn, danh sách rỗng
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
  }, [selectedSubjectId]); // <-- Chạy lại khi ID môn thay đổi

  // 3. Xử lý Form Modal
  const handleOpenAddModal = () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn một môn học trước khi thêm tài liệu.');
      return;
    }
    setFormData({ title: '', url: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      await courseMaterialService.addMaterial({
        ...formData,
        subject_id: parseInt(selectedSubjectId, 10),
      });
      // Tải lại danh sách tài liệu
      const data = await courseMaterialService.getMaterialsBySubject(selectedSubjectId);
      setMaterials(data);
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Lỗi khi thêm tài liệu.');
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (materialId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      try {
        await courseMaterialService.deleteMaterial(materialId);
        // Tải lại danh sách tài liệu
        const data = await courseMaterialService.getMaterialsBySubject(selectedSubjectId);
        setMaterials(data);
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // === RENDER ===
  if (isLoading) {
    return <div className="loading-text">Đang tải trang...</div>;
  }
  if (error && !isLoadingMaterials) {
     return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="course-material-page">
      <div className="page-header">
        <h1>Quản lý Tài liệu Môn học</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal} disabled={!selectedSubjectId}>
          Thêm Tài liệu mới
        </button>
      </div>

      {/* 1. Dropdown chọn Môn học */}
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

      {/* 2. Bảng hiển thị Tài liệu */}
      {isLoadingMaterials ? (
        <div className="loading-text">Đang tải tài liệu...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Đường dẫn (URL)</th>
              <th>Người thêm</th>
              <th>Ngày thêm</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {materials.length > 0 ? (
              materials.map((material) => (
                <tr key={material.material_id}>
                  <td>{material.title}</td>
                  <td>
                    <a href={material.url} target="_blank" rel="noopener noreferrer">
                      Link
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
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  {selectedSubjectId ? 'Chưa có tài liệu nào cho môn này.' : 'Vui lòng chọn môn học.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* === MODAL THÊM TÀI LIỆU === */}
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
            <label htmlFor="url">Đường dẫn (URL)</label>
            <input
              type="url" id="url" name="url"
              placeholder="https://example.com/file.pdf"
              value={formData.url} onChange={handleFormChange} required
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