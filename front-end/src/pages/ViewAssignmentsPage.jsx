import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import assignmentService from '../services/assignmentService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import '../assets/ManagementPage.css';

const ViewAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [submissionData, setSubmissionData] = useState({
    submission_text: '',
    file: null,
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await assignmentService.getAssignments();
      setAssignments(data);
      
      // Extract unique subjects
      const uniqueSubjects = [...new Set(data.map(a => a.subject_name))];
      setSubjects(uniqueSubjects);
      
      setFilteredAssignments(data);
    } catch (error) {
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = assignments;
    
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(a => a.subject_name === selectedSubject);
    }
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(a => a.status === selectedStatus);
    }
    
    setFilteredAssignments(filtered);
    setCurrentPage(1);
  }, [selectedSubject, selectedStatus, assignments]);

  const handleFileChange = (e) => {
    setSubmissionData((prev) => ({ ...prev, file: e.target.files[0] }));
  };

  const handleTextChange = (e) => {
    setSubmissionData((prev) => ({ ...prev, submission_text: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submissionData.file && !submissionData.submission_text.trim()) {
      toast.error('Vui lòng nhập nội dung hoặc đính kèm file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('assignment_id', selectedAssignment.assignment_id);
      formData.append('submission_text', submissionData.submission_text);
      if (submissionData.file) {
        formData.append('file', submissionData.file);
      }

      await assignmentService.submitAssignment(formData);
      toast.success('Nộp bài thành công');
      setIsSubmitModalOpen(false);
      resetSubmissionForm();
      fetchAssignments();
    } catch (error) {
      toast.error(error.message || 'Không thể nộp bài');
    }
  };

  const handleOpenSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmitModalOpen(true);
  };

  const resetSubmissionForm = () => {
    setSubmissionData({
      submission_text: '',
      file: null,
    });
    setSelectedAssignment(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'submitted':
        return <span className="badge badge-success">Đã nộp</span>;
      case 'overdue':
        return <span className="badge badge-danger">Quá hạn</span>;
      case 'pending':
        return <span className="badge badge-warning">Chưa nộp</span>;
      default:
        return <span className="badge badge-secondary">Không rõ</span>;
    }
  };

  const handleOpenDetailModal = (assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailModalOpen(true);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAssignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>📚 Bài tập của tôi</h1>
      </div>

      {isLoading ? (
        <div className="loading-text">Đang tải...</div>
      ) : (
        <>
          {/* Filters */}
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label htmlFor="subject-filter" style={{ marginRight: '0.5rem', fontWeight: '500' }}>
                Môn học:
              </label>
              <select 
                id="subject-filter"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.95rem', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả môn</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status-filter" style={{ marginRight: '0.5rem', fontWeight: '500' }}>
                Trạng thái:
              </label>
              <select 
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.95rem', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  cursor: 'pointer'
                }}
              >
                <option value="all">Tất cả</option>
                <option value="submitted">Đã nộp</option>
                <option value="pending">Chưa nộp</option>
                <option value="overdue">Quá hạn</option>
              </select>
            </div>

            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              ({filteredAssignments.length} bài tập)
            </span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Môn học</th>
                  <th>Giảng viên</th>
                  <th>Hạn nộp</th>
                  <th>Trạng thái</th>
                  <th>Điểm</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((assignment, index) => (
                    <tr key={assignment.assignment_id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <strong>{assignment.title}</strong>
                        {assignment.description && (
                          <div style={{ fontSize: '0.85em', color: '#666', marginTop: '0.25rem' }}>
                            {assignment.description.substring(0, 50)}
                            {assignment.description.length > 50 && '...'}
                          </div>
                        )}
                      </td>
                      <td>
                        {assignment.subject_code} - {assignment.subject_name}
                      </td>
                      <td>{assignment.lecturer_name}</td>
                      <td>{formatDate(assignment.due_date)}</td>
                      <td>{getStatusBadge(assignment.submission_status)}</td>
                      <td className="text-center">
                        {assignment.score !== null && assignment.score !== undefined
                          ? assignment.score
                          : '-'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            className="btn btn-sm btn-info"
                            onClick={() => handleOpenDetailModal(assignment)}
                            title="Xem chi tiết"
                          >
                            👁️ Chi tiết
                          </button>
                          {assignment.submission_status === 'submitted' ? (
                            <span className="text-success" style={{ padding: '0.25rem 0.5rem' }}>✅ Đã nộp</span>
                          ) : assignment.submission_status === 'overdue' ? (
                            <span className="text-danger" style={{ padding: '0.25rem 0.5rem' }}>❌ Quá hạn</span>
                          ) : (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleOpenSubmitModal(assignment)}
                            >
                              📤 Nộp bài
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center" style={{ padding: '3rem', color: '#999' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                      <div style={{ fontSize: '1.1rem' }}>
                        {selectedSubject !== 'all' || selectedStatus !== 'all'
                          ? 'Không tìm thấy bài tập phù hợp với bộ lọc.'
                          : 'Chưa có bài tập nào.'}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}

      {/* Modal xem chi tiết bài tập */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Chi tiết bài tập"
      >
        {selectedAssignment && (
          <div style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Tiêu đề:</strong> {selectedAssignment.title}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Môn học:</strong> {selectedAssignment.subject_code} - {selectedAssignment.subject_name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Giảng viên:</strong> {selectedAssignment.lecturer_name}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Hạn nộp:</strong> {formatDate(selectedAssignment.due_date)}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Trạng thái:</strong> {getStatusBadge(selectedAssignment.submission_status)}
            </div>
            {selectedAssignment.description && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Mô tả:</strong>
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '1rem', 
                  background: '#f5f5f5', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedAssignment.description}
                </div>
              </div>
            )}
            {selectedAssignment.submission_text && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Bài làm của bạn:</strong>
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '1rem', 
                  background: '#e8f5e9', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedAssignment.submission_text}
                </div>
              </div>
            )}
            {selectedAssignment.score !== null && selectedAssignment.score !== undefined && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Điểm:</strong> <span style={{ fontSize: '1.2rem', color: '#10b981', fontWeight: 'bold' }}>{selectedAssignment.score}</span>
              </div>
            )}
            {selectedAssignment.feedback && (
              <div style={{ marginBottom: '1rem' }}>
                <strong>Nhận xét của giảng viên:</strong>
                <div style={{ 
                  marginTop: '0.5rem', 
                  padding: '1rem', 
                  background: '#fff3cd', 
                  borderRadius: '4px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {selectedAssignment.feedback}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal nộp bài */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => {
          setIsSubmitModalOpen(false);
          resetSubmissionForm();
        }}
        title={`Nộp bài: ${selectedAssignment?.title || ''}`}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Môn học</label>
            <input
              type="text"
              value={
                selectedAssignment
                  ? `${selectedAssignment.subject_code} - ${selectedAssignment.subject_name}`
                  : ''
              }
              disabled
            />
          </div>

          <div className="form-group">
            <label>Hạn nộp</label>
            <input
              type="text"
              value={selectedAssignment ? formatDate(selectedAssignment.due_date) : ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="submission_text">Nội dung bài làm</label>
            <textarea
              id="submission_text"
              rows="6"
              value={submissionData.submission_text}
              onChange={handleTextChange}
              placeholder="Nhập nội dung bài làm của bạn..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="file">Đính kèm file (không bắt buộc)</label>
            <input type="file" id="file" onChange={handleFileChange} />
            {submissionData.file && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.9em', color: '#666' }}>
                File đã chọn: {submissionData.file.name}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsSubmitModalOpen(false);
                resetSubmissionForm();
              }}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Nộp bài
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ViewAssignmentsPage;
