import React, { useState, useEffect } from 'react';
import gradeService from '../services/gradeService';
import courseMaterialService from '../services/courseMaterialService';
import ticketService from '../services/ticketService'; // <--- 1. Import service mới
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const MyGradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); 

  // State cho Modal Tài liệu (giữ nguyên)
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [modalMaterialError, setModalMaterialError] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');
  
  // === STATE MỚI CHO MODAL HỎI ĐÁP ===
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');
  const [selectedGradeInfo, setSelectedGradeInfo] = useState(null); // Lưu thông tin môn/kỳ
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState('');

  // Hàm tải điểm (Giữ nguyên)
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

  // === HÀM XỬ LÝ MODAL TÀI LIỆU (Giữ nguyên) ===
  // === HÀM XỬ LÝ MODAL TÀI LIỆU (ĐÃ SỬA LỖI) ===
  // === HÀM MỚI: XỬ LÝ MỞ MODAL TÀI LIỆU (ĐÃ SỬA LỖI) ===
  const handleViewMaterials = async (subjectId, subjectName) => {
    setIsMaterialModalOpen(true);
    setIsLoadingMaterials(true);
    setModalMaterialError(null);
    setSelectedSubjectName(subjectName);
    
    try {
      // Gọi API lấy tài liệu cho môn học này
      const data = await courseMaterialService.getMaterialsBySubject(subjectId);
      setSelectedMaterials(data);
    } catch (err) { // <--- SỬA LỖI Ở ĐÂY: dùng { thay vì _
      setModalMaterialError(err.message || 'Không thể tải tài liệu.');
    } finally {
      setIsLoadingMaterials(false);
    }
  };
  const handleCloseMaterialModal = () => setIsMaterialModalOpen(false);

  // === HÀM MỚI: XỬ LÝ MODAL HỎI ĐÁP ===
  const handleOpenTicketModal = (grade) => {
    setSelectedGradeInfo(grade); // Lưu cả hàng điểm
    setTicketMessage(''); // Reset tin nhắn
    setFormError(null);
    setFormSuccess(null);
    setIsTicketModalOpen(true);
  };
  
  const handleCloseTicketModal = () => setIsTicketModalOpen(false);

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!ticketMessage) {
      setFormError('Vui lòng nhập nội dung thắc mắc.');
      return;
    }
    
    if (ticketMessage.length > 255) {
       setFormError('Tin nhắn không được quá 255 ký tự.');
       return;
    }

    try {
      const ticketData = {
        subject_id: selectedGradeInfo.subject_id,
        semester: selectedGradeInfo.semester,
        message_text: ticketMessage,
      };
      
      const response = await ticketService.createTicket(ticketData);
      setFormSuccess(response.message);
      setTicketMessage(''); // Xóa form
      // (Không cần đóng modal ngay để SV đọc thông báo)
      
    } catch (err) {
      setFormError(err.message || 'Lỗi khi gửi ticket.');
    }
  };


  // === RENDER ===
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
            <th>Điểm GK</th>
            <th>Điểm CK</th>
            <th>Hành động</th>
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
                <td>{grade.midterm_score}</td>
                <td>{grade.final_score}</td>
                <td className="actions" style={{minWidth: '220px'}}> {/* Cột Hành động */}
                  <button 
                    className="btn btn-secondary" 
                    style={{padding: '0.3rem 0.6rem', fontSize: '0.9rem'}}
                    onClick={() => handleViewMaterials(grade.subject_id, grade.subject_name)}
                  >
                    Xem Tài liệu
                  </button>
                  <button 
                    className="btn btn-primary" // <--- NÚT MỚI
                    style={{padding: '0.3rem 0.6rem', fontSize: '0.9rem'}}
                    onClick={() => handleOpenTicketModal(grade)}
                  >
                    Hỏi đáp
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: 'center' }}> {/* Sửa colSpan="5" */}
                Bạn chưa có điểm nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* === MODAL TÀI LIỆU (Giữ nguyên) === */}
      <Modal 
        isOpen={isMaterialModalOpen} 
        onClose={handleCloseMaterialModal} 
        title={`Tài liệu môn: ${selectedSubjectName}`}
      >
        {selectedMaterials.length > 0 ? (
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
            {selectedMaterials.map(material => (
              <li key={material.material_id} style={{ marginBottom: '1rem' }}>
                <strong>
                  {/* SỬA LẠI LINK NÀY */}
                  <a 
                    href={`${BACKEND_URL}${material.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {material.title}
                  </a>
                  {/* KẾT THÚC SỬA */}
                </strong>
                <br />
                <small style={{color: '#555'}}>
                  {/* ... (thông tin người thêm) ... */}
                </small>
              </li>
            ))}
          </ul>
        ) : (<p>Không có tài liệu nào cho môn học này.</p>)}
        {/* ... (Code của Modal Tài liệu giữ nguyên) ... */}
        <div className="modal-footer" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={handleCloseMaterialModal}>
            Đóng
          </button>
        </div>
      </Modal>

      {/* === MODAL HỎI ĐÁP (MỚI) === */}
      <Modal 
        isOpen={isTicketModalOpen} 
        onClose={handleCloseTicketModal} 
        title={`Hỏi đáp/Khiếu nại: ${selectedGradeInfo?.subject_name}`}
      >
        <form className="modal-form" onSubmit={handleTicketSubmit}>
          <p>
            Gửi thắc mắc về môn học 
            <strong> {selectedGradeInfo?.subject_name} </strong>
            (Học kỳ: {selectedGradeInfo?.semester})
          </p>
          <div className="form-group">
            <label htmlFor="message_text">Nội dung (tối đa 255 ký tự):</label>
            <textarea
              id="message_text"
              name="message_text"
              rows="4"
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              required
              maxLength="255"
              style={{ padding: '0.5rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}
          {formSuccess && <p style={{color: 'green', textAlign: 'center', marginTop: 0}}>{formSuccess}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseTicketModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Gửi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MyGradesPage;