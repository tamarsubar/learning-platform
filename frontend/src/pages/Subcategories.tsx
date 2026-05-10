import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';

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
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => {
        const found = res.data.find((c: Category) => c.id === Number(categoryId));
        setCategory(found || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  if (loading) return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8080a0' }}>
        טוען...
      </div>
    </Layout>
  );

  if (!category) return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8080a0' }}>
        קטגוריה לא נמצאה
      </div>
    </Layout>
  );

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
          {/* Right (RTL start): breadcrumb - קטגוריות ← category */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <button
              onClick={() => navigate('/categories')}
              style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '14px' }}
            >
              קטגוריות
            </button>
            <span style={{ color: '#444' }}>/</span>
            <span style={{ color: '#7c6dfa', fontWeight: 'bold' }}>{category.name}</span>
          </div>

          {/* Left (RTL end): robot icon */}
          <Robot size={36} />
        </nav>

        {/* Content */}
        <div style={{ flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '720px' }}>
            <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', textAlign: 'right', marginBottom: '10px' }}>
              {category.name}
            </h1>
            <p style={{ color: '#6b7080', fontSize: '15px', textAlign: 'right', marginBottom: '48px' }}>
              בחרי נושא ספציפי להתחלת שיחה
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.SubCategories.map((sub, index) => (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/chat/${sub.id}?categoryId=${categoryId}`)}
                  onMouseEnter={() => setHoveredId(sub.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 28px',
                    background: hoveredId === sub.id ? '#1e2245' : '#181a32',
                    border: `1px solid ${hoveredId === sub.id ? '#7c6dfa' : 'rgba(124,109,250,0.15)'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                >
                  {/* Right (RTL start): name */}
                  <span style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>
                    {sub.name}
                  </span>

                  {/* Left (RTL end): number + arrow */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ color: '#7c6dfa', fontSize: '13px', fontWeight: 'bold' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: '#7c6dfa', fontSize: '16px' }}>←</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Subcategories;
