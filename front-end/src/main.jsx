import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import './index.css'; // File CSS, bạn có thể chỉnh sửa sau

import { AuthProvider } from './context/AuthContext'; // <--- 1. Import
import { BrowserRouter } from 'react-router-dom'; // <--- 2. Import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <--- 3. Bọc bằng Router (để chuyển trang) */}
      <AuthProvider> {/* <--- 4. Bọc bằng AuthProvider (để quản lý đăng nhập) */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);