import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import '../assets/LoginPage.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Enter username, 2: Enter OTP + new password
  const [formData, setFormData] = useState({
    username: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [maskedEmail, setMaskedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', {
        username: formData.username
      });

      setMaskedEmail(response.data.maskedEmail);
      toast.success(`Mã OTP: ${response.data.otp} (kiểm tra console)`);
      console.log('🔑 OTP của bạn:', response.data.otp);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', {
        username: formData.username,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      toast.success('Đặt lại mật khẩu thành công!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div style={{
            fontSize: '5rem',
            fontWeight: 'bold',
            color: '#c41e3a',
            marginBottom: '1rem',
            textAlign: 'center',
            fontFamily: 'Arial, sans-serif',
            letterSpacing: '0.1em'
          }}>
            PTIT
          </div>
          <h1>Học viện Công nghệ Bưu chính Viễn thông</h1>
          <h2>🔒 Quên mật khẩu</h2>
        </div>

        {step === 1 ? (
          <form className="login-form" onSubmit={handleRequestOTP}>
            <p style={{ marginBottom: '1.5rem', color: '#666', textAlign: 'center' }}>
              Nhập tên đăng nhập để nhận mã OTP
            </p>

            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập"
                required
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Nhận mã OTP'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: '#c41e3a', textDecoration: 'none' }}>
                ← Quay lại đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleResetPassword}>
            <div style={{ 
              marginBottom: '1.5rem', 
              padding: '1rem', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              border: '1px solid #2196f3'
            }}>
              <p style={{ margin: 0, color: '#1976d2', textAlign: 'center' }}>
                📧 Mã OTP đã được gửi đến: <strong>{maskedEmail}</strong>
              </p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem', textAlign: 'center' }}>
                (Kiểm tra console để xem OTP - chỉ dùng cho development)
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="otp">Mã OTP (6 số):</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                placeholder="Nhập mã OTP"
                maxLength="6"
                pattern="\d{6}"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới:</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                minLength="6"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                minLength="6"
                required
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#c41e3a', 
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                ← Quay lại
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
