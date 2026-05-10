import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';

const Chat: React.FC = () => {
  const { subId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: 'שלום! אני הרובוט החכם שלך. מה תרצי ללמוד היום?' }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/learning/chat', {
        subCategoryId: subId, categoryId, userId: user.id, message: input,
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
    <Layout>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Assistant, Arial, sans-serif' }} dir="rtl">

        {/* Navbar */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,12,30,0.7)',
          flexShrink: 0,
        }}>
          {/* Right (RTL start): title + back + history */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>שיחה עם הרובוט</span>
            <span style={{ color: '#444' }}>|</span>
            <button
              onClick={() => navigate(-1)}
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '14px' }}
            >
              חזרה
            </button>
            <span style={{ color: '#444' }}>|</span>
            <button
              onClick={() => navigate('/history')}
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '14px' }}
            >
              היסטוריית שיחות
            </button>
          </div>

          {/* Left (RTL end): robot */}
          <Robot size={36} />
        </nav>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          {messages.map((msg, i) =>
            msg.role === 'assistant' ? (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px', direction: 'ltr' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px 16px 16px 4px',
                  padding: '16px 20px',
                  color: 'white',
                  maxWidth: '420px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  direction: 'rtl',
                  textAlign: 'right',
                }}>
                  {msg.content}
                </div>
                <Robot size={48} />
              </div>
            ) : (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
                  borderRadius: '16px 16px 4px 16px',
                  padding: '16px 20px',
                  color: 'white',
                  maxWidth: '420px',
                  fontSize: '15px',
                  lineHeight: '1.6',
                  textAlign: 'right',
                }}>
                  {msg.content}
                </div>
              </div>
            )
          )}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c6dfa', fontSize: '14px', direction: 'ltr' }}>
              <Robot size={36} />
              <span>כותב...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px 28px 32px',
          background: 'rgba(0,0,0,0.3)',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', maxWidth: '860px' }}>
          {/* Input (RTL first = right) */}
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="שאלי את הרובוט..."
            style={{
              flex: 1,
              padding: '14px 20px',
              background: '#0f0f2a',
              border: '1px solid rgba(124,109,250,0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '15px',
              outline: 'none',
              direction: 'rtl',
              textAlign: 'right',
            }}
          />
          {/* Button (RTL second = left) */}
          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '14px 28px',
              background: loading ? '#444' : 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            שלחי
          </button>
        </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
