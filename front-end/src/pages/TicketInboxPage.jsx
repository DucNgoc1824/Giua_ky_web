import React, { useState, useEffect } from 'react';
import ticketService from '../services/ticketService';
import { useAuth } from '../context/AuthContext';
import '../assets/ManagementPage.css';

const TicketInboxPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchInbox = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await ticketService.getTicketInbox();
      setTickets(data);
    } catch (err) {
      setError(err.message || 'Không thể tải hòm thư.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  if (isLoading) {
    return <div className="loading-text">Đang tải hòm thư...</div>;
  }
  if (error) {
    return <div className="error-text">Lỗi: {error}</div>;
  }

  return (
    <div className="ticket-inbox-page">
      <div className="page-header">
        <h1>Hòm thư Hỏi đáp/Khiếu nại</h1>
      </div>
      
      <p style={{ marginBottom: '2rem', fontSize: '1.2rem' }}>
        Chào <strong>{user.fullName}</strong>. Đây là các thắc mắc của sinh viên được gửi đến bạn:
      </p>

      <table className="data-table">
        <thead>
          <tr>
            <th>Ngày gửi</th>
            <th>Trạng thái</th>
            <th>Người gửi</th>
            <th>Lớp</th>
            <th>Môn học</th>
            <th>Nội dung</th>
          </tr>
        </thead>
        <tbody>
          {tickets.length > 0 ? (
            tickets.map((ticket) => (
              <tr key={ticket.ticket_id}>
                <td>{new Date(ticket.created_at).toLocaleString('vi-VN')}</td>
                <td>
                  <span style={{
                    color: ticket.status === 'Mới' ? 'var(--ptit-red)' : 'green',
                    fontWeight: '600'
                  }}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.student_name}</td>
                <td>{ticket.class_code}</td>
                <td>{ticket.subject_name}</td>
                <td style={{ maxWidth: '300px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {ticket.message_text}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>
                Bạn không có tin nhắn nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketInboxPage;