import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Star } from 'lucide-react';

interface SubCategory {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  SubCategories: SubCategory[];
}

const Subcategories: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => {
        const found = res.data.find((c: Category) => c.id === Number(categoryId));
        setCategory(found || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!category) return <div className="min-h-screen flex items-center justify-center">קטגוריה לא נמצאה</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/categories')}
          className="flex items-center gap-2 text-blue-600 mb-6 hover:underline"
        >
          <ArrowRight size={20} />
          חזרה לקטגוריות
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h1>
        <p className="text-gray-600 mb-8">בחרי נושא ללמידה</p>

        <div className="space-y-4">
          {category.SubCategories.map((sub) => (
            <div
              key={sub.id}
              onClick={() => navigate(`/chat/${sub.id}?categoryId=${categoryId}`)}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 cursor-pointer flex justify-between items-center transition-all"
            >
              <span className="text-lg font-medium text-gray-700">{sub.name}</span>
              <Star className="text-yellow-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subcategories;