import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import classService from '../services/classService';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';
import '../assets/Pagination.css';

const ClassManagementPage = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    class_code: '',
    major: '',
  });
  const [editingClassId, setEditingClassId] = useState(null);
  const [formError, setFormError] = useState(null);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const data = await classService.getAllClasses();
      setClasses(data);
      setFilteredClasses(data);
    } catch (err) {
      toast.error('❌ Lỗi khi tải danh sách lớp học: ' + (err.message || 'Unknown'));
    } finally {
      setIsLoading(false);
    }
  };

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(0);
    
    if (!query.trim()) {
      setFilteredClasses(classes);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = classes.filter(cls =>
      cls.class_code?.toLowerCase().includes(lowerQuery) ||
      cls.major?.toLowerCase().includes(lowerQuery)
    );
    setFilteredClasses(filtered);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenAddModal = () => {
    setEditingClassId(null);
    setFormData({ class_code: '', major: '' });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lop) => {
    setEditingClassId(lop.class_id);
    setFormData({ class_code: lop.class_code, major: lop.major });
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

    try {
      if (editingClassId) {
        await classService.updateClass(editingClassId, formData);
        toast.success('✅ Cập nhật lớp học thành công!');
      } else {
        await classService.createClass(formData);
        toast.success('✅ Thêm lớp học thành công!');
      }
      
      fetchClasses();
      handleCloseModal();
      
    } catch (err) {
      toast.error('❌ Lỗi: ' + (err.message || 'Có lỗi xảy ra'));
      setFormError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const handleDelete = async (classId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp học này?')) {
      try {
        await classService.deleteClass(classId);
        toast.success('✅ Xóa lớp học thành công!');
        fetchClasses();
      } catch (err) {
        toast.error('❌ Lỗi khi xóa: ' + err.message);
      }
    }
  };

  // Pagination calculations
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredClasses.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredClasses.length / itemsPerPage);

  if (isLoading) {
    return <LoadingSpinner message="Đang tải danh sách lớp học..." />;
  }

  if (isLoading) {
    return <LoadingSpinner message="Đang tải danh sách lớp học..." />;
  }

  return (
    <div className="class-management-page">
      <div className="page-header">
        <h1>Quản lý Lớp học</h1>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <FaPlus /> Thêm Lớp
        </button>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder="Tìm theo mã lớp, ngành..."
        />
      </div>

      {filteredClasses.length === 0 && searchQuery && (
        <div className="no-results">
          <FaSearch size={48} color="#999" />
          <p>Không tìm thấy kết quả cho "{searchQuery}"</p>
        </div>
      )}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã lớp</th>
              <th>Ngành học</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((lop) => (
                <tr key={lop.class_id}>
                  <td>{lop.class_id}</td>
                  <td>{lop.class_code}</td>
                  <td>{lop.major}</td>
                  <td className="actions">
                    <div className="action-buttons" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', justifyContent: 'center' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => handleOpenEditModal(lop)}
                        title="Sửa"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(lop.class_id)}
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
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  Chưa có lớp học nào.
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClassId ? 'Chỉnh sửa Lớp học' : 'Thêm Lớp học mới'}
      >
        <form className="modal-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="class_code">Mã lớp</label>
            <input
              type="text"
              id="class_code"
              name="class_code"
              value={formData.class_code}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="major">Ngành học</label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleFormChange}
              required
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

export default ClassManagementPage;