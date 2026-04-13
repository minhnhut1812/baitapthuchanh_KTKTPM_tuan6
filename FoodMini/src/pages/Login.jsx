import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Eye, EyeOff } from 'react-feather';
import { userApi } from '../api/axiosClient';

function Login({ onLogin }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const usernameRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };

    if (name === 'username') {
      if (!usernameRegex.test(value)) {
        newErrors.username = 'Username ≥6 ký tự';
      } else delete newErrors.username;
    }

    if (name === 'password') {
      if (!passwordRegex.test(value)) {
        newErrors.password = 'Password yếu';
      } else delete newErrors.password;
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const res = await userApi.post('/users/login', formData);

      if (res.data) {
        onLogin(res.data);
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-light to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">

        <h2 className="text-xl font-bold mb-4">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.username && 'border-red-500'}`}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className={`w-full pr-10 p-2 border rounded ${errors.password && 'border-red-500'}`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            disabled={loading || Object.keys(errors).length > 0}
            className="w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="mt-4 text-center">
          Chưa có tài khoản?{' '}
          <span className="text-green-600 cursor-pointer" onClick={() => navigate('/register')}>
            Đăng ký
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;