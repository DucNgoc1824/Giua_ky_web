import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import studentService from '../services/studentService'; // <-- Cần để lấy DS Sinh viên
import subjectService from '../services/subjectService'; // <-- Cần để lấy DS Môn học
import '../assets/ManagementPage.css';
import '../assets/Modal.css'; // Dùng chung CSS của Form/Modal

// Dữ liệu ban đầu cho form
const initialFormData = {
  student_id: '',
  subject_id: '',
  semester: '',
  midterm_score: '',
  final_score: '',
};

const ManageGradesPage = () => {
  // State cho 3 nguồn dữ liệu
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  
  const [formData, setFormData] = useState(initialFormData);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); // Lỗi tải trang
  const [formError, setFormError] = useState(null); // Lỗi của form
  const [formSuccess, setFormSuccess] = useState(''); // Thông báo thành công

  // Hàm tải dữ liệu (SV và Môn học)
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Tải song song
      const [studentsData, subjectsData] = await Promise.all([
        studentService.getAllStudents(),
        subjectService.getAllSubjects(),
      ]);
      setStudents(studentsData);
      setSubjects(subjectsData);
    } catch (err) {
      setError(err.message || 'Không thể tải dữ liệu sinh viên hoặc môn học.');
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

  // Xử lý "Lưu" form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess('');

    // Validate
    if (!formData.student_id || !formData.subject_id || !formData.semester) {
      setFormError('Vui lòng chọn Sinh viên, Môn học và nhập Học kỳ.');
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        // Chuyển đổi ID sang số
        student_id: parseInt(formData.student_id, 10),
        subject_id: parseInt(formData.subject_id, 10),
        // Chuyển điểm sang số float, hoặc null nếu bỏ trống
        midterm_score: formData.midterm_score ? parseFloat(formData.midterm_score) : null,
        final_score: formData.final_score ? parseFloat(formData.final_score) : null,
      };

      // Gọi API
      const response = await gradeService.upsertGrade(dataToSubmit);
      
      setFormSuccess(response.message); // Hiển thị thông báo thành công
      setFormData(initialFormData); // Reset form
      
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi lưu điểm.');
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
    <div className="manage-grades-page">
      <div className="page-header">
        <h1>Quản lý (Nhập/Sửa) Điểm số</h1>
      </div>

      {/* Chúng ta dùng lại style .modal-content và .modal-form 
        nhưng không dùng Modal, mà hiển thị form trực tiếp
      */}
      <div className="modal-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form className="modal-form" onSubmit={handleFormSubmit}>
          
          {/* 1. Chọn Sinh viên */}
          <div className="form-group">
            <label htmlFor="student_id">Chọn Sinh viên</label>
            <select
              id="student_id" name="student_id"
              value={formData.student_id}
              onChange={handleFormChange} required
            >
              <option value="">-- Chọn sinh viên --</option>
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.student_code} - {s.full_name} ({s.class_code})
                </option>
              ))}
            </select>
          </div>
          
          {/* 2. Chọn Môn học */}
          <div className="form-group">
            <label htmlFor="subject_id">Chọn Môn học</label>
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

          {/* 3. Nhập Học kỳ */}
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

          {/* 4. Nhập Điểm (chia 2 cột) */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="midterm_score">Điểm giữa kỳ</label>
              <input
                type="number"
                id="midterm_score" name="midterm_score"
                value={formData.midterm_score}
                onChange={handleFormChange}
                step="0.1" min="0" max="10"
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="final_score">Điểm cuối kỳ</label>
              <input
                type="number"
                id="final_score" name="final_score"
                value={formData.final_score}
                onChange={handleFormChange}
                step="0.1" min="0" max="10"
              />
            </div>
          </div>
          
          {/* Thông báo Lỗi / Thành công */}
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}
          {formSuccess && <p style={{color: 'green', textAlign: 'center', marginTop: 0}}>{formSuccess}</p>}

          <div className="modal-footer" style={{ border: 'none', paddingBottom: 0 }}>
            <button type="submit" className="btn btn-primary">
              Lưu Điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageGradesPage;