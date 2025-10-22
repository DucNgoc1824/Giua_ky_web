import React, { useState, useEffect } from 'react';
import lecturerService from '../services/lecturerService'; // <-- Service mới
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

// Dữ liệu ban đầu cho form
const initialFormData = {
  username: '',
  password: '',
  full_name: '',
  email: '',
  lecturer_code: '',
  department: '',
};

const LecturerManagementPage = () => {
  const [lecturers, setLecturers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingLecturerId, setEditingLecturerId] = useState(null);
  const [formError, setFormError] = useState(null);

  // Hàm tải dữ liệu
  const fetchLecturers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await lecturerService.getAllLecturers();
      setLecturers(data);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu giảng viên.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  // Mở modal "Thêm mới"
  const handleOpenAddModal = () => {
    setEditingLecturerId(null);
    setFormData(initialFormData); // Reset form
    setFormError(null);
    setIsModalOpen(true);
  };

  // Mở modal "Sửa"
  const handleOpenEditModal = async (lecturer) => {
    try {
      setIsLoading(true);
      const lecturerDetails = await lecturerService.getLecturerById(lecturer.lecturer_id);
      setEditingLecturerId(lecturer.lecturer_id);
      setFormData({
        username: lecturerDetails.username,
        full_name: lecturerDetails.full_name,
        email: lecturerDetails.email,
        lecturer_code: lecturerDetails.lecturer_code,
        department: lecturerDetails.department || '',
        password: '', // Để trống
      });
      setFormError(null);
      setIsModalOpen(true);
    } catch (err) {
      alert('Lỗi khi lấy chi tiết GV: ' + err.message);
    } finally {
      setIsLoading(false);
    }
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

  // Xử lý "Lưu" form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingLecturerId) {
        // --- Chế độ Sửa ---
        const dataToUpdate = {
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department,
        };
        await lecturerService.updateLecturer(editingLecturerId, dataToUpdate);
      } else {
        // --- Chế độ Thêm mới ---
        if (!formData.password) {
          setFormError('Mật khẩu là bắt buộc khi tạo mới.');
          return;
        }
        await lecturerService.createLecturer(formData);
      }
      fetchLecturers(); // Tải lại
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

  // Xử lý "Xóa"
  const handleDelete = async (lecturerId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      try {
        await lecturerService.deleteLecturer(lecturerId);
        fetchLecturers();
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // === RENDER ===
  if (isLoading && !isModalOpen) {
    return <div className="loading-text">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="lecturer-management-page">
      <div className="page-header">
        <h1>Quản lý Giảng viên</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Thêm Giảng viên
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã GV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Tên đăng nhập</th>
            <th>Khoa/Bộ môn</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.length > 0 ? (
            lecturers.map((lecturer) => (
              <tr key={lecturer.lecturer_id}>
                <td>{lecturer.lecturer_code}</td>
                <td>{lecturer.full_name}</td>
                <td>{lecturer.email}</td>
                <td>{lecturer.username}</td>
                <td>{lecturer.department}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditModal(lecturer)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(lecturer.lecturer_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                Chưa có giảng viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL THÊM/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLecturerId ? 'Chỉnh sửa Giảng viên' : 'Thêm Giảng viên mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          {editingLecturerId && (
             <>
              <div className="form-group">
                <label>Tên đăng nhập (Không thể sửa)</label>
                <input type="text" value={formData.username} disabled />
              </div>
              <div className="form-group">
                <label>Mã GV (Không thể sửa)</label>
                <input type="text" value={formData.lecturer_code} disabled />
              </div>
             </>
          )}

          {!editingLecturerId && (
            <>
              <div className="form-group">
                <label htmlFor="username">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username" name="username"
                  value={formData.username}
                  onChange={handleFormChange} required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password" name="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  required={!editingLecturerId} 
                />
              </div>
               <div className="form-group">
                <label htmlFor="lecturer_code">Mã Giảng viên</label>
                <input
                  type="text"
                  id="lecturer_code" name="lecturer_code"
                  value={formData.lecturer_code}
                  onChange={handleFormChange} required
                />
              </div>
            </>
          )}
          
           <div className="form-group">
            <label htmlFor="full_name">Họ và Tên</label>
            <input
              type="text"
              id="full_name" name="full_name"
              value={formData.full_name}
              onChange={handleFormChange} required
            />
          </div>
           <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email" name="email"
              value={formData.email}
              onChange={handleFormChange} required
            />
          </div>
           <div className="form-group">
            <label htmlFor="department">Khoa/Bộ môn</label>
            <input
              type="text"
              id="department" name="department"
              value={formData.department}
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

export default LecturerManagementPage;