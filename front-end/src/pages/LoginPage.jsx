import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Hook "kho"
import { useNavigate } from 'react-router-dom';
import '../assets/LoginPage.css'; // Import file CSS

const LoginPage = () => {
  // 1. State để lưu trữ username và password
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // State để lưu thông báo lỗi

  // 2. Lấy hàm login từ "kho"
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook để chuyển trang

  // 3. Hàm xử lý khi nhấn nút Đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form reload lại trang
    setError(''); // Xóa lỗi cũ

    try {
      // Gọi hàm login từ "kho"
      await login(username, password);

      // Nếu login thành công, AuthContext sẽ tự động
      // cập nhật 'isAuthenticated' -> App.jsx sẽ tự động
      // chuyển chúng ta đến trang Dashboard
      // (Nhưng chúng ta cũng có thể điều hướng thủ công ở đây nếu muốn)
      // navigate('/'); 

    } catch (err) {
      // Nếu login thất bại (từ authService ném ra)
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">Đăng nhập</h1>
        <h2 style={{textAlign: 'center', color: '#555', marginTop: '-1rem', marginBottom: '1.5rem'}}>Hệ thống Quản lý Sinh viên</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Hiển thị lỗi nếu có */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;