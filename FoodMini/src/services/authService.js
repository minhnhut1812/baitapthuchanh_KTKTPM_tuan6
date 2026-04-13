import { userApi } from '../api/axiosClient';

export const authService = {
  // Đăng nhập người dùng
  login: async (username, password) => {
    try {
      const response = await userApi.post('/users/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thông tin người dùng hiện tại
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('currentOrder');
    localStorage.removeItem('orderTotal');
  },

  // Kiểm tra xem người dùng đã đăng nhập chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};
