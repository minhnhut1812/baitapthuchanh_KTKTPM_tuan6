import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, AlertCircle, ArrowRight } from 'react-feather';
import FoodCard from '../components/FoodCard';
import { orderApi } from '../api/axiosClient';

function Checkout({ cart, onRemoveFromCart }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [quantities, setQuantities] = useState({});

  React.useEffect(() => {
    const initialQuantities = {};
    cart.forEach(item => {
      initialQuantities[item.id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, [cart]);

  const handleQuantityChange = (foodId, newQuantity) => {
    if (newQuantity < 1) {
      onRemoveFromCart(foodId);
    } else {
      setQuantities(prev => ({ ...prev, [foodId]: newQuantity }));
    }
  };

  const handleRemove = (foodId) => {
    onRemoveFromCart(foodId);
  };

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const qty = quantities[item.id] || item.quantity || 1;
    return sum + (item.price * qty);
  }, 0);

  const shippingFee = subtotal > 0 ? 30000 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Giỏ hàng trống!');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Chuẩn bị dữ liệu đơn hàng
      const orderData = {
        userId: user.id,
        foodIds: cart.map(item => item.id),
        total: total,
        status: 'CREATED'
      };

      // Gửi đơn hàng đến OrderService
      const response = await orderApi.post('/api/orders', orderData);

      if (response.data) {
        // Lưu order ID và dữ liệu vào localStorage để sử dụng trong trang Payment
        localStorage.setItem('currentOrder', JSON.stringify(response.data));
        localStorage.setItem('orderTotal', total.toString());
        
        // Chuyển sang trang Payment
        navigate('/payment');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Không thể tạo đơn hàng. Vui lòng thử lại.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <ShoppingCart className="text-brand-green" size={32} />
          <h1 className="text-4xl font-bold text-gray-800">Giỏ hàng</h1>
        </div>
        <p className="text-gray-600">Kiểm tra và thanh toán các mục của bạn</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-600 mb-6">Hãy thêm một số món ăn vào giỏ hàng của bạn</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            <span>Tiếp tục mua sắm</span>
            <ArrowRight size={20} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-brand-light to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-4xl">🍲</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{item.type}</p>
                    <p className="text-brand-green font-bold text-lg">
                      {item.price.toLocaleString('vi-VN')}₫
                    </p>
                  </div>

                  {/* Quantity and Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-600 hover:text-red-700 transition"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, (quantities[item.id] || 1) - 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:text-brand-green"
                      >
                        −
                      </button>
                      <span className="px-4 font-semibold text-gray-800 min-w-[50px] text-center">
                        {quantities[item.id] || 1}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, (quantities[item.id] || 1) + 1)
                        }
                        className="px-3 py-1 text-gray-600 hover:text-brand-green"
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="font-bold text-gray-800">
                      {((item.price * (quantities[item.id] || 1)).toLocaleString('vi-VN'))}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Chi tiết đơn hàng</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Tạm tính:</span>
                  <span className="font-semibold">{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Phí giao hàng:</span>
                  <span className="font-semibold">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Thuế (8%):</span>
                  <span className="font-semibold">{Math.round(tax).toLocaleString('vi-VN')}₫</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-800">Tổng cộng:</span>
                <span className="text-3xl font-bold text-brand-green">
                  {Math.round(total).toLocaleString('vi-VN')}₫
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || cart.length === 0}
                className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <span>{loading ? 'Đang tạo đơn hàng...' : 'Tiến hành thanh toán'}</span>
                {!loading && <ArrowRight size={20} />}
              </button>

              <button
                onClick={() => navigate('/')}
                className="w-full mt-3 border-2 border-brand-green text-brand-green py-2 rounded-lg hover:bg-brand-light transition font-medium"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
