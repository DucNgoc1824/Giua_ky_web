import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import lecturerService from '../services/lecturerService';
import { useAuth } from '../context/AuthContext';
import '../assets/ManagementPage.css';

// Danh sách học kỳ
const SEMESTERS = [
  '2024-1', '2024-2', '2024-3',
  '2025-1', '2025-2', '2025-3',
];

const ViewGradesPage = () => {
  const { user } = useAuth();
  
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [grades, setGrades] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataError, setDataError] = useState(null);

  // Tải môn học của giảng viên
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
        
        // Tự động chọn môn đầu tiên
        if (subjectsData.length > 0) {
          setSelectedSubject(subjectsData[0].subject_id.toString());
        }
      } catch (err) {
        setError(err.message || 'Không thể tải danh sách môn học.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturerSubjects();
  }, [user]);

  // Tải danh sách điểm khi chọn môn/học kỳ
  useEffect(() => {
    const handleLoadGrades = async () => {
      if (!selectedSubject) {
        setDataError('Vui lòng chọn môn học.');
        return;
      }

      setDataError(null);
      setIsLoading(true);

      try {
        let gradesData;
        
        if (selectedSemester) {
          // Lấy điểm theo môn và học kỳ
          gradesData = await gradeService.getGradesBySubjectAndSemester(
            selectedSubject, 
            selectedSemester
          );
        } else {
          // Lấy điểm theo môn (tất cả học kỳ)
          gradesData = await gradeService.getGradesBySubject(selectedSubject);
        }
        
        setGrades(gradesData);
      } catch (err) {
        setDataError(err.message || 'Không thể tải danh sách điểm.');
      } finally {
        setIsLoading(false);
      }
    };

    if (selectedSubject) {
      handleLoadGrades();
    }
  }, [selectedSubject, selectedSemester]);

  if (isLoading && subjects.length === 0) {
    return <div className="loading-text">Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>Xem Bảng Điểm Sinh Viên</h1>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Xem điểm các môn học bạn đang giảng dạy
        </p>
      </div>

      {/* Bộ lọc */}
      <div className="filters" style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <label htmlFor="subject-filter" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Môn học:
          </label>
          <select
            id="subject-filter"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">-- Chọn môn học --</option>
            {subjects.map(s => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_code} - {s.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="semester-filter" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Học kỳ (Tùy chọn):
          </label>
          <select
            id="semester-filter"
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">-- Tất cả học kỳ --</option>
            {SEMESTERS.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {dataError && (
        <div className="error-text" style={{ marginBottom: '1rem' }}>
          {dataError}
        </div>
      )}

      {/* Bảng điểm */}
      {!selectedSubject ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Vui lòng chọn môn học để xem danh sách điểm
        </div>
      ) : isLoading ? (
        <div className="loading-text">Đang tải dữ liệu...</div>
      ) : grades.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Chưa có điểm cho môn học và học kỳ đã chọn
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontSize: '14px', color: '#666' }}>
            Tìm thấy <strong>{grades.length}</strong> sinh viên
          </div>
          
          <table className="data-table">
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã SV</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                {!selectedSemester && <th>Học kỳ</th>}
                <th>Điểm GK</th>
                <th>Điểm CK</th>
                <th>Điểm TB</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={`${grade.student_id}-${grade.semester || 'all'}`}>
                  <td>{index + 1}</td>
                  <td>{grade.student_code}</td>
                  <td>{grade.student_name}</td>
                  <td>{grade.class_code}</td>
                  {!selectedSemester && <td>{grade.semester}</td>}
                  <td>{grade.midterm_score !== null ? grade.midterm_score : '-'}</td>
                  <td>{grade.final_score !== null ? grade.final_score : '-'}</td>
                  <td>
                    <strong>
                      {grade.average_score !== null ? grade.average_score : '-'}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ViewGradesPage;
