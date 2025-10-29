import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import subjectService from '../services/subjectService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';
import '../assets/Pagination.css';

const SubjectManagementPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    credits: '',
  });
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const data = await subjectService.getAllSubjects();
      setSubjects(data);
      setFilteredSubjects(data);
    } catch (err) {
      toast.error('❌ Lỗi khi tải danh sách môn học: ' + (err.message || 'Unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
    
    if (!query.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = subjects.filter(subject =>
      subject.subject_name?.toLowerCase().includes(lowerQuery) ||
      subject.subject_code?.toLowerCase().includes(lowerQuery)
    );
    setFilteredSubjects(filtered);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleOpenAddModal = () => {
    setEditingSubjectId(null);
    setFormData({ subject_code: '', subject_name: '', credits: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (subject) => {
    setEditingSubjectId(subject.subject_id);
    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      credits: subject.credits,
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const dataToSubmit = {
      ...formData,
      credits: parseInt(formData.credits, 10),
    };
    
    if (isNaN(dataToSubmit.credits) || dataToSubmit.credits <= 0) {
      setFormError('Số tín chỉ phải là một số dương.');
      return;
    }

    try {
      if (editingSubjectId) {
        await subjectService.updateSubject(editingSubjectId, dataToSubmit);
        toast.success('✅ Cập nhật môn học thành công!');
      } else {
        await subjectService.createSubject(dataToSubmit);
        toast.success('✅ Thêm môn học thành công!');
      }
      fetchSubjects();
      handleCloseModal();
    } catch (err) {
      toast.error('❌ Lỗi: ' + (err.message || 'Có lỗi xảy ra'));
      setFormError(err.message || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
      try {
        await subjectService.deleteSubject(subjectId);
        toast.success('✅ Xóa môn học thành công!');
        fetchSubjects();
      } catch (err) {
        toast.error('❌ Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredSubjects.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredSubjects.length / itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner message="Đang tải danh sách môn học..." />;
  }

  return (
    <div className="subject-management-page">
      <div className="page-header">
        <h1>Quản lý Môn học</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FaPlus /> Thêm Môn
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm theo tên, mã môn học..."
        />
      </div>

      {filteredSubjects.length === 0 && searchQuery && (
        <div className="no-results">
          <FaSearch size={48} color="#999" />
          <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã môn học</th>
              <th>Tên môn học</th>
              <th>Số tín chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((subject) => (
                <tr key={subject.subject_id}>
                  <td>{subject.subject_id}</td>
                  <td>{subject.subject_code}</td>
                  <td>{subject.subject_name}</td>
                  <td>{subject.credits}</td>
                  <td className="actions">
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditModal(subject)}
                        title="Sửa"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(subject.subject_id)}
                        title="Xóa"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                  Chưa có môn học nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          margin: '2rem 0 1rem 0',
          padding: '1rem'
        }}>
          <ReactPaginate
            previousLabel={'← Trước'}
            nextLabel={'Sau →'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            pageClassName={'page-item'}
            breakClassName={'page-item'}
            disabledClassName={'disabled'}
            forcePage={currentPage}
          />
        </div>
      )}

      {/* === MODAL THÊM/SỬA === */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSubjectId ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="subject_code">Mã môn học</label>
            <input
              type="text"
              id="subject_code"
              name="subject_code"
              value={formData.subject_code}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject_name">Tên môn học</label>
            <input
              type="text"
              id="subject_name"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="credits">Số tín chỉ</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleFormChange}
              required
              min="1"
            />
          </div>
          
          {formError && <p className="error-text" style={{marginTop: 0}}>{formError}</p>}

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SubjectManagementPage;