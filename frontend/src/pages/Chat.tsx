import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';


interface Message {
  id: number;
  role: string;
  content: string;
}

interface SessionMeta {
  sessionId: string;
  subCategoryId: number;
  categoryId: number;
  label: string;
  messageCount: number;
  lastDate: string;
}

const TypingMessage: React.FC<{ content: string; onDone: () => void }> = ({ content, onDone }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(content.slice(0, i));
      if (i >= content.length) { clearInterval(timer); onDone(); }
    }, 12);
    return () => clearInterval(timer);
  }, []);
  return <>{displayed}</>;
};

const Chat: React.FC = () => {
  const { subId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const { t, lang } = useLanguage();
  const msgCounter = useRef(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [animatingId, setAnimatingId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [topicLabel, setTopicLabel] = useState('');
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [activeSessionId, setActiveSessionId] = useState('');
  const [activeSubId, setActiveSubId] = useState(subId || '');
  const [activeCategoryId, setActiveCategoryId] = useState(categoryId || '');
  const [activeLabel, setActiveLabel] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Start new session on mount
  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setActiveSessionId(newSessionId);
    const id = ++msgCounter.current;
    setMessages([{ id, role: 'assistant', content: t("Hello! I'm your AI learning assistant. What would you like to learn today?", 'שלום! אני הרובוט החכם שלך. מה תרצה ללמוד היום?', 'مرحباً! أنا مساعدك التعليمي الذكي. ماذا تريد أن تتعلم اليوم؟') }]);
    setAnimatingId(id);
  }, []);

  // Load topic label + past sessions
  useEffect(() => {
    if (!user.id) return;
    Promise.all([
      axios.get('http://localhost:5000/api/categories'),
      axios.get(`http://localhost:5000/api/learning/history/${user.id}`),
    ]).then(([catRes, histRes]) => {
      const catMap: Record<number, string> = {};
      const subMap: Record<number, string> = {};
      catRes.data.forEach((cat: any) => {
        catMap[cat.id] = cat.name;
        cat.SubCategories?.forEach((sub: any) => { subMap[sub.id] = sub.name; });
      });

      const catName = catMap[Number(categoryId)];
      const subName = subMap[Number(subId)];
      if (catName && subName) {
        const label = `${translateName(catName, lang)} › ${translateName(subName, lang)}`;
        setTopicLabel(label);
        setActiveLabel(label);
      }

      // Group history by session_id (or fallback to sub_category_id for old prompts)
      const grouped: Record<string, SessionMeta> = {};
      histRes.data.forEach((p: any) => {
        const sid = p.session_id || `legacy_${p.sub_category_id}`;
        if (!grouped[sid]) {
          grouped[sid] = {
            sessionId: sid,
            subCategoryId: p.sub_category_id,
            categoryId: p.category_id,
            label: `${translateName(catMap[p.category_id] || '?', lang)} › ${translateName(subMap[p.sub_category_id] || '?', lang)}`,
            messageCount: 0,
            lastDate: p.created_at,
          };
        }
        grouped[sid].messageCount++;
        if (new Date(p.created_at) > new Date(grouped[sid].lastDate)) {
          grouped[sid].lastDate = p.created_at;
        }
      });

      setSessions(
        Object.values(grouped).sort(
          (a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime()
        )
      );
    }).catch(console.error);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadSession = async (session: SessionMeta) => {
    try {
      const endpoint = session.sessionId.startsWith('legacy_')
        ? `http://localhost:5000/api/learning/history/${user.id}`
        : `http://localhost:5000/api/learning/session/${session.sessionId}`;

      let prompts: any[];
      if (session.sessionId.startsWith('legacy_')) {
        const res = await axios.get(endpoint);
        prompts = res.data
          .filter((p: any) => p.sub_category_id === session.subCategoryId && !p.session_id)
          .reverse();
      } else {
        const res = await axios.get(endpoint);
        prompts = res.data;
      }

      const loaded: Message[] = [
        { id: ++msgCounter.current, role: 'assistant', content: t("Hello! I'm your AI learning assistant. What would you like to learn today?", 'שלום! אני הרובוט החכם שלך. מה תרצה ללמוד היום?', 'مرحباً! أنا مساعدك التعليمي الذكي. ماذا تريد أن تتعلم اليوم؟') },
      ];
      prompts.forEach((p: any) => {
        loaded.push({ id: ++msgCounter.current, role: 'user', content: p.prompt });
        loaded.push({ id: ++msgCounter.current, role: 'assistant', content: p.response });
      });

      setMessages(loaded);
      setAnimatingId(null);
      setActiveSessionId(session.sessionId);
      setActiveSubId(String(session.subCategoryId));
      setActiveCategoryId(String(session.categoryId));
      setActiveLabel(session.label);
      setTopicLabel(session.label);
      setInput('');
    } catch (err) {
      console.error(err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: ++msgCounter.current, role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/learning/chat', {
        subCategoryId: activeSubId,
        categoryId: activeCategoryId,
        userId: user.id,
        message: input,
        session_id: activeSessionId,
      });
      const aiId = ++msgCounter.current;
      setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: response.data.answer }]);
      setAnimatingId(aiId);

      setSessions(prev => {
        const exists = prev.find(s => s.sessionId === activeSessionId);
        if (exists) {
          return prev.map(s => s.sessionId === activeSessionId
            ? { ...s, messageCount: s.messageCount + 1, lastDate: new Date().toISOString() }
            : s
          );
        }
        return [{
          sessionId: activeSessionId,
          subCategoryId: Number(activeSubId),
          categoryId: Number(activeCategoryId),
          label: activeLabel,
          messageCount: 1,
          lastDate: new Date().toISOString(),
        }, ...prev];
      });
    } catch (error) {
      console.error(error);
      const errId = ++msgCounter.current;
      setMessages(prev => [...prev, { id: errId, role: 'assistant', content: t('Sorry, there was an error connecting to AI.', 'מצטער, הייתה שגיאה בחיבור ל-AI.', 'عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي.') }]);
      setAnimatingId(errId);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return t('Today', 'היום', 'اليوم');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return t('Yesterday', 'אמש', 'أمس');
    return `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()}`;
  };

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#0b0c1e', fontFamily: 'Inter, Arial, sans-serif', overflow: 'hidden' }}>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          width: '260px', flexShrink: 0,
          background: '#0d0e24',
          borderRight: '1px solid rgba(124,109,250,0.15)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}>
          {/* New Chat button */}
          <div style={{ padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button
              onClick={() => navigate('/categories')}
              style={{
                width: '100%', padding: '10px 14px',
                background: 'rgba(124,109,250,0.15)',
                border: '1px solid rgba(124,109,250,0.35)',
                borderRadius: '8px', color: 'white',
                fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(124,109,250,0.25)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(124,109,250,0.15)')}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> {t('New Chat', 'שיחה חדשה', 'محادثة جديدة')}
            </button>
          </div>

          {/* Sessions list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {sessions.length === 0 ? (
              <p style={{ color: '#3a3a5a', fontSize: '13px', textAlign: 'center', marginTop: '32px' }}>
                {t('No past conversations', 'אין שיחות קודמות', 'لا توجد محادثات سابقة')}
              </p>
            ) : (
              <>
                <p style={{ color: '#3a3a5a', fontSize: '10px', fontWeight: '700', letterSpacing: '0.8px', padding: '8px 8px 6px', textTransform: 'uppercase' }}>
                  {t('Recent', 'אחרון', 'الأخيرة')}
                </p>
                {sessions.map(session => {
                  const isActive = activeSessionId === session.sessionId;
                  return (
                    <div
                      key={session.sessionId}
                      onClick={() => loadSession(session)}
                      style={{
                        padding: '9px 12px', borderRadius: '8px', cursor: 'pointer',
                        background: isActive ? 'rgba(124,109,250,0.18)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(124,109,250,0.35)' : 'transparent'}`,
                        marginBottom: '2px', transition: 'background 0.15s, border-color 0.15s',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                    >
                      <p style={{ color: isActive ? 'white' : '#b0b0c8', fontSize: '13px', fontWeight: isActive ? '600' : '400', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {session.label}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3px' }}>
                        <span style={{ color: '#3a3a5a', fontSize: '11px' }}>{session.messageCount} {t('msgs', 'הודעות', 'رسائل')}</span>
                        <span style={{ color: '#3a3a5a', fontSize: '11px' }}>{formatDate(session.lastDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* User badge */}
          <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Navbar */}
        <nav style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '11px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          background: 'rgba(11,12,30,0.85)',
          flexShrink: 0,
        }}>
          {/* Left: sidebar toggle + breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <button
              onClick={() => setSidebarOpen(p => !p)}
              title="Toggle sidebar"
              style={{ background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '0 4px', flexShrink: 0 }}
            >
              ☰
            </button>
            {topicLabel && (() => {
              const parts = topicLabel.split(' › ');
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', overflow: 'hidden' }}>
                  <button
                    onClick={() => navigate('/categories')}
                    style={{ background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer', fontSize: '13px', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}
                  >
                    {t('Categories', 'קטגוריות', 'الفئات')}
                  </button>
                  <span style={{ color: '#3a3a5a' }}>›</span>
                  {parts.length > 1 ? (
                    <>
                      <button
                        onClick={() => navigate(`/categories/${activeCategoryId}`)}
                        style={{ background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer', fontSize: '13px', padding: 0, whiteSpace: 'nowrap', flexShrink: 0 }}
                        onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
                        onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}
                      >
                        {parts[0]}
                      </button>
                      <span style={{ color: '#3a3a5a' }}>›</span>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {parts[1]}
                      </span>
                    </>
                  ) : (
                    <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>{parts[0]}</span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right: history + lang + robot */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
            <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: '#6060a0', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6060a0')}
            >
              {t('History', 'היסטוריה', 'السجل')}
            </button>
            <LangToggle />
            <Robot size={32} />
          </div>
        </nav>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 40px' }}>
          {messages.map(msg =>
            msg.role === 'assistant' ? (
              <div key={msg.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                <Robot size={40} />
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '4px 16px 16px 16px',
                  padding: '14px 18px',
                  color: 'white', maxWidth: '540px', fontSize: '15px', lineHeight: '1.65', whiteSpace: 'pre-wrap',
                }}>
                  {animatingId === msg.id
                    ? <TypingMessage content={msg.content} onDone={() => setAnimatingId(null)} />
                    : msg.content}
                </div>
              </div>
            ) : (
              <div key={msg.id} style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
                  borderRadius: '16px 16px 4px 16px',
                  padding: '14px 18px',
                  color: 'white', maxWidth: '540px', fontSize: '15px', lineHeight: '1.65',
                }}>
                  {msg.content}
                </div>
              </div>
            )
          )}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#7c6dfa', fontSize: '14px' }}>
              <Robot size={34} />
              <span>{t('Typing...', 'כותב...', 'يكتب...')}</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div style={{ padding: '14px 24px 24px', background: 'rgba(0,0,0,0.25)', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: '10px', maxWidth: '820px', margin: '0 auto' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t('Ask the robot...', 'שאל את הרובוט...', 'اسأل الروبوت...')}
              style={{
                flex: 1, padding: '13px 18px',
                background: '#0f0f2a',
                border: '1px solid rgba(124,109,250,0.2)',
                borderRadius: '10px', color: 'white', fontSize: '15px', outline: 'none',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: '13px 26px',
                background: loading ? '#333' : 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
                border: 'none', borderRadius: '10px',
                color: 'white', fontSize: '15px', fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {t('Send', 'שלח', 'أرسل')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
