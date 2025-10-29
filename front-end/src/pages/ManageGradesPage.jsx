import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import studentService from '../services/studentService';
import lecturerService from '../services/lecturerService';
import { useAuth } from '../context/AuthContext';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const initialFormData = {
  student_id: '',
  subject_id: '',
  semester: '',
  attendance_score: '',
  practice_score: '',
  midterm_score: '',
  final_score: '',
};

const SEMESTERS = [
  '2024-1', '2024-2', '2024-3',
  '2025-1', '2025-2', '2025-3',
];

const ManageGradesPage = () => {
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState([]);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [studentSuggestions, setStudentSuggestions] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  const [formData, setFormData] = useState(initialFormData);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchLecturerSubjects = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const lecturerId = user?.lecturerId;
        if (!lecturerId) {
          setError('Không tìm thấy thông tin giảng viên.');
          setIsLoading(false);
          return;
        }
        
        const subjectsData = await lecturerService.getSubjectsByLecturer(lecturerId);
        setSubjects(subjectsData);
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách môn học.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturerSubjects();
  }, [user]);

  const handleStudentSearch = async (searchValue) => {
    setStudentSearchTerm(searchValue);
    
    if (searchValue.length < 2) {
      setStudentSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      const results = await studentService.searchStudents(searchValue);
      setStudentSuggestions(results);
      setShowSuggestions(true);
    } catch {
      setStudentSuggestions([]);
    }
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setStudentSearchTerm(`${student.student_code} - ${student.full_name}`);
    setFormData(prev => ({ ...prev, student_id: student.student_id }));
    setShowSuggestions(false);
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
    setFormSuccess('');

    if (!formData.student_id || !formData.subject_id || !formData.semester) {
      setFormError('Vui lòng chọn Sinh viên, Môn học và nhập Học kỳ.');
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        student_id: parseInt(formData.student_id, 10),
        subject_id: parseInt(formData.subject_id, 10),
        attendance_score: formData.attendance_score ? parseFloat(formData.attendance_score) : null,
        practice_score: formData.practice_score ? parseFloat(formData.practice_score) : null,
        midterm_score: formData.midterm_score ? parseFloat(formData.midterm_score) : null,
        final_score: formData.final_score ? parseFloat(formData.final_score) : null,
      };

      const response = await gradeService.upsertGrade(dataToSubmit);
      
      setFormSuccess(response.message);
      setFormData(initialFormData);
      setStudentSearchTerm('');
      setSelectedStudent(null);
      
    } catch (err) {
      setFormError(err.message || 'Có lỗi xảy ra khi lưu điểm.');
    }
  };

  if (isLoading) {
    return <div className="loading-text">Đang tải dữ liệu...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="manage-grades-page">
      <div className="page-header">
        <div>
          <h1>Quản lý Điểm số</h1>
          <p className="subtitle">
            Nhập và cập nhật điểm cho sinh viên
          </p>
        </div>
      </div>

      <div className="grade-form-container">
        <form className="grade-form" onSubmit={handleFormSubmit}>
          
          {/* Row 1: Học kỳ và Môn học */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="semester">Học kỳ</label>
              <select
                id="semester" 
                name="semester"
                value={formData.semester}
                onChange={handleFormChange} 
                required
                className="form-select"
              >
                <option value="">Chọn học kỳ</option>
                {SEMESTERS.map(sem => (
                  <option key={sem} value={sem}>{sem}</option>
                ))}
              </select>
            </div>
          
            <div className="form-group">
              <label htmlFor="subject_id">Môn học</label>
              <select
                id="subject_id" 
                name="subject_id"
                value={formData.subject_id}
                onChange={handleFormChange} 
                required
                className="form-select"
              >
                <option value="">Chọn môn học</option>
                {subjects.map(s => (
                  <option key={s.subject_id} value={s.subject_id}>
                    {s.subject_code} - {s.subject_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Tìm sinh viên */}
          <div className="form-group autocomplete-group">
            <label htmlFor="student_search">Sinh viên</label>
            <input
              type="text"
              id="student_search"
              placeholder="Tìm kiếm theo mã sinh viên hoặc tên"
              value={studentSearchTerm}
              onChange={(e) => handleStudentSearch(e.target.value)}
              autoComplete="off"
              className="form-input"
            />
            
            {showSuggestions && studentSuggestions.length > 0 && (
              <div className="autocomplete-dropdown">
                {studentSuggestions.map(student => (
                  <div
                    key={student.student_id}
                    onClick={() => handleSelectStudent(student)}
                    className="autocomplete-item"
                  >
                    <div className="student-info">
                      <strong>{student.student_code}</strong> - {student.full_name}
                    </div>
                    <div className="student-class">Lớp: {student.class_code}</div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedStudent && (
              <div className="selected-student">
                Đã chọn: <strong>{selectedStudent.student_code}</strong> - {selectedStudent.full_name}
              </div>
            )}
          </div>

          {/* Row 3: Điểm số (4 cột điểm theo chuẩn PTIT) */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="attendance_score">Chuyên cần (10%)</label>
              <input
                type="number"
                id="attendance_score" 
                name="attendance_score"
                value={formData.attendance_score}
                onChange={handleFormChange}
                step="0.1" 
                min="0" 
                max="10"
                placeholder="0 - 10"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="practice_score">Thực hành (20%)</label>
              <input
                type="number"
                id="practice_score" 
                name="practice_score"
                value={formData.practice_score}
                onChange={handleFormChange}
                step="0.1" 
                min="0" 
                max="10"
                placeholder="0 - 10"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="midterm_score">Giữa kỳ (20%)</label>
              <input
                type="number"
                id="midterm_score" 
                name="midterm_score"
                value={formData.midterm_score}
                onChange={handleFormChange}
                step="0.1" 
                min="0" 
                max="10"
                placeholder="0 - 10"
                className="form-input"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="final_score">Cuối kỳ (50%)</label>
              <input
                type="number"
                id="final_score" 
                name="final_score"
                value={formData.final_score}
                onChange={handleFormChange}
                step="0.1" 
                min="0" 
                max="10"
                placeholder="0 - 10"
                className="form-input"
              />
            </div>
          </div>
          
          {/* Messages */}
          {formError && (
            <div className="alert alert-error">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="alert alert-success">
              {formSuccess}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-large">
              Lưu điểm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageGradesPage;