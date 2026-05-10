import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

const icons = ['📚', '🔬', '💻', '🌍', '🎨', '🧮'];
const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-yellow-500'];

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">מה תרצי ללמוד היום?</h1>
          <button onClick={() => navigate('/history')} className="flex items-center gap-2 text-blue-600 hover:underline">
            <Clock size={18} />
            היסטוריה
          </button>
        </div>
        <p className="text-gray-600 mb-8">בחרי קטגוריה כדי להתחיל</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/categories/${cat.id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex items-center gap-6 group"
            >
              <div className={`${colors[i % colors.length]} p-4 rounded-xl text-white text-2xl transition-transform group-hover:scale-110`}>
                {icons[i % icons.length]}
              </div>
              <span className="text-xl font-bold text-gray-700">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;