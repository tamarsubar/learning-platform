import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';
import styles from './Subcategories.module.css';

interface SubCategory { id: number; name: string; }
interface Category { id: number; name: string; SubCategories: SubCategory[]; }

const Subcategories: React.FC = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
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
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <button onClick={() => navigate('/categories')} className={styles.linkBtn}>
              {t('Categories', 'קטגוריות', 'الفئات')}
            </button>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{translateName(category.name, lang)}</span>
          </div>
          <div className={styles.navRight}>
            <button onClick={() => navigate('/history')} className={styles.linkBtn}>
              {t('Conversation History', 'היסטוריית שיחות', 'سجل المحادثات')}
            </button>
            <LangToggle />
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div className={styles.content}>
          <div className={styles.inner}>
            <h1 className={styles.title}>{translateName(category.name, lang)}</h1>
            <p className={styles.subtitle}>
              {t('Choose a specific topic to start a conversation', 'בחר נושא ספציפי להתחלת שיחה', 'اختر موضوعاً محدداً لبدء المحادثة')}
            </p>
            <div className={styles.list}>
              {category.SubCategories.map((sub, index) => (
                <div key={sub.id} onClick={() => navigate(`/chat/${sub.id}?categoryId=${categoryId}`)} className={styles.item}>
                  <div className={styles.itemLeft}>
                    <span className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.itemName}>{translateName(sub.name, lang)}</span>
                  </div>
                  <span className={styles.itemArrow}>→</span>
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
