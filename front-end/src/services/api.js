import axios from 'axios';

// 1. Tạo một instance axios với cấu hình cơ bản
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // URL gốc của backend
  timeout: 10000, // Thời gian chờ request (10 giây)
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 2. Cấu hình "Interceptors" (Người chặn)

  Đây là phần ma thuật! Nó sẽ tự động "chặn" MỌI request
  trước khi gửi đi để đính kèm token (nếu có).
*/
api.interceptors.request.use(
  (config) => {
    // Lấy token từ Local Storage (chúng ta sẽ lưu token ở đó khi đăng nhập)
    const token = localStorage.getItem('token');
    
    if (token) {
      // Nếu có token, gắn nó vào header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Cho request đi tiếp
  },
  (error) => {
    // Xử lý lỗi nếu có
    return Promise.reject(error);
  }
);

export default api;