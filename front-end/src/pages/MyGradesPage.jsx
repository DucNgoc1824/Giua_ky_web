import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService'; // <-- Import service
import { useAuth } from '../context/AuthContext'; // <-- Import kho
import '../assets/ManagementPage.css'; // Dùng chung CSS bảng

const MyGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Lấy thông tin user để hiển thị tên
  const { user } = useAuth(); 

  // Hàm tải dữ liệu
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

  // Tải điểm khi trang được mở
  useEffect(() => {
    fetchMyGrades();
  }, []);

  // === RENDER ===
  if (isLoading) {
    return <div className="loading-text">Đang tải bảng điểm...</div>;
  }

  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="my-grades-page">
      <div className="page-header">
        <h1>Bảng điểm của tôi</h1>
      </div>
      
      {/* Hiển thị thông tin SV */}
      <div style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        <strong>Sinh viên:</strong> {user.fullName} <br/>
        <strong>Tên đăng nhập:</strong> {user.username}
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Học kỳ</th>
            <th>Mã môn học</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Điểm giữa kỳ</th>
            <th>Điểm cuối kỳ</th>
          </tr>
        </thead>
        <tbody>
          {grades.length > 0 ? (
            grades.map((grade, index) => (
              <tr key={index}>
                <td>{grade.semester}</td>
                <td>{grade.subject_code}</td>
                <td>{grade.subject_name}</td>
                <td>{grade.credits}</td>
                <td>{grade.midterm_score}</td>
                <td>{grade.final_score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center' }}>
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