import { paymentApi } from '../api/axiosClient';

export const paymentService = {
  // Tạo thanh toán
  createPayment: async (orderId, method) => {
    try {
      const response = await paymentApi.post('/api/payments', {
        orderId,
        method,
        status: 'SUCCESS'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thanh toán theo ID
  getPaymentById: async (id) => {
    try {
      const response = await paymentApi.get(`/api/payments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy thanh toán theo Order ID
  getPaymentByOrderId: async (orderId) => {
    try {
      const response = await paymentApi.get(`/api/payments/order/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
