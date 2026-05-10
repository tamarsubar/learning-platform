import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';

interface Category {
  id: number;
  name: string;
}

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
          {/* Right (RTL start): user name + history link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              padding: '6px 16px', background: '#1c2035',
              borderRadius: '20px', color: 'white',
              fontSize: '14px', fontWeight: 'bold',
            }}>
              {user.name || 'משתמש'}
            </div>
            <button
              onClick={() => navigate('/history')}
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '14px' }}
            >
              היסטוריית שיחות
            </button>
          </div>

          {/* Left (RTL end): branding + robot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#7c6dfa', fontWeight: 'bold', letterSpacing: '1px', fontSize: '13px' }}>
              LEARNING PLATFORM
            </span>
            <Robot size={36} />
          </div>
        </nav>

        {/* Content */}
        <div className="categories-content">
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', textAlign: 'right', marginBottom: '10px' }}>
            מה תרצי ללמוד?
          </h1>
          <p style={{ color: '#6b7080', fontSize: '15px', textAlign: 'right', marginBottom: '52px' }}>
            בחרי תחום ונמשיך משם
          </p>

          {loading ? (
            <div style={{ color: '#8080a0', textAlign: 'center' }}>טוען...</div>
          ) : (
            <div className="categories-grid">
              {categories.map(cat => (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/categories/${cat.id}`)}
                  onMouseEnter={() => setHoveredId(cat.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: hoveredId === cat.id ? '#22284a' : '#1c2035',
                    border: `1px solid ${hoveredId === cat.id ? '#7c6dfa' : 'rgba(124,109,250,0.2)'}`,
                    borderRadius: '14px',
                    padding: '42px 28px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  <div style={{ textAlign: 'right', fontWeight: 'bold', color: 'white', fontSize: '18px', marginBottom: '10px' }}>
                    {cat.name}
                  </div>
                  <div style={{ textAlign: 'right', color: '#7c6dfa', fontSize: '13px' }}>
                    ← לחצי להצגת נושאים
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Layout>
  );
};

export default Categories;
