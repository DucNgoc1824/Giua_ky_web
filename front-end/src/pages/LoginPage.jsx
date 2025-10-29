import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../assets/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
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

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">
            Đăng nhập
          </button>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Link 
              to="/forgot-password" 
              style={{ 
                color: '#c41e3a', 
                textDecoration: 'none',
                fontSize: '0.95rem'
              }}
            >
              Quên mật khẩu?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;