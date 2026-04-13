import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle, Filter } from 'react-feather';
import FoodCard from '../components/FoodCard';
import { foodApi } from '../api/axiosClient';

function Home({ onAddToCart }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const response = await foodApi.get('/api/foods');
      setFoods(response.data);

      // Extract unique types
      const uniqueTypes = [...new Set(response.data.map(food => food.type))];
      setTypes(uniqueTypes);
    } catch (err) {
      setError('Không thể tải danh sách món ăn. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFoods = selectedType
    ? foods.filter(food => food.type === selectedType)
    : foods;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🍽️ Menu Thực Đơn</h1>
        <p className="text-gray-600">Khám phá những món ăn ngon nhất tại FoodMini</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchFoods}
              className="text-red-600 underline text-sm mt-2 hover:text-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {/* Filter */}
      {types.length > 0 && (
        <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Filter size={20} className="text-brand-green" />
            <span className="font-semibold text-gray-700">Lọc theo loại:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                !selectedType
                  ? 'bg-brand-green text-white'
                  : 'bg-brand-light text-brand-green hover:bg-green-100'
              }`}
            >
              Tất cả
            </button>
            {types.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedType === type
                    ? 'bg-brand-green text-white'
                    : 'bg-brand-light text-brand-green hover:bg-green-100'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader className="animate-spin text-brand-green mb-4" size={40} />
          <p className="text-gray-600 font-medium">Đang tải menu...</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">
            {selectedType ? 'Không có món ăn nào trong loại này' : 'Chưa có món ăn nào'}
          </p>
        </div>
      ) : (
        <>
          {/* Food Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoods.map(food => (
              <FoodCard
                key={food.id}
                food={food}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="mt-12 text-center p-8 bg-white rounded-lg shadow-md">
            <p className="text-gray-700">
              Đang hiển thị <span className="font-bold text-brand-green">{filteredFoods.length}</span> trong <span className="font-bold text-brand-green">{foods.length}</span> món ăn
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
