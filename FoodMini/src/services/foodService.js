import { foodApi } from '../api/axiosClient';

export const foodService = {
  // Lấy tất cả món ăn
  getAllFoods: async () => {
    try {
      const response = await foodApi.get('/api/foods');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy món ăn theo ID
  getFoodById: async (id) => {
    try {
      const response = await foodApi.get(`/api/foods/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lọc món ăn theo loại
  getFoodsByType: async (type) => {
    try {
      const response = await foodApi.get(`/api/foods?type=${type}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Lấy danh sách loại món ăn
  getFoodTypes: async () => {
    try {
      const response = await foodApi.get('/api/foods/types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};
