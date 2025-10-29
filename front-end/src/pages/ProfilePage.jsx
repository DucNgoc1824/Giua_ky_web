import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import '../assets/ManagementPage.css';
import '../assets/Modal.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    address: '',
    department: '',
    position: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth ? data.date_of_birth.split('T')[0] : '',
        address: data.address || '',
        department: data.department || '',
        position: data.position || '',
      });
    } catch (error) {
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateProfile(formData);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.message || 'Lỗi khi cập nhật thông tin');
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Đổi mật khẩu thành công!');
      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.message || 'Lỗi khi đổi mật khẩu');
    }
  };

  if (isLoading) return <div className="loading-text">Đang tải thông tin...</div>;
  if (!profile) return <div className="error-text">Không tìm thấy thông tin</div>;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>👤 Thông tin cá nhân</h1>
        <div>
          {!isEditing ? (
            <>
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                ✏️ Chỉnh sửa
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setIsPasswordModalOpen(true)}
                style={{ marginLeft: '0.5rem' }}
              >
                🔒 Đổi mật khẩu
              </button>
            </>
          ) : (
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
              ❌ Hủy
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="form-section" style={{ 
            backgroundColor: '#fff', 
            padding: '2rem', 
            borderRadius: '8px',
            marginBottom: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input type="text" value={profile.username} disabled />
            </div>

            <div className="form-group">
              <label>Họ và tên *</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Vai trò</label>
              <input
                type="text"
                value={
                  profile.role_id === 1 ? 'Quản trị viên' :
                  profile.role_id === 2 ? 'Giảng viên' : 'Sinh viên'
                }
                disabled
              />
            </div>
          </div>

          {/* Student-specific info */}
          {profile.role_id === 3 && (
            <div className="form-section" style={{ 
              backgroundColor: '#fff', 
              padding: '2rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Thông tin sinh viên</h3>
              
              <div className="form-group">
                <label>Mã sinh viên</label>
                <input type="text" value={profile.student_code || ''} disabled />
              </div>

              <div className="form-group">
                <label>Lớp</label>
                <input type="text" value={profile.class_code || ''} disabled />
              </div>

              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <textarea
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}

          {/* Lecturer-specific info */}
          {profile.role_id === 2 && (
            <div className="form-section" style={{ 
              backgroundColor: '#fff', 
              padding: '2rem', 
              borderRadius: '8px',
              marginBottom: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ marginBottom: '1.5rem', color: '#667eea' }}>Thông tin giảng viên</h3>
              
              <div className="form-group">
                <label>Mã giảng viên</label>
                <input type="text" value={profile.lecturer_code || ''} disabled />
              </div>

              <div className="form-group">
                <label>Khoa/Bộ môn</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="form-group">
                <label>Chức vụ</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}

          {isEditing && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                💾 Lưu thay đổi
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Đổi mật khẩu"
      >
        <form className="modal-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label htmlFor="currentPassword">Mật khẩu hiện tại *</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">Mật khẩu mới * (tối thiểu 6 ký tự)</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Xác nhận mật khẩu mới *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              Đổi mật khẩu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
