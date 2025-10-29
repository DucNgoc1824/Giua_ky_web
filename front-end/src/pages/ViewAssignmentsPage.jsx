import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import assignmentService from '../services/assignmentService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import '../assets/ManagementPage.css';

const ViewAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
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
    } catch (error) {
      toast.error('Không thể tải danh sách bài tập');
    } finally {
      setIsLoading(false);
    }
  };

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

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>📚 Bài tập của tôi</h1>
      </div>

      {isLoading ? (
        <div className="loading-text">Đang tải...</div>
      ) : (
        <>
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
                        {assignment.submission_status === 'submitted' ? (
                          <span className="text-success">✅ Đã nộp</span>
                        ) : assignment.submission_status === 'overdue' ? (
                          <span className="text-danger">❌ Quá hạn</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleOpenSubmitModal(assignment)}
                          >
                            📤 Nộp bài
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Chưa có bài tập nào
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
