import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import { useAuth } from '../context/AuthContext';
import '../assets/ManagementPage.css';

const MyGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); 

  const fetchMyGrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gradeService.getMyGrades();
      setGrades(data);
    } catch (err) {
      setError(err.message || 'Không thể tải bảng điểm.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrades();
  }, []);

  if (isLoading) return <div className="loading-text">Đang tải bảng điểm...</div>;
  if (error) return <div className="error-text">Lỗi: {error}</div>;

  const BACKEND_URL = 'http://localhost:8080';

  return (
    <div className="my-grades-page">
      <div className="page-header">
        <h1>Bảng điểm của tôi</h1>
      </div>
      
      <div style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        <strong>Sinh viên:</strong> {user.fullName} <br/>
        <strong>Tên đăng nhập:</strong> {user.username}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Học kỳ</th>
            <th>Môn học</th>
            <th>CC (10%)</th>
            <th>TH (20%)</th>
            <th>GK (20%)</th>
            <th>CK (50%)</th>
            <th>Tổng</th>
            <th>Điểm chữ</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((grade) => (
              <tr key={`${grade.semester}-${grade.subject_id}`}>
                <td>{grade.semester}</td>
                <td>
                  {grade.subject_name}
                  <br/>
                  <small style={{color: '#555'}}>({grade.subject_code})</small>
                </td>
                <td>{grade.attendance_score !== null ? grade.attendance_score : '-'}</td>
                <td>{grade.practice_score !== null ? grade.practice_score : '-'}</td>
                <td>{grade.midterm_score !== null ? grade.midterm_score : '-'}</td>
                <td>{grade.final_score !== null ? grade.final_score : '-'}</td>
                <td>
                  <strong>{grade.total_score !== null ? grade.total_score : '-'}</strong>
                </td>
                <td>
                  <strong style={{ 
                    color: grade.letter_grade && grade.letter_grade.startsWith('A') ? '#10b981' : 
                           grade.letter_grade && grade.letter_grade.startsWith('B') ? '#3b82f6' :
                           grade.letter_grade && grade.letter_grade.startsWith('C') ? '#f59e0b' :
                           grade.letter_grade && grade.letter_grade === 'F' ? '#ef4444' : '#666'
                  }}>
                    {grade.letter_grade || '-'}
                  </strong>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>
                Bạn chưa có điểm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyGradesPage;