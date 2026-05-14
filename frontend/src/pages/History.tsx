import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';
import styles from './History.module.css';

interface Prompt {
  id: number; prompt: string; response: string;
  created_at: string; category_id: number; sub_category_id: number;
}
interface Conversation {
  subCategoryId: number; categoryId: number; label: string;
  prompts: Prompt[]; lastDate: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { t, lang } = useLanguage();

  useEffect(() => {
    if (!user.id) { navigate('/'); return; }
    Promise.all([
      axios.get(`http://localhost:5000/api/learning/history/${user.id}`),
      axios.get('http://localhost:5000/api/categories'),
    ]).then(([histRes, catRes]) => {
      const catMap: Record<number, string> = {};
      const subMap: Record<number, string> = {};
      catRes.data.forEach((cat: any) => {
        catMap[cat.id] = cat.name;
        cat.SubCategories?.forEach((sub: any) => { subMap[sub.id] = sub.name; });
      });
      const grouped: Record<number, Conversation> = {};
      histRes.data.forEach((p: Prompt) => {
        if (!grouped[p.sub_category_id]) {
          grouped[p.sub_category_id] = {
            subCategoryId: p.sub_category_id, categoryId: p.category_id,
            label: `${translateName(catMap[p.category_id] || '?', lang)} › ${translateName(subMap[p.sub_category_id] || '?', lang)}`,
            prompts: [], lastDate: p.created_at,
          };
        }
        grouped[p.sub_category_id].prompts.push(p);
        if (new Date(p.created_at) > new Date(grouped[p.sub_category_id].lastDate))
          grouped[p.sub_category_id].lastDate = p.created_at;
      });
      setConversations(Object.values(grouped).sort((a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const formatDate = (s: string) => { const d = new Date(s); return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`; };

  return (
    <Layout>
      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <button onClick={() => navigate('/categories')} className={styles.linkBtn}>
              {t('Categories', 'קטגוריות', 'الفئات')}
            </button>
            <span className={styles.breadcrumbSep}>›</span>
            <span className={styles.breadcrumbCurrent}>{t('Conversation History', 'היסטוריית שיחות', 'سجل المحادثات')}</span>
          </div>
          <div className={styles.navRight}>
            <LangToggle />
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>
            {t('Learning History', 'היסטוריית למידה', 'سجل التعلم')}
          </h1>
          <p className={styles.subtitle}>
            <span>{t('Hello', 'שלום', 'مرحباً')}</span>
            <span><bdi>{user.name}</bdi></span>
            <span>—</span>
            <span>{conversations.length} {t('conversations', 'שיחות', 'محادثات')}</span>
          </p>

          {loading ? (
            <div className={styles.empty}>{t('Loading...', 'טוען...', 'جاري التحميل...')}</div>
          ) : conversations.length === 0 ? (
            <div className={styles.empty}>
              {t('No history yet. Start learning!', 'אין היסטוריה עדיין. התחל ללמוד!', 'لا يوجد سجل بعد. ابدأ التعلم!')}
            </div>
          ) : (
            <div className={styles.list}>
              {conversations.map((conv, index) => (
                <div
                  key={conv.subCategoryId}
                  className={`${styles.card} ${expanded === conv.subCategoryId ? styles.cardExpanded : ''}`}
                >
                  <div
                    className={styles.cardHeader}
                    onClick={() => setExpanded(expanded === conv.subCategoryId ? null : conv.subCategoryId)}
                  >
                    <div className={styles.cardHeaderLeft}>
                      <span className={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p className={styles.cardLabel}>{conv.label}</p>
                        <p className={styles.cardCount}>
                          {conv.prompts.length} {conv.prompts.length === 1 ? t('question', 'שאלה', 'سؤال') : t('questions', 'שאלות', 'أسئلة')}
                        </p>
                      </div>
                    </div>
                    <div className={styles.cardHeaderRight}>
                      <span className={styles.cardDate}>{formatDate(conv.lastDate)}</span>
                      <span
                        className={styles.cardChevron}
                        style={{ transform: expanded === conv.subCategoryId ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >▲</span>
                    </div>
                  </div>

                  {expanded === conv.subCategoryId && (
                    <div className={styles.cardBody}>
                      {conv.prompts.map((p, qi) => (
                        <div key={p.id}>
                          <div className={styles.userBubble}>
                            <div className={styles.userMsg}>{p.prompt}</div>
                          </div>
                          <div className={styles.aiBubble}>
                            <div className={styles.aiAvatar}>AI</div>
                            <div className={styles.aiMsg}>{p.response}</div>
                          </div>
                          {qi < conv.prompts.length - 1 && <div className={styles.divider} />}
                        </div>
                      ))}
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
