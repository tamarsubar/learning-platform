import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';

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

  const linkBtn: React.CSSProperties = {
    background: 'none', border: 'none', color: '#6060a0',
    cursor: 'pointer', fontSize: '13px', padding: 0,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <button onClick={() => navigate('/categories')} style={linkBtn}
              onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}>
              {t('Categories', 'קטגוריות', 'الفئات')}
            </button>
            <span style={{ color: '#3a3a5a' }}>›</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{t('My History', 'היסטוריה שלי', 'سجلي')}</span>
          </div>

          {/* Right: controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LangToggle />
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div style={{ flex: 1, padding: '60px 80px' }}>
          <h1 style={{ color: 'white', fontSize: '38px', fontWeight: 'bold', marginBottom: '10px' }}>
            {t('Learning History', 'היסטוריית למידה', 'سجل التعلم')}
          </h1>
          <p style={{ color: '#6b7080', fontSize: '15px', marginBottom: '48px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{t('Hello', 'שלום', 'مرحباً')}</span>
            <span><bdi>{user.name}</bdi></span>
            <span>—</span>
            <span>{conversations.length} {t('conversations', 'שיחות', 'محادثات')}</span>
          </p>

          {loading ? (
            <div style={{ color: '#8080a0', textAlign: 'center' }}>{t('Loading...', 'טוען...', 'جاري التحميل...')}</div>
          ) : conversations.length === 0 ? (
            <div style={{ color: '#8080a0', textAlign: 'center', marginTop: '80px', fontSize: '16px' }}>
              {t('No history yet. Start learning!', 'אין היסטוריה עדיין. התחל ללמוד!', 'لا يوجد سجل بعد. ابدأ التعلم!')}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '760px', margin: '0 auto' }}>
              {conversations.map((conv, index) => (
                <div key={conv.subCategoryId} style={{
                  background: '#181a32',
                  border: `1px solid ${expanded === conv.subCategoryId ? '#7c6dfa' : 'rgba(124,109,250,0.2)'}`,
                  borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s',
                }}>
                  <div onClick={() => setExpanded(expanded === conv.subCategoryId ? null : conv.subCategoryId)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: '#7c6dfa', fontSize: '13px', fontWeight: 'bold' }}>{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <p style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 }}>{conv.label}</p>
                        <p style={{ color: '#6b7080', fontSize: '12px', margin: '4px 0 0' }}>
                          {conv.prompts.length} {conv.prompts.length === 1 ? t('question', 'שאלה', 'سؤال') : t('questions', 'שאלות', 'أسئلة')}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ color: '#6b7080', fontSize: '13px' }}>{formatDate(conv.lastDate)}</span>
                      <span style={{ color: '#7c6dfa', fontSize: '12px', transition: 'transform 0.2s', display: 'inline-block', transform: expanded === conv.subCategoryId ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
                    </div>
                  </div>

                  {expanded === conv.subCategoryId && (
                    <div style={{ borderTop: '1px solid rgba(124,109,250,0.15)', padding: '16px 24px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {conv.prompts.map((p, qi) => (
                        <div key={p.id}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                            <div style={{ background: 'linear-gradient(135deg, #7c5cf5, #9b78ff)', borderRadius: '16px 16px 4px 16px', padding: '10px 16px', color: 'white', fontSize: '14px', maxWidth: '85%' }}>
                              {p.prompt}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: 'rgba(124,109,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#7c6dfa', fontWeight: 'bold' }}>AI</div>
                            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px 16px 16px 16px', padding: '10px 16px', color: '#b0b0c8', fontSize: '14px', lineHeight: '1.7', maxWidth: '85%', whiteSpace: 'pre-wrap' }}>
                              {p.response}
                            </div>
                          </div>
                          {qi < conv.prompts.length - 1 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '16px' }} />}
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
