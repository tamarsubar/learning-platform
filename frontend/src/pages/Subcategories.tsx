import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';

interface SubCategory { id: number; name: string; }
interface Category { id: number; name: string; SubCategories: SubCategory[]; }

const Subcategories: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { t, lang } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => {
        const found = res.data.find((c: Category) => c.id === Number(categoryId));
        setCategory(found || null);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [categoryId]);

  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#6060a0',
    cursor: 'pointer', fontSize: '13px', padding: 0,
  };

  if (loading) return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8080a0' }}>
        {t('Loading...', 'טוען...', 'جاري التحميل...')}
      </div>
    </Layout>
  );

  if (!category) return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8080a0' }}>
        {t('Category not found', 'קטגוריה לא נמצאה', 'الفئة غير موجودة')}
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, Arial, sans-serif' }}>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,12,30,0.7)',
        }}>
          {/* Left: breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <button onClick={() => navigate('/categories')} style={linkBtn}
              onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}>
              {t('Categories', 'קטגוריות', 'الفئات')}
            </button>
            <span style={{ color: '#3a3a5a' }}>›</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{translateName(category.name, lang)}</span>
          </div>

          {/* Right: controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LangToggle />
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div style={{ flex: 1, padding: '60px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '720px' }}>
            <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', marginBottom: '10px' }}>
              {translateName(category.name, lang)}
            </h1>
            <p style={{ color: '#6b7080', fontSize: '15px', marginBottom: '48px' }}>
              {t('Choose a specific topic to start a conversation', 'בחר נושא ספציפי להתחלת שיחה', 'اختر موضوعاً محدداً لبدء المحادثة')}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {category.SubCategories.map((sub, index) => (
                <div key={sub.id} onClick={() => navigate(`/chat/${sub.id}?categoryId=${categoryId}`)}
                  onMouseEnter={() => setHoveredId(sub.id)} onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 28px',
                    background: hoveredId === sub.id ? '#1e2245' : '#181a32',
                    border: `1px solid ${hoveredId === sub.id ? '#7c6dfa' : 'rgba(124,109,250,0.15)'}`,
                    borderRadius: '12px', cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ color: '#7c6dfa', fontSize: '13px', fontWeight: 'bold' }}>{String(index + 1).padStart(2, '0')}</span>
                    <span style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>{translateName(sub.name, lang)}</span>
                  </div>
                  <span style={{ color: '#7c6dfa', fontSize: '16px' }}>→</span>
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
