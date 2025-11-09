import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import { useAuth } from '../context/AuthContext';
import '../assets/ManagementPage.css';

const MyGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); 

  const fetchMyGrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await gradeService.getMyGrades();
      setGrades(data);
      
      // Extract unique semesters
      const uniqueSemesters = [...new Set(data.map(g => g.semester))].sort().reverse();
      setSemesters(uniqueSemesters);
      
      setFilteredGrades(data);
    } catch (err) {
      setError(err.message || 'Không thể tải bảng điểm.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGrades();
  }, []);

  useEffect(() => {
    if (selectedSemester === 'all') {
      setFilteredGrades(grades);
    } else {
      setFilteredGrades(grades.filter(g => g.semester === selectedSemester));
    }
  }, [selectedSemester, grades]);

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

      {/* Filter học kỳ */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <label htmlFor="semester-filter" style={{ fontSize: '1rem', fontWeight: '500' }}>
          <strong>Học kỳ:</strong>
        </label>
        <select 
          id="semester-filter"
          value={selectedSemester}
          onChange={(e) => setSelectedSemester(e.target.value)}
          style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '1rem', 
            borderRadius: '4px',
            border: '1px solid #ddd',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tất cả học kỳ</option>
          {semesters.map(sem => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>
          ({filteredGrades.length} môn)
        </span>
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
          {filteredGrades.length > 0 ? (
            filteredGrades.map((grade) => (
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
              <td colSpan="8" style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
                <div style={{ fontSize: '1.1rem' }}>
                  {selectedSemester === 'all' 
                    ? 'Bạn chưa có điểm nào.' 
                    : `Không có điểm trong học kỳ ${selectedSemester}.`}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyGradesPage;