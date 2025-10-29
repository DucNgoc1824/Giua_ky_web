import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import subjectService from '../services/subjectService';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const TicketInboxPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // For student create ticket
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_id: '',
    semester: '2024-1',
    message_text: ''
  });

  // For lecturer response
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [responseText, setResponseText] = useState('');

  // For student view detail
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState(null);

  const fetchInbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (user?.roleId === 3) {
        // Sinh viên gọi my-tickets
        data = await ticketService.getMyTickets();
      } else {
        // Giảng viên/Admin gọi inbox
        data = await ticketService.getTicketInbox();
      }
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Không thể tải hòm thư.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
    
    // Nếu là sinh viên, tải danh sách môn học
    if (user?.roleId === 3) {
      const fetchSubjects = async () => {
        try {
          const data = await subjectService.getAllSubjects();
          setSubjects(data);
        } catch (err) {
          console.error('Không thể tải môn học:', err);
        }
      };
      fetchSubjects();
    }
  }, [user]);

  const handleOpenModal = () => {
    setFormData({
      subject_id: '',
      semester: '2024-1',
      message_text: ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject_id || !formData.message_text) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await ticketService.createTicket(formData);
      toast.success('Đã gửi thắc mắc thành công!');
      handleCloseModal();
      fetchInbox(); // Reload tickets
    } catch (err) {
      toast.error(err.message || 'Lỗi khi gửi thắc mắc');
    }
  };

  // Handler cho giảng viên phản hồi
  const handleOpenResponse = (ticket) => {
    setSelectedTicket(ticket);
    setResponseText(ticket.response_text || '');
    setIsResponseModalOpen(true);
  };

  const handleCloseResponse = () => {
    setIsResponseModalOpen(false);
    setSelectedTicket(null);
    setResponseText('');
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    
    if (!responseText || responseText.trim() === '') {
      toast.error('Vui lòng nhập nội dung phản hồi');
      return;
    }

    try {
      await ticketService.respondToTicket(selectedTicket.ticket_id, responseText);
      toast.success('Đã gửi phản hồi thành công!');
      handleCloseResponse();
      fetchInbox(); // Reload tickets
    } catch (err) {
      toast.error(err.message || 'Lỗi khi gửi phản hồi');
    }
  };

  // Handler cho sinh viên xem chi tiết
  const handleViewDetail = (ticket) => {
    setViewTicket(ticket);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewTicket(null);
  };

  if (isLoading) {
    return <div className="loading-text">Đang tải hòm thư...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="ticket-inbox-page">
      <div className="page-header">
        <h1>{user?.roleId === 3 ? '💬 Hỏi đáp của tôi' : '📬 Hòm thư Hỏi đáp'}</h1>
        {user?.roleId === 3 && (
          <button className="btn btn-primary" onClick={handleOpenModal}>
            ➕ Gửi thắc mắc mới
          </button>
        )}
      </div>
      
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
        {user?.roleId === 3 ? (
          <>Chào <strong>{user.fullName}</strong>. Đây là các thắc mắc bạn đã gửi:</>
        ) : (
          <>Chào <strong>{user.fullName}</strong>. Đây là các thắc mắc của sinh viên được gửi đến bạn:</>
        )}
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            {user?.roleId !== 3 && <th>Người gửi</th>}
            {user?.roleId !== 3 && <th>Lớp</th>}
            <th>Môn học</th>
            <th>Nội dung</th>
            <th>Phản hồi</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{new Date(ticket.created_at).toLocaleString('vi-VN')}</td>
                <td>
                  <span style={{
                    color: ticket.status === 'Mới' ? 'var(--ptit-red)' : 
                           ticket.status === 'Đã phản hồi' ? 'green' : '#666',
                    fontWeight: '600'
                  }}>
                    {ticket.status}
                  </span>
                </td>
                {user?.roleId !== 3 && <td>{ticket.student_name}</td>}
                {user?.roleId !== 3 && <td>{ticket.class_code}</td>}
                <td>{ticket.subject_name}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {ticket.message_text}
                </td>
                <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {ticket.response_text ? (
                    <>
                      <div>{ticket.response_text}</div>
                      <small style={{ color: '#666', fontStyle: 'italic' }}>
                        {ticket.response_at && new Date(ticket.response_at).toLocaleString('vi-VN')}
                      </small>
                    </>
                  ) : (
                    <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa có phản hồi</span>
                  )}
                </td>
                <td>
                  {user?.roleId === 3 ? (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleViewDetail(ticket)}
                    >
                      👁️ Xem chi tiết
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => handleOpenResponse(ticket)}
                    >
                      {ticket.response_text ? '✏️ Sửa' : '💬 Phản hồi'}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={user?.roleId === 3 ? "6" : "8"} style={{ textAlign: 'center' }}>
                {user?.roleId === 3 ? 'Bạn chưa gửi thắc mắc nào.' : 'Bạn không có tin nhắn nào.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for student to create ticket */}
      {user?.roleId === 3 && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Gửi thắc mắc mới">
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="subject_id">Môn học *</label>
              <select
                id="subject_id"
                name="subject_id"
                value={formData.subject_id}
                onChange={handleFormChange}
                required
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
              <label htmlFor="semester">Học kỳ</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleFormChange}
              >
                <option value="2024-1">2024-1</option>
                <option value="2024-2">2024-2</option>
                <option value="2025-1">2025-1</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message_text">Nội dung (tối đa 255 ký tự) *</label>
              <textarea
                id="message_text"
                name="message_text"
                rows="4"
                value={formData.message_text}
                onChange={handleFormChange}
                required
                maxLength="255"
                placeholder="Nhập nội dung thắc mắc hoặc khiếu nại của bạn..."
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Gửi
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for lecturer to respond */}
      {user?.roleId !== 3 && selectedTicket && (
        <Modal 
          isOpen={isResponseModalOpen} 
          onClose={handleCloseResponse} 
          title={selectedTicket.response_text ? "Sửa phản hồi" : "Phản hồi thắc mắc"}
        >
          <form className="modal-form" onSubmit={handleSubmitResponse}>
            <div className="form-group">
              <label>Sinh viên:</label>
              <p style={{ fontWeight: 'bold', color: '#333' }}>
                {selectedTicket.student_name} ({selectedTicket.student_code}) - {selectedTicket.class_code}
              </p>
            </div>

            <div className="form-group">
              <label>Môn học:</label>
              <p style={{ fontWeight: 'bold', color: '#333' }}>{selectedTicket.subject_name}</p>
            </div>

            <div className="form-group">
              <label>Nội dung thắc mắc:</label>
              <div style={{ 
                padding: '0.75rem', 
                backgroundColor: '#f5f5f5', 
                borderRadius: '4px',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {selectedTicket.message_text}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="response_text">Phản hồi của bạn: *</label>
              <textarea
                id="response_text"
                rows="4"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                required
                placeholder="Nhập nội dung phản hồi..."
                style={{ width: '100%' }}
              />
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseResponse}>
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedTicket.response_text ? 'Cập nhật' : 'Gửi phản hồi'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal for student to view detail */}
      {user?.roleId === 3 && viewTicket && (
        <Modal 
          isOpen={isViewModalOpen} 
          onClose={handleCloseViewModal} 
          title="Chi tiết thắc mắc"
        >
          <div className="modal-form">
            <div className="form-group">
              <label>Môn học:</label>
              <p style={{ fontWeight: 'bold', color: '#333', fontSize: '1.1rem' }}>
                {viewTicket.subject_name}
              </p>
            </div>

            <div className="form-group">
              <label>Ngày gửi:</label>
              <p style={{ color: '#666' }}>
                {new Date(viewTicket.created_at).toLocaleString('vi-VN')}
              </p>
            </div>

            <div className="form-group">
              <label>Trạng thái:</label>
              <p>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  backgroundColor: viewTicket.status === 'Đã phản hồi' ? '#d4edda' : '#fff3cd',
                  color: viewTicket.status === 'Đã phản hồi' ? '#155724' : '#856404'
                }}>
                  {viewTicket.status}
                </span>
              </p>
            </div>

            <div className="form-group">
              <label>Nội dung thắc mắc của bạn:</label>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                border: '1px solid #dee2e6',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: '1rem',
                lineHeight: '1.6'
              }}>
                {viewTicket.message_text}
              </div>
            </div>

            {viewTicket.response_text ? (
              <>
                <div className="form-group">
                  <label>📝 Phản hồi từ giảng viên:</label>
                  <div style={{ 
                    padding: '1rem', 
                    backgroundColor: '#d4edda', 
                    borderRadius: '8px',
                    border: '1px solid #c3e6cb',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    color: '#155724'
                  }}>
                    {viewTicket.response_text}
                  </div>
                </div>

                <div className="form-group">
                  <label>Thời gian phản hồi:</label>
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    {new Date(viewTicket.response_at).toLocaleString('vi-VN')}
                  </p>
                </div>
              </>
            ) : (
              <div className="form-group">
                <div style={{ 
                  padding: '1.5rem', 
                  backgroundColor: '#fff3cd', 
                  borderRadius: '8px',
                  border: '1px solid #ffeaa7',
                  textAlign: 'center',
                  color: '#856404'
                }}>
                  <p style={{ margin: 0, fontStyle: 'italic' }}>
                    ⏳ Giảng viên chưa phản hồi thắc mắc này
                  </p>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleCloseViewModal}>
                Đóng
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TicketInboxPage;