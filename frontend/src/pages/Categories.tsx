import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';

interface Category { id: number; name: string; }

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { t, lang } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer',
    fontSize: '13px', padding: 0,
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, Arial, sans-serif' }}>
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,12,30,0.7)',
        }}>
          {/* Left: breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Robot size={32} />
            <span style={{ color: '#3a3a5a' }}>›</span>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>
              {t('Categories', 'קטגוריות', 'الفئات')}
            </span>
          </div>

          {/* Right: controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => navigate('/history')} style={linkBtn}
              onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}>
              {t('My History', 'היסטוריה', 'سجلي')}
            </button>
            <LangToggle />
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div className="categories-content">
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', marginBottom: '10px' }}>
            {t('What do you want to learn?', 'מה תרצה ללמוד?', 'ماذا تريد أن تتعلم؟')}
          </h1>
          <p style={{ color: '#6b7080', fontSize: '15px', marginBottom: '52px' }}>
            {t("Choose a subject and we'll go from there", 'בחר תחום ונמשיך משם', 'اختر موضوعاً وسنكمل من هناك')}
          </p>

          {loading ? (
            <div style={{ color: '#8080a0', textAlign: 'center' }}>{t('Loading...', 'טוען...', 'جاري التحميل...')}</div>
          ) : (
            <div className="categories-grid">
              {categories.map(cat => (
                <div key={cat.id} onClick={() => navigate(`/categories/${cat.id}`)}
                  onMouseEnter={() => setHoveredId(cat.id)} onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: hoveredId === cat.id ? '#22284a' : '#1c2035',
                    border: `1px solid ${hoveredId === cat.id ? '#7c6dfa' : 'rgba(124,109,250,0.2)'}`,
                    borderRadius: '14px', padding: '42px 28px', cursor: 'pointer',
                    transition: 'border-color 0.2s, background 0.2s',
                  }}>
                  <div style={{ fontWeight: 'bold', color: 'white', fontSize: '18px', marginBottom: '10px' }}>
                    {translateName(cat.name, lang)}
                  </div>
                  <div style={{ color: '#7c6dfa', fontSize: '13px' }}>
                    {t('→ View topics', '← הצג נושאים', '← عرض المواضيع')}
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
