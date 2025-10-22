import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import classService from '../services/classService'; // <-- Import service Lớp
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

// Dữ liệu ban đầu cho form
const initialFormData = {
  username: '',
  password: '',
  full_name: '',
  email: '',
  student_code: '',
  class_id: '', // Sẽ là số
  date_of_birth: '', // Sẽ là string YYYY-MM-DD
  address: '',
};

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]); // <-- State cho danh sách Lớp
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingStudentId, setEditingStudentId] = useState(null); // <-- ID của Student
  const [formError, setFormError] = useState(null);

  // Hàm tải DỮ LIỆU (cả SV và Lớp)
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Dùng Promise.all để tải song song 2 API
      const [studentsData, classesData] = await Promise.all([
        studentService.getAllStudents(),
        classService.getAllClasses(),
      ]);
      setStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      const errorMsg = err.message || 'Không thể tải dữ liệu.';
      console.error(err);
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Mở modal "Thêm mới"
  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setFormData(initialFormData); // Reset form
    setFormError(null);
    setIsModalOpen(true);
  };

  // Mở modal "Sửa"
  const handleOpenEditModal = async (student) => {
    // Khi sửa, chúng ta không sửa username/password
    // Chúng ta cần lấy chi tiết SV (vì bảng JOIN thiếu 1 vài cột)
    try {
       setIsLoading(true); // Hiển thị loading tạm thời
       const studentDetails = await studentService.getStudentById(student.student_id);
       setEditingStudentId(student.student_id);
       setFormData({
         username: studentDetails.username, // Hiển thị, nhưng không cho sửa
         full_name: studentDetails.full_name,
         email: studentDetails.email,
         student_code: studentDetails.student_code, // Hiển thị, không cho sửa
         class_id: studentDetails.class_id, // Lớp hiện tại
         date_of_birth: studentDetails.date_of_birth ? studentDetails.date_of_birth.split('T')[0] : '', // Format YYYY-MM-DD
         address: studentDetails.address || '',
         password: '', // Để trống
       });
       setFormError(null);
       setIsModalOpen(true);
    } catch (err) {
       alert('Lỗi khi lấy chi tiết SV: ' + err.message);
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
      if (editingStudentId) {
        // --- Chế độ Sửa ---
        // Khi Sửa, ta chỉ gửi các trường được phép sửa
        const dataToUpdate = {
          full_name: formData.full_name,
          email: formData.email,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address || null,
          // (Backend của chúng ta chưa hỗ trợ đổi Lớp, nên ta không gửi class_id)
        };
        await studentService.updateStudent(editingStudentId, dataToUpdate);
      } else {
        // --- Chế độ Thêm mới ---
        if (!formData.password) {
          setFormError('Mật khẩu là bắt buộc khi tạo mới.');
          return;
        }
        if (!formData.class_id) {
           setFormError('Vui lòng chọn lớp.');
           return;
        }
        await studentService.createStudent({
          ...formData,
          class_id: parseInt(formData.class_id, 10), // Đảm bảo class_id là số
        });
      }
      fetchData(); // Tải lại (cả SV và Lớp)
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

  // Xử lý "Xóa"
  const handleDelete = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này? (Hành động này sẽ xóa cả tài khoản đăng nhập và không thể hoàn tác)')) {
      try {
        await studentService.deleteStudent(studentId);
        fetchData();
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // === RENDER ===
  if (isLoading && !isModalOpen) { // Chỉ show loading chính khi không ở trong modal
    return <div className="loading-text">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="student-management-page">
      <div className="page-header">
        <h1>Quản lý Sinh viên</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          Thêm Sinh viên
        </button>
      </div>

      {/* Bảng dữ liệu */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Mã SV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Tên đăng nhập</th>
            <th>Lớp</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student.student_id}>
                <td>{student.student_code}</td>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.username}</td>
                <td>{student.class_code}</td>
                <td className="actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleOpenEditModal(student)}
                  >
                    Sửa
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(student.student_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
                Chưa có sinh viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL THÊM/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStudentId ? 'Chỉnh sửa Sinh viên' : 'Thêm Sinh viên mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          {/* Phần này hiển thị các trường không được sửa 
            (username, student_code) khi ở chế độ "Sửa"
          */}
          {editingStudentId && (
             <>
              <div className="form-group">
                <label>Tên đăng nhập (Không thể sửa)</label>
                <input type="text" value={formData.username} disabled />
              </div>
              <div className="form-group">
                <label>Mã SV (Không thể sửa)</label>
                <input type="text" value={formData.student_code} disabled />
              </div>
               <div className="form-group">
                <label>Lớp (Không thể sửa)</label>
                 <select
                  value={formData.class_id}
                  disabled
                >
                  {classes.map(c => (
                    <option key={c.class_id} value={c.class_id}>
                      {c.class_code}
                    </option>
                  ))}
                </select>
              </div>
             </>
          )}

          {/* Phần này chỉ hiển thị khi "Thêm mới" 
            (username, password, student_code, class_id)
          */}
          {!editingStudentId && (
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
                  // required chỉ khi thêm mới
                  required={!editingStudentId} 
                />
              </div>
               <div className="form-group">
                <label htmlFor="student_code">Mã Sinh viên</label>
                <input
                  type="text"
                  id="student_code" name="student_code"
                  value={formData.student_code}
                  onChange={handleFormChange} required
                />
              </div>
               <div className="form-group">
                <label htmlFor="class_id">Lớp</label>
                <select
                  id="class_id" name="class_id"
                  value={formData.class_id}
                  onChange={handleFormChange} required
                >
                  <option value="">-- Chọn lớp --</option>
                  {classes.map(c => (
                    <option key={c.class_id} value={c.class_id}>
                      {c.class_code} - {c.major}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {/* Các trường Chung cho cả Thêm và Sửa 
            (full_name, email, date_of_birth, address)
          */}
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
            <label htmlFor="date_of_birth">Ngày sinh</label>
            <input
              type="date"
              id="date_of_birth" name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleFormChange}
            />
          </div>
           <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <input
              type="text"
              id="address" name="address"
              value={formData.address}
              onChange={handleFormChange}
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

export default StudentManagementPage;