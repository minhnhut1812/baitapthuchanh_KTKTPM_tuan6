import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Menu } from 'react-feather';

function Navbar({ user, onLogout, cartCount }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🍽️</span>
            </div>
            <span className="text-xl font-bold text-brand-green hidden sm:inline">FoodMini</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-gray-700">Xin chào, <span className="font-semibold text-brand-green">{user.username}</span></span>
                <Link
                  to="/checkout"
                  className="relative flex items-center text-gray-700 hover:text-brand-green transition"
                >
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <LogOut size={20} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-brand-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-medium"
              >
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-brand-green"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            {user ? (
              <>
                <p className="text-gray-700 px-2">Xin chào, <span className="font-semibold text-brand-green">{user.username}</span></p>
                <Link
                  to="/checkout"
                  className="block text-gray-700 hover:text-brand-green px-2 py-2"
                >
                  Giỏ hàng ({cartCount})
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium text-center"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
