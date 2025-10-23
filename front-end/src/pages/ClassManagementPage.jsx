import React, { useState, useEffect } from 'react';
import classService from '../services/classService';
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_code: '',
    major: '',
  });
  const [editingClassId, setEditingClassId] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu lớp học.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingClassId(null);
    setFormData({ class_code: '', major: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lop) => {
    setEditingClassId(lop.class_id);
    setFormData({ class_code: lop.class_code, major: lop.major });
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

    try {
      if (editingClassId) {
        await classService.updateClass(editingClassId, formData);
      } else {
        await classService.createClass(formData);
      }
      
      fetchClasses();
      handleCloseModal();
      
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await classService.deleteClass(classId);
        fetchClasses();
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
    <div className="class-management-page">
      <div className="page-header">
        <h1>Quản lý Lớp học</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Thêm Lớp mới
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã lớp</th>
            <th>Ngành học</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((lop) => (
              <tr key={lop.class_id}>
                <td>{lop.class_id}</td>
                <td>{lop.class_code}</td>
                <td>{lop.major}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditModal(lop)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(lop.class_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center' }}>
                Chưa có lớp học nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClassId ? 'Chỉnh sửa Lớp học' : 'Thêm Lớp học mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="class_code">Mã lớp</label>
            <input
              type="text"
              id="class_code"
              name="class_code"
              value={formData.class_code}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="major">Ngành học</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleFormChange}
              required
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

export default ClassManagementPage;