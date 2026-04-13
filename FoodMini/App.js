import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './src/components/Navbar';
import Login from './src/pages/Login';
import Home from './src/pages/Home';
import Checkout from './src/pages/Checkout';
import Payment from './src/pages/Payment';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
  };

  const addToCart = (food) => {
    const existingItem = cart.find(item => item.id === food.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const removeFromCart = (foodId) => {
    setCart(cart.filter(item => item.id !== foodId));
  };

  return (
    <Router>
      <div className="min-h-screen bg-brand-light">
        <Navbar user={user} onLogout={handleLogout} cartCount={cart.length} />
        <Routes>
          <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
          <Route path="/" element={user ? <Home onAddToCart={addToCart} /> : <Navigate to="/login" />} />
          <Route path="/checkout" element={user ? <Checkout cart={cart} onRemoveFromCart={removeFromCart} /> : <Navigate to="/login" />} />
          <Route path="/payment" element={user ? <Payment /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
