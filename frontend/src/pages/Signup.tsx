import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus, Phone, User, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        name,
        phone
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      alert(`שלום ${name}, נרשמת בהצלחה!`);
      navigate('/categories');
    } catch (error) {
      console.error(error);
      alert('שגיאה ברישום. ודאי שהשרת פועל ושהפרטים נכונים.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <div className="inline-flex p-3 rounded-full bg-white/20 mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">פלטפורמת למידה AI</h2>
          <p className="text-blue-100 mt-1">הירשמו והתחילו ללמוד היום</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">שם מלא</label>
            <div className="relative">
              <User className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="ישראל ישראלי"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">מספר טלפון</label>
            <div className="relative">
              <Phone className="absolute right-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                className="w-full pr-10 pl-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="050-0000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200'
            }`}
          >
            {loading ? 'רושם אותך...' : (
              <>
                <UserPlus size={20} />
                הצטרפות עכשיו
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;