import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';

interface Prompt {
  id: number;
  prompt: string;
  response: string;
  created_at: string;
  category_id: number;
  sub_category_id: number;
}

interface User {
  id: number;
  name: string;
  phone: string;
  Prompts?: Prompt[];
}

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">ניהול משתמשים והיסטוריית למידה</p>
          </div>
          <button onClick={() => navigate('/categories')} className="text-blue-600 hover:underline text-sm">
            חזרה לאתר
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <Users className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">סה"כ משתמשים</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <MessageSquare className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">סה"כ שאלות</p>
              <p className="text-2xl font-bold text-gray-800">
                {users.reduce((acc, u) => acc + (u.Prompts?.length || 0), 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{user.Prompts?.length || 0} שאלות</span>
                  {expandedUser === user.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {expandedUser === user.id && (
                <div className="border-t border-gray-100 p-5 space-y-3 bg-gray-50">
                  {!user.Prompts?.length ? (
                    <p className="text-gray-400 text-sm text-center">אין היסטוריה למשתמש זה</p>
                  ) : (
                    user.Prompts.map(prompt => (
                      <div key={prompt.id} className="bg-white p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-400 mb-2">
                          {new Date(prompt.created_at).toLocaleDateString('he-IL')}
                        </p>
                        <p className="font-medium text-gray-700 mb-1">שאלה: {prompt.prompt}</p>
                        <p className="text-gray-500 text-sm line-clamp-2">{prompt.response}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;