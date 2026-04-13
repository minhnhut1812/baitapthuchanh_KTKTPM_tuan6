import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'react-feather';
import { userApi } from '../api/axiosClient';

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };

    if (name === 'username') {
      if (!usernameRegex.test(value)) {
        newErrors.username = 'Username ≥6 ký tự, gồm chữ và số';
      } else delete newErrors.username;
    }

    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        newErrors.password = 'Password phải có hoa, thường, số';
      } else delete newErrors.password;
    }

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        newErrors.confirmPassword = 'Mật khẩu không khớp';
      } else delete newErrors.confirmPassword;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const res = await userApi.post('/users/register', {
        username: formData.username,
        password: formData.password
      });

      if (res.data) {
        alert('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

        <h2 className="text-xl font-bold mb-4">Đăng ký</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${errors.username && 'border-red-500'}`}
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pr-10 p-2 border rounded ${errors.password && 'border-red-500'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm */}
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pr-10 p-2 border rounded ${errors.confirmPassword && 'border-red-500'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          <button
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Đã có tài khoản?{' '}
          <span className="text-green-600 cursor-pointer" onClick={() => navigate('/login')}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;