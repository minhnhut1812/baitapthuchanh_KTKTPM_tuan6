import { orderApi } from '../api/axiosClient';

export const orderService = {
  // Tạo đơn hàng mới
  createOrder: async (userId, foodIds, total) => {
    try {
      const response = await orderApi.post('/api/orders', {
        userId,
        foodIds,
        total,
        status: 'CREATED'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      const response = await orderApi.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy tất cả đơn hàng của người dùng
  getUserOrders: async (userId) => {
    try {
      const response = await orderApi.get(`/api/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cập nhật status đơn hàng
  updateOrderStatus: async (id, status) => {
    try {
      const response = await orderApi.patch(`/api/orders/${id}`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
