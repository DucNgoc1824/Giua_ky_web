import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import studentService from '../services/studentService';
import classService from '../services/classService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';
import '../assets/Pagination.css';

const initialFormData = {
  username: '',
  password: '',
  full_name: '',
  email: '',
  student_code: '',
  class_id: '',
  date_of_birth: '',
  address: '',
};

const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formError, setFormError] = useState(null);

  // Pagination & Search
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [studentsData, classesData] = await Promise.all([
        studentService.getAllStudents(),
        classService.getAllClasses(),
      ]);
      setStudents(studentsData);
      setFilteredStudents(studentsData);
      setClasses(classesData);
    } catch (err) {
      const errorMsg = err.message || 'Không thể tải dữ liệu.';
      toast.error('❌ Lỗi: ' + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
    
    if (!query.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter((student) => {
      const searchLower = query.toLowerCase();
      return (
        student.full_name?.toLowerCase().includes(searchLower) ||
        student.student_code?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.class_name?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingStudentId(null);
    setFormData(initialFormData);
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (student) => {
    try {
       setIsLoading(true);
       const studentDetails = await studentService.getStudentById(student.student_id);
       setEditingStudentId(student.student_id);
       setFormData({
         username: studentDetails.username,
         full_name: studentDetails.full_name,
         email: studentDetails.email,
         student_code: studentDetails.student_code,
         class_id: studentDetails.class_id,
         date_of_birth: studentDetails.date_of_birth ? studentDetails.date_of_birth.split('T')[0] : '',
         address: studentDetails.address || '',
         password: '',
       });
       setFormError(null);
       setIsModalOpen(true);
    } catch (err) {
       toast.error('❌ Lỗi khi lấy chi tiết SV: ' + err.message);
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


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingStudentId) {
        const dataToUpdate = {
          full_name: formData.full_name,
          email: formData.email,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address || null,
        };
        await studentService.updateStudent(editingStudentId, dataToUpdate);
        toast.success('✅ Cập nhật sinh viên thành công!');
      } else {
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
          class_id: parseInt(formData.class_id, 10),
        });
        toast.success('✅ Thêm sinh viên thành công!');
      }
      fetchData();
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
      toast.error('❌ Lỗi: ' + (err.message || 'Không xác định'));
    }
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này? (Hành động này sẽ xóa cả tài khoản đăng nhập và không thể hoàn tác)')) {
      try {
        await studentService.deleteStudent(studentId);
        toast.success('✅ Xóa sinh viên thành công!');
        fetchData();
      } catch (err) {
        toast.error('❌ Lỗi khi xóa: ' + err.message);
      }
    }
  };

  if (isLoading && !isModalOpen) {
    return <LoadingSpinner message="Đang tải danh sách sinh viên..." />;
  }

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredStudents.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredStudents.length / itemsPerPage);

  return (
    <div className="student-management-page">
      <div className="page-header">
        <h1>Quản lý Sinh viên</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FaPlus /> Thêm SV
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm theo tên, mã SV, email..."
        />
      </div>

      {filteredStudents.length === 0 && searchQuery && (
        <div className="no-results">
          <FaSearch size={48} color="#999" />
          <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="table-wrapper">
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
            {currentItems.length > 0 ? (
              currentItems.map((student) => (
                <tr key={student.student_id}>
                  <td data-label="Mã SV">{student.student_code}</td>
                  <td data-label="Họ tên">{student.full_name}</td>
                  <td data-label="Email">{student.email}</td>
                  <td data-label="Tài khoản">{student.username}</td>
                  <td data-label="Lớp">{student.class_code}</td>
                  <td className="actions" data-label="Hành động">
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditModal(student)}
                        title="Sửa"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(student.student_id)}
                        title="Xóa"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  Chưa có sinh viên nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          margin: '2rem 0 1rem 0',
          padding: '1rem'
        }}>
          <ReactPaginate
            previousLabel={'← Trước'}
            nextLabel={'Sau →'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            pageClassName={'page-item'}
            breakClassName={'page-item'}
            disabledClassName={'disabled'}
            forcePage={currentPage}
          />
        </div>
      )}

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