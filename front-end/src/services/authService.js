import api from './api';

const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password,
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } 
      else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại backend!');
      } 
      else {
        throw new Error(error.message);
      }
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

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