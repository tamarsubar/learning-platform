import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';
import styles from './Categories.module.css';

interface Category { id: number; name: string; }

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { t, lang } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <Robot size={32} />
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{t('Categories', 'קטגוריות', 'الفئات')}</span>
          </div>
          <div className={styles.navRight}>
            <button onClick={() => navigate('/history')} className={styles.linkBtn}>
              {t('Conversation History', 'היסטוריית שיחות', 'سجل المحادثات')}
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
                <div key={cat.id} onClick={() => navigate(`/categories/${cat.id}`)} className={styles.card}>
                  <div className={styles.cardTitle}>{translateName(cat.name, lang)}</div>
                  <div className={styles.cardLink}>{t('→ View topics', '← הצג נושאים', '← عرض المواضيع')}</div>
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
