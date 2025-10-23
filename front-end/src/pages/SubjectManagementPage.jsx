import React, { useState, useEffect } from 'react';
import subjectService from '../services/subjectService';
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    credits: '',
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu môn học.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSubjectId(null);
    setFormData({ subject_code: '', subject_name: '', credits: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subject) => {
    setEditingSubjectId(subject.subject_id);
    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      credits: subject.credits,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const dataToSubmit = {
      ...formData,
      credits: parseInt(formData.credits, 10),
    };
    
    if (isNaN(dataToSubmit.credits) || dataToSubmit.credits <= 0) {
      setFormError('Số tín chỉ phải là một số dương.');
      return;
    }

    try {
      if (editingSubjectId) {
        await subjectService.updateSubject(editingSubjectId, dataToSubmit);
      } else {
        await subjectService.createSubject(dataToSubmit);
      }
      fetchSubjects();
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await subjectService.deleteSubject(subjectId);
        fetchSubjects();
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-text">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="subject-management-page">
      <div className="page-header">
        <h1>Quản lý Môn học</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Thêm Môn mới
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã môn học</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <tr key={subject.subject_id}>
                <td>{subject.subject_id}</td>
                <td>{subject.subject_code}</td>
                <td>{subject.subject_name}</td>
                <td>{subject.credits}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditModal(subject)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(subject.subject_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Chưa có môn học nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL THÊM/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubjectId ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="subject_code">Mã môn học</label>
            <input
              type="text"
              id="subject_code"
              name="subject_code"
              value={formData.subject_code}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject_name">Tên môn học</label>
            <input
              type="text"
              id="subject_name"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="credits">Số tín chỉ</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleFormChange}
              required
              min="1"
            />
          </div>
          
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagementPage;