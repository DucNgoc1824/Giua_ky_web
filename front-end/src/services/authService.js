import api from './api'; // Import instance axios đã cấu hình

const authService = {
  // Hàm gọi API đăng nhập
  login: async (username, password) => {
    try {
      // Gửi request POST đến /auth/login (vì baseURL đã là /api)
      const response = await api.post('/auth/login', {
        username: username,
        password: password,
      });

      // Nếu đăng nhập thành công (status 200)
      if (response.data && response.data.token) {
        // Lưu token và thông tin user vào Local Storage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data; // Trả về toàn bộ data (gồm token và user)
    } catch (error) {
      // Ném lỗi ra để component có thể bắt và hiển thị
      if (error.response) {
        throw error.response.data;
      } 
      
      // Nếu đây là lỗi mạng (VD: Server sập, ERR_CONNECTION_REFUSED)
      else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend!');
      } 
      
      // Lỗi gì đó khác
      else {
        throw new Error(error.message);
      }
    }
  },

  // Hàm đăng xuất
  logout: () => {
    // Chỉ cần xóa token và user khỏi Local Storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Hàm lấy thông tin user hiện tại (đã lưu trong localStorage)
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // (Bạn có thể thêm hàm register tương tự khi cần)
  // register: async (userData) => { ... }
};

export default authService;