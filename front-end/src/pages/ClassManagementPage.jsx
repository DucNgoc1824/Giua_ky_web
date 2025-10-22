import React, { useState, useEffect } from 'react';
import classService from '../services/classService';
import Modal from '../components/Modal'; // <--- 1. Import Modal
import '../assets/ManagementPage.css';
import '../assets/Modal.css'; // <--- 2. Import CSS của Modal

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // === STATE MỚI CHO MODAL VÀ FORM ===
  
  // 3. State điều khiển modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 4. State lưu dữ liệu form (cho cả Thêm và Sửa)
  const [formData, setFormData] = useState({
    class_code: '',
    major: '',
  });
  
  // 5. State để biết đang "Thêm" hay "Sửa" (null: Thêm, class_id: Sửa)
  const [editingClassId, setEditingClassId] = useState(null);
  
  // 6. State cho lỗi của riêng form
  const [formError, setFormError] = useState(null);

  // === HÀM TẢI DỮ LIỆU (Giữ nguyên) ===
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

  // === CÁC HÀM XỬ LÝ MỚI ===

  // 7. Mở modal ở chế độ "Thêm mới"
  const handleOpenAddModal = () => {
    setEditingClassId(null); // Không có ID nào đang sửa
    setFormData({ class_code: '', major: '' }); // Form trống
    setFormError(null); // Xóa lỗi form cũ
    setIsModalOpen(true);
  };

  // 8. Mở modal ở chế độ "Sửa"
  const handleOpenEditModal = (lop) => {
    setEditingClassId(lop.class_id); // Lưu ID lớp đang sửa
    setFormData({ class_code: lop.class_code, major: lop.major }); // Đổ dữ liệu cũ vào form
    setFormError(null);
    setIsModalOpen(true);
  };

  // 9. Đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 10. Cập nhật state formData khi gõ vào input
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 11. Xử lý khi nhấn nút "Lưu" trên form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingClassId) {
        // --- Chế độ Sửa ---
        await classService.updateClass(editingClassId, formData);
      } else {
        // --- Chế độ Thêm mới ---
        await classService.createClass(formData);
      }
      
      fetchClasses(); // Tải lại danh sách lớp
      handleCloseModal(); // Đóng modal
      
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  // 12. Xử lý khi nhấn nút "Xóa"
  const handleDelete = async (classId) => {
    // Hiển thị hộp thoại xác nhận
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await classService.deleteClass(classId);
        fetchClasses(); // Tải lại danh sách lớp
      } catch (err) {
        // Hiển thị lỗi (vd: không thể xóa lớp đang có SV)
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // === RENDER ===
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
        {/* Nút này giờ sẽ mở modal */}
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Thêm Lớp mới
        </button>
      </div>

      {/* Bảng dữ liệu */}
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
                  {/* Nút Sửa giờ sẽ mở modal */}
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditModal(lop)}
                  >
                    Sửa
                  </button>
                  {/* Nút Xóa giờ sẽ gọi hàm handleDelete */}
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

      {/* === MODAL THÊM/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        // Tiêu đề thay đổi tùy theo chế độ
        title={editingClassId ? 'Chỉnh sửa Lớp học' : 'Thêm Lớp học mới'}
      >
        {/* Đây là phần 'children' được truyền vào Modal */}
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
          
          {/* Hiển thị lỗi của form nếu có */}
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