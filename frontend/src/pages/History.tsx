import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';

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
  const [expanded, setExpanded] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!user.id) { navigate('/'); return; }
    axios.get(`http://localhost:5000/api/learning/history/${user.id}`)
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Assistant, Arial, sans-serif' }} dir="rtl">

        {/* Navbar */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 28px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,12,30,0.7)',
        }}>
          {/* Right (RTL start): breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <span style={{ color: '#7c6dfa', fontWeight: 'bold' }}>היסטוריית שיחות</span>
            <span style={{ color: '#444' }}>|</span>
            <button
              onClick={() => navigate('/categories')}
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '14px' }}
            >
              קטגוריות
            </button>
          </div>

          {/* Left (RTL end): robot */}
          <Robot size={36} />
        </nav>

        {/* Content */}
        <div style={{ flex: 1, padding: '60px 80px' }}>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', textAlign: 'right', marginBottom: '10px' }}>
            היסטוריית שיחות
          </h1>
          <p style={{ color: '#6b7080', fontSize: '15px', textAlign: 'right', marginBottom: '48px' }}>
            שלום {user.name} — {history.length} שיחות שמורות
          </p>

          {loading ? (
            <div style={{ color: '#8080a0', textAlign: 'center' }}>טוען...</div>
          ) : history.length === 0 ? (
            <div style={{ color: '#8080a0', textAlign: 'center', marginTop: '80px', fontSize: '16px' }}>
              אין היסטוריה עדיין. התחילי ללמוד!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '760px', margin: '0 auto' }}>
              {history.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    background: '#181a32',
                    border: `1px solid ${expanded === item.id ? '#7c6dfa' : 'rgba(124,109,250,0.2)'}`,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {/* Header row */}
                  <div
                    onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '20px 24px',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Right: number + question */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: '#7c6dfa', fontSize: '13px', fontWeight: 'bold' }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span style={{ color: 'white', fontSize: '15px', fontWeight: '500' }}>
                        {item.prompt}
                      </span>
                    </div>

                    {/* Left: triangle + date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: '#6b7080', fontSize: '13px' }}>
                        {formatDate(item.created_at)}
                      </span>
                      <span style={{
                        color: '#7c6dfa',
                        fontSize: '12px',
                        transition: 'transform 0.2s',
                        display: 'inline-block',
                        transform: expanded === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}>
                        ▲
                      </span>
                    </div>
                  </div>

                  {/* Expanded answer */}
                  {expanded === item.id && (
                    <div style={{
                      padding: '16px 24px 22px',
                      borderTop: '1px solid rgba(124,109,250,0.15)',
                      color: '#b0b0c8',
                      fontSize: '14px',
                      lineHeight: '1.7',
                      textAlign: 'right',
                    }}>
                      {item.response}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
