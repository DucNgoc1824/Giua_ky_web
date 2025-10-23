import React, { useState, useEffect } from 'react';
import lecturerService from '../services/lecturerService';
import subjectService from '../services/subjectService';
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

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

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [lecturerSubjects, setLecturerSubjects] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

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

  const handleOpenAddModal = () => {
    setEditingLecturerId(null);
    setFormData(initialFormData);
    setFormError(null);
    setIsModalOpen(true);
  };

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
        password: '',
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


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingLecturerId) {
        const dataToUpdate = {
          full_name: formData.full_name,
          email: formData.email,
          department: formData.department,
        };
        await lecturerService.updateLecturer(editingLecturerId, dataToUpdate);
      } else {
        if (!formData.password) {
          setFormError('Mật khẩu là bắt buộc khi tạo mới.');
          return;
        }
        await lecturerService.createLecturer(formData);
      }
      fetchLecturers();
      handleCloseModal();
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

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

  const handleOpenSubjectModal = async (lecturer) => {
    try {
      setSelectedLecturer(lecturer);
      setIsLoading(true);
      
      const [lecturerSubjectsData, allSubjectsData] = await Promise.all([
        lecturerService.getSubjectsByLecturer(lecturer.lecturer_id),
        subjectService.getAllSubjects()
      ]);
      
      setLecturerSubjects(lecturerSubjectsData);
      setAllSubjects(allSubjectsData);
      setSelectedSubjectId('');
      setIsSubjectModalOpen(true);
    } catch (err) {
      alert('Lỗi khi tải dữ liệu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setSelectedLecturer(null);
    setLecturerSubjects([]);
    setAllSubjects([]);
    setSelectedSubjectId('');
  };

  const handleAddSubject = async () => {
    if (!selectedSubjectId) {
      alert('Vui lòng chọn môn học');
      return;
    }

    try {
      await lecturerService.addSubjectToLecturer(selectedLecturer.lecturer_id, selectedSubjectId);
      
      const updatedSubjects = await lecturerService.getSubjectsByLecturer(selectedLecturer.lecturer_id);
      setLecturerSubjects(updatedSubjects);
      setSelectedSubjectId('');
    } catch (err) {
      alert('Lỗi: ' + (err.message || 'Không thể thêm môn'));
    }
  };

  const handleRemoveSubject = async (subjectId) => {
    if (window.confirm('Bạn có chắc muốn xóa môn này?')) {
      try {
        await lecturerService.removeSubjectFromLecturer(selectedLecturer.lecturer_id, subjectId);
        
        const updatedSubjects = await lecturerService.getSubjectsByLecturer(selectedLecturer.lecturer_id);
        setLecturerSubjects(updatedSubjects);
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message);
      }
    }
  };

  const availableSubjects = allSubjects.filter(
    subject => !lecturerSubjects.find(ls => ls.subject_id === subject.subject_id)
  );

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
                    className="btn btn-primary"
                    onClick={() => handleOpenSubjectModal(lecturer)}
                    style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                  >
                    Phân môn
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

      {/* === MODAL PHÂN MÔN === */}
      <Modal isOpen={isSubjectModalOpen} onClose={handleCloseSubjectModal}>
        <h2 style={{ color: 'var(--ptit-red)', marginBottom: '1.5rem' }}>
          Phân môn dạy: {selectedLecturer?.full_name}
        </h2>

        {/* Danh sách môn đang dạy */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
            Các môn đang dạy:
          </h3>
          {lecturerSubjects.length > 0 ? (
            <table className="data-table" style={{ fontSize: '0.9rem' }}>
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th>Số TC</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {lecturerSubjects.map((subject) => (
                  <tr key={subject.subject_id}>
                    <td>{subject.subject_code}</td>
                    <td>{subject.subject_name}</td>
                    <td>{subject.credits}</td>
                    <td className="actions">
                      <button
                        className="btn btn-danger"
                        style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}
                        onClick={() => handleRemoveSubject(subject.subject_id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: '#999', fontStyle: 'italic' }}>
              Chưa phân môn nào cho giảng viên này.
            </p>
          )}
        </div>

        {/* Form thêm môn mới */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
            Thêm môn mới:
          </h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
              <label htmlFor="subject_select">Chọn môn học</label>
              <select
                id="subject_select"
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
              >
                <option value="">-- Chọn môn --</option>
                {availableSubjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.subject_code} - {subject.subject_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddSubject}
              disabled={!selectedSubjectId}
            >
              Thêm
            </button>
          </div>
        </div>

        <div className="modal-footer" style={{ marginTop: '2rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handleCloseSubjectModal}>
            Đóng
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default LecturerManagementPage;