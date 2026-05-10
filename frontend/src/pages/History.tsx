import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Clock } from 'lucide-react';

interface Prompt {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
  category_id: number;
  sub_category_id: number;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) { navigate('/'); return; }
    axios.get(`http://localhost:5000/api/learning/history/${user.id}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate('/categories')} className="flex items-center gap-2 text-blue-600 mb-6 hover:underline">
          <ArrowRight size={20} />
          חזרה לקטגוריות
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">היסטוריית למידה</h1>
        <p className="text-gray-600 mb-8">שלום {user.name}, הנה כל השיעורים שלך</p>

        {history.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">אין היסטוריה עדיין. התחילי ללמוד!</div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Clock size={14} />
                  {new Date(item.created_at).toLocaleDateString('he-IL')}
                </div>
                <p className="font-bold text-gray-700 mb-2">שאלה: {item.prompt}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.response}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;