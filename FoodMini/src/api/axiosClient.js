import axios from 'axios';

const apiConfig = {
  user: process.env.REACT_APP_USER_API,
  food: process.env.REACT_APP_FOOD_API,
  order: process.env.REACT_APP_ORDER_API,
  payment: process.env.REACT_APP_PAYMENT_API
};

// Tạo các instance riêng biệt cho từng service
export const userApi = axios.create({ 
  baseURL: apiConfig.user,
  headers: { 'Content-Type': 'application/json' }
});

export const foodApi = axios.create({ 
  baseURL: apiConfig.food 
});

export const orderApi = axios.create({ 
  baseURL: apiConfig.order 
});

export const paymentApi = axios.create({ 
  baseURL: apiConfig.payment 
});