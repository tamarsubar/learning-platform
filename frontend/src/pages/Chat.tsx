import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Send, ArrowRight, Bot, User } from 'lucide-react';

const Chat: React.FC = () => {
  const { subId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages([{ 
      role: 'assistant', 
      content: 'שלום! אני המורה הפרטי שלך. על מה נלמד היום בנושא שבחרת?' 
    }]);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/learning/chat', {
        subCategoryId: subId,
        categoryId: categoryId,
        userId: user.id,
        message: input
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'מצטער, הייתה שגיאה בחיבור ל-AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100" dir="rtl">
      <div className="bg-white shadow-sm p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowRight size={24} />
        </button>
        <h1 className="text-xl font-bold">למידה חכמה</h1>
        <button onClick={() => navigate('/history')} className="mr-auto text-blue-600 text-sm hover:underline">
          היסטוריה
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${
              msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 shadow-sm rounded-bl-none'
            }`}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
              <p>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm animate-pulse">המורה כותב...</div>}
      </div>

      <div className="bg-white p-4 border-t">
        <div className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="שאל אותי משהו..."
            className="flex-1 border rounded-full px-6 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={sendMessage} className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;