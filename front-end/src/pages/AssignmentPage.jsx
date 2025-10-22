import React, { useState, useEffect } from 'react';
import assignmentService from '../services/assignmentService';
import lecturerService from '../services/lecturerService'; // Cần DS Giảng viên
import subjectService from '../services/subjectService'; // Cần DS Môn học
import classService from '../services/classService'; // Cần DS Lớp học
import '../assets/ManagementPage.css';
import '../assets/Modal.css'; // Dùng chung CSS

const AssignmentPage = () => {
  // State cho 4 nguồn dữ liệu
  const [assignments, setAssignments] = useState([]); // DS phân công đã tạo
  const [lecturers, setLecturers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);

  // State cho form
  const [formData, setFormData] = useState({
    lecturer_id: '',
    subject_id: '',
    class_id: '',
    semester: '',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);

  // Hàm tải tất cả dữ liệu cần thiết
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Tải song song 4 API
      const [
        assignData,
        lecturerData,
        subjectData,
        classData,
      ] = await Promise.all([
        assignmentService.getAllAssignments(),
        lecturerService.getAllLecturers(),
        subjectService.getAllSubjects(),
        classService.getAllClasses(),
      ]);
      
      setAssignments(assignData);
      setLecturers(lecturerData);
      setSubjects(subjectData);
      setClasses(classData);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý "Lưu" form (Tạo mới)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    try {
      const dataToSubmit = {
        ...formData,
        lecturer_id: parseInt(formData.lecturer_id, 10),
        subject_id: parseInt(formData.subject_id, 10),
        class_id: parseInt(formData.class_id, 10),
      };
      
      await assignmentService.createAssignment(dataToSubmit);
      
      // Tải lại danh sách phân công (chỉ cần tải lại 1 API)
      const assignData = await assignmentService.getAllAssignments();
      setAssignments(assignData);
      
      // Reset form
      setFormData({ lecturer_id: '', subject_id: '', class_id: '', semester: '' });
      
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

  // Xử lý "Xóa"
  const handleDelete = async (assignmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phân công này?')) {
      try {
        await assignmentService.deleteAssignment(assignmentId);
        // Tải lại danh sách phân công
        const assignData = await assignmentService.getAllAssignments();
        setAssignments(assignData);
      } catch (err) {
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
    <div className="assignment-page">
      <div className="page-header">
        <h1>Phân công Giảng dạy</h1>
      </div>

      {/* 1. Form Tạo mới (Giống trang QL Điểm) */}
      <div className="modal-content" style={{ maxWidth: '800px', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--ptit-red)', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Tạo Phân công mới</h2>
        <form className="modal-form" onSubmit={handleFormSubmit}>
          
          <div className="form-group">
            <label htmlFor="lecturer_id">Giảng viên</label>
            <select
              id="lecturer_id" name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleFormChange} required
            >
              <option value="">-- Chọn giảng viên --</option>
              {lecturers.map(l => (
                <option key={l.lecturer_id} value={l.lecturer_id}>
                  {l.lecturer_code} - {l.full_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="subject_id">Môn học</label>
            <select
              id="subject_id" name="subject_id"
              value={formData.subject_id}
              onChange={handleFormChange} required
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map(s => (
                <option key={s.subject_id} value={s.subject_id}>
                  {s.subject_code} - {s.subject_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="class_id">Lớp học</label>
            <select
              id="class_id" name="class_id"
              value={formData.class_id}
              onChange={handleFormChange} required
            >
              <option value="">-- Chọn lớp học --</option>
              {classes.map(c => (
                <option key={c.class_id} value={c.class_id}>
                  {c.class_code}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="semester">Học kỳ (VD: 2024-1)</label>
            <input
              type="text"
              id="semester" name="semester"
              placeholder="Ví dụ: 2024-1"
              value={formData.semester}
              onChange={handleFormChange} required
            />
          </div>
          
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}
          
          <div className="modal-footer" style={{ border: 'none', paddingBottom: 0 }}>
            <button type="submit" className="btn btn-primary">
              Lưu Phân công
            </button>
          </div>
        </form>
      </div>

      {/* 2. Bảng Hiển thị danh sách đã phân công */}
      <h2 style={{ color: 'var(--ptit-red)', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Danh sách Phân công</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Học kỳ</th>
            <th>Giảng viên</th>
            <th>Môn học</th>
            <th>Lớp học</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length > 0 ? (
            assignments.map((assign) => (
              <tr key={assign.assignment_id}>
                <td>{assign.semester}</td>
                <td>{assign.lecturer_name}</td>
                <td>{assign.subject_name}</td>
                <td>{assign.class_code}</td>
                <td className="actions">
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(assign.assignment_id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}>
                Chưa có phân công nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AssignmentPage;