import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import assignmentService from '../services/assignmentService';
import subjectService from '../services/subjectService';
import classService from '../services/classService';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import '../assets/ManagementPage.css';

const ManageAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    subject_id: '',
    class_id: '',
  });

  useEffect(() => {
    fetchAssignments();
    fetchSubjects();
    fetchClasses();
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

  const fetchSubjects = async () => {
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAssignment) {
        await assignmentService.updateAssignment(editingAssignment.assignment_id, formData);
        toast.success('Cập nhật bài tập thành công');
      } else {
        await assignmentService.createAssignment(formData);
        toast.success('Tạo bài tập thành công');
      }
      setIsModalOpen(false);
      resetForm();
      fetchAssignments();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description || '',
      due_date: assignment.due_date ? new Date(assignment.due_date).toISOString().slice(0, 16) : '',
      subject_id: assignment.subject_id || '',
      class_id: assignment.class_id || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài tập này?')) return;

    try {
      await assignmentService.deleteAssignment(id);
      toast.success('Xóa bài tập thành công');
      fetchAssignments();
    } catch (error) {
      toast.error(error.message || 'Không thể xóa bài tập');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      due_date: '',
      subject_id: '',
      class_id: '',
    });
    setEditingAssignment(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
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

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = assignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(assignments.length / itemsPerPage);

  return (
    <div className="management-page">
      <div className="page-header">
        <h1>📝 Quản lý Bài tập</h1>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          ➕ Tạo bài tập mới
        </button>
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
                  <th>Lớp</th>
                  <th>Hạn nộp</th>
                  <th>Số bài nộp</th>
                  <th>Trạng thái</th>
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
                      <td>{assignment.class_code || 'Tất cả'}</td>
                      <td>
                        <span style={{ color: isOverdue(assignment.due_date) ? 'red' : 'inherit' }}>
                          {formatDate(assignment.due_date)}
                        </span>
                      </td>
                      <td className="text-center">{assignment.total_submissions || 0}</td>
                      <td>
                        {isOverdue(assignment.due_date) ? (
                          <span className="badge badge-danger">Đã hết hạn</span>
                        ) : (
                          <span className="badge badge-success">Đang mở</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleEdit(assignment)}
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(assignment.assignment_id)}
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
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

      {/* Modal thêm/sửa bài tập */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingAssignment ? 'Chỉnh sửa bài tập' : 'Tạo bài tập mới'}
      >
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Tiêu đề *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject_id">Môn học *</label>
            <select
              id="subject_id"
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              required
              disabled={!!editingAssignment}
            >
              <option value="">-- Chọn môn học --</option>
              {subjects.map((subject) => (
                <option key={subject.subject_id} value={subject.subject_id}>
                  {subject.subject_code} - {subject.subject_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="class_id">Lớp (để trống nếu giao cho tất cả)</label>
            <select
              id="class_id"
              name="class_id"
              value={formData.class_id}
              onChange={handleChange}
              disabled={!!editingAssignment}
            >
              <option value="">-- Tất cả lớp --</option>
              {classes.map((cls) => (
                <option key={cls.class_id} value={cls.class_id}>
                  {cls.class_code}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Hạn nộp *</label>
            <input
              type="datetime-local"
              id="due_date"
              name="due_date"
              value={formData.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAssignment ? 'Cập nhật' : 'Tạo bài tập'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageAssignmentsPage;
