import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // Import dịch vụ auth
import { useNavigate } from 'react-router-dom';

// 1. Tạo Context (Cái kho)
const AuthContext = createContext(null);

// 2. Tạo Provider (Người quản lý kho)
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null, // Lấy token từ localStorage nếu có
    user: null, // Ban đầu chưa biết user là ai
    isAuthenticated: false, // Ban đầu chưa đăng nhập
    isLoading: true, // Đang tải (để kiểm tra user)
  });
  const navigate = useNavigate();

  // 3. Hàm chạy khi ứng dụng vừa tải
  useEffect(() => {
    // Lấy user từ localStorage
    const user = authService.getCurrentUser();
    
    if (user && authState.token) {
      // Nếu có user và token -> xem như đã đăng nhập
      setAuthState({
        token: authState.token,
        user: user,
        isAuthenticated: true,
        isLoading: false, // Tải xong
      });
    } else {
      // Nếu không có -> xem như chưa đăng nhập
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false, // Tải xong
      });
    }
  }, [authState.token]); // Chỉ chạy lại khi token thay đổi

  // 4. Hàm xử lý đăng nhập
  const login = async (username, password) => {
    try {
      // Gọi API login
      const data = await authService.login(username, password);
      // Cập nhật lại kho
      setAuthState({
        token: data.token,
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return data; // Trả về data để trang Login xử lý
    } catch (error) {
      // Nếu lỗi, dọn kho
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      throw error; // Ném lỗi ra
    }
  };

  // 5. Hàm xử lý đăng xuất
  const logout = () => {
    authService.logout(); // Xóa khỏi localStorage
    
    // Dọn kho (cập nhật state)
    setAuthState({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    navigate('/login'); // <--- 3. THÊM DÒNG NÀY (chuyển hướng về login)
  };

  // 6. Cung cấp "kho" và "các hàm quản lý" cho toàn bộ ứng dụng
  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {/* Chỉ hiển thị ứng dụng khi đã tải xong (isLoading: false) */}
      {!authState.isLoading && children}
    </AuthContext.Provider>
  );
};

// 7. Tạo một "hook" tùy chỉnh (giúp component khác lấy kho dễ hơn)
export const useAuth = () => {
  return useContext(AuthContext);
};