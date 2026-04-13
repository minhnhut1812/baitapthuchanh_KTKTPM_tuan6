import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, AlertCircle, Loader } from 'react-feather';
import { paymentApi, orderApi } from '../api/axiosClient';

function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('BANKING');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const currentOrder = JSON.parse(localStorage.getItem('currentOrder')) || {};
  const orderTotal = parseFloat(localStorage.getItem('orderTotal')) || 0;

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (paymentMethod === 'BANKING') {
        if (!formData.cardNumber || !formData.cardHolder || !formData.expiryDate || !formData.cvv) {
          setError('Vui lòng điền đầy đủ thông tin thẻ');
          setLoading(false);
          return;
        }
      }

      // Tạo dữ liệu thanh toán
      const paymentData = {
        orderId: currentOrder.id,
        method: paymentMethod,
        status: 'SUCCESS'
      };

      // Gửi thanh toán đến PaymentService
      const paymentResponse = await paymentApi.post('/api/payments', paymentData);

      if (paymentResponse.data) {
        // Cập nhật status của order thành PAID
        await orderApi.patch(`/api/orders/${currentOrder.id}`, { status: 'PAID' });

        setSuccess(true);

        // Xóa dữ liệu từ localStorage
        localStorage.removeItem('currentOrder');
        localStorage.removeItem('orderTotal');
        localStorage.removeItem('cart');

        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          navigate('/');
        }, 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Thanh toán thất bại. Vui lòng thử lại.'
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="text-brand-green" size={48} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h1>
          <p className="text-gray-600 mb-4">Đơn hàng của bạn đã được xác nhận</p>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Mã đơn hàng</p>
              <p className="text-lg font-bold text-brand-green">{currentOrder.id}</p>
            </div>

            <div className="mb-4 pb-4 border-b border-gray-200">
              <p className="text-sm text-gray-600">Tổng tiền</p>
              <p className="text-2xl font-bold text-gray-800">
                {Math.round(orderTotal).toLocaleString('vi-VN')}₫
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Phương thức</p>
              <p className="text-lg font-medium text-gray-800">
                {paymentMethod === 'BANKING' ? 'Chuyển khoản ngân hàng' : 'Thanh toán khi nhận hàng'}
              </p>
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
            <Truck className="text-brand-green flex-shrink-0 mt-1" size={24} />
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">Đơn hàng sẽ được giao trong 30-45 phút</p>
              <p className="text-xs text-gray-600 mt-1">Bạn sẽ nhận được thông báo cập nhật qua SMS</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4">Quay về trang chủ trong 3 giây...</p>

          <button
            onClick={() => navigate('/')}
            className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-green-700 transition font-bold"
          >
            Quay về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <CreditCard className="text-brand-green" size={32} />
          <h1 className="text-4xl font-bold text-gray-800">Thanh toán</h1>
        </div>
        <p className="text-gray-600">Hoàn tất thanh toán để xác nhận đơn hàng</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Payment Method Selection */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Chọn phương thức thanh toán</h2>

            <div className="space-y-3">
              {/* Banking Option */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: paymentMethod === 'BANKING' ? '#16a34a' : '#e5e7eb',
                  backgroundColor: paymentMethod === 'BANKING' ? '#f0fdf4' : '#ffffff'
                }}
              >
                <input
                  type="radio"
                  value="BANKING"
                  checked={paymentMethod === 'BANKING'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-brand-green"
                />
                <div className="ml-4 flex-1">
                  <CreditCard className="inline-block text-brand-green mr-2" size={20} />
                  <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                  <p className="text-sm text-gray-600 mt-1">Thanh toán qua thẻ debit/credit hoặc internet banking</p>
                </div>
              </label>

              {/* COD Option */}
              <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer transition"
                style={{
                  borderColor: paymentMethod === 'COD' ? '#16a34a' : '#e5e7eb',
                  backgroundColor: paymentMethod === 'COD' ? '#f0fdf4' : '#ffffff'
                }}
              >
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-brand-green"
                />
                <div className="ml-4 flex-1">
                  <Truck className="inline-block text-brand-green mr-2" size={20} />
                  <span className="font-medium text-gray-800">Thanh toán khi nhận hàng</span>
                  <p className="text-sm text-gray-600 mt-1">Thanh toán tiền mặt cho người giao hàng</p>
                </div>
              </label>
            </div>
          </div>

          {/* Card Details Form (Only for BANKING) */}
          {paymentMethod === 'BANKING' && (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin thẻ</h2>

              <div className="space-y-4">
                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số thẻ</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 font-mono"
                  />
                </div>

                {/* Card Holder */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chủ thẻ</label>
                  <input
                    type="text"
                    name="cardHolder"
                    value={formData.cardHolder}
                    onChange={handleChange}
                    placeholder="NGUYEN VAN A"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 uppercase"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hạn sử dụng</label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      maxLength="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-brand-green text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Thanh toán ngay</span>
                )}
              </button>
            </form>
          )}

          {/* COD Payment Info */}
          {paymentMethod === 'COD' && (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start space-x-3">
                <Truck className="text-blue-600 flex-shrink-0 mt-0.5" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">Thanh toán khi nhận hàng</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Bạn sẽ thanh toán trực tiếp cho người giao hàng khi nhận đơn hàng
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-green text-white py-3 rounded-lg hover:bg-green-700 transition font-bold flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác nhận đơn hàng</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tóm tắt đơn hàng</h2>

            <div className="space-y-3 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Mã đơn:</span>
                <span className="font-mono text-sm text-brand-green">{currentOrder.id}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Số mục:</span>
                <span className="font-semibold">{currentOrder.foodIds?.length || 0}</span>
              </div>
            </div>

            <div className="my-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between text-gray-700 mb-2">
                <span>Giá tiền:</span>
                <span className="font-semibold">{Math.round(orderTotal * 0.926).toLocaleString('vi-VN')}₫</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Phí giao + Thuế:</span>
                <span className="font-semibold">{Math.round(orderTotal * 0.074).toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-800">Tổng cộng:</span>
              <span className="text-2xl font-bold text-brand-green">
                {Math.round(orderTotal).toLocaleString('vi-VN')}₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
