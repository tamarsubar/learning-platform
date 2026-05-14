import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Robot from '../components/Robot';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import { translateName } from '../utils/categoryTranslations';
import styles from './Chat.module.css';


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

  useEffect(() => {
    const newSessionId = crypto.randomUUID();
    setActiveSessionId(newSessionId);
    const id = ++msgCounter.current;
    setMessages([{ id, role: 'assistant', content: t("Hello! I'm your AI learning assistant. What would you like to learn today?", 'שלום! אני הרובוט החכם שלך. מה תרצה ללמוד היום?', 'مرحباً! أنا مساعدك التعليمي الذكي. ماذا تريد أن تتعلم اليوم؟') }]);
    setAnimatingId(id);
  }, []);

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
    <div className={styles.page}>

      {/* Sidebar */}
      {sidebarOpen && (
        <div className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <button onClick={() => navigate('/categories')} className={styles.newChatBtn}>
              <span className={styles.newChatPlus}>+</span>
              {t('New Chat', 'שיחה חדשה', 'محادثة جديدة')}
            </button>
          </div>

          <div className={styles.sessionsList}>
            {sessions.length === 0 ? (
              <p className={styles.sessionsEmpty}>
                {t('No past conversations', 'אין שיחות קודמות', 'لا توجد محادثات سابقة')}
              </p>
            ) : (
              <>
                <p className={styles.sessionsLabel}>
                  {t('Recent', 'אחרון', 'الأخيرة')}
                </p>
                {sessions.map(session => {
                  const isActive = activeSessionId === session.sessionId;
                  return (
                    <div
                      key={session.sessionId}
                      onClick={() => loadSession(session)}
                      className={`${styles.sessionItem} ${isActive ? styles.sessionItemActive : ''}`}
                    >
                      <p className={`${styles.sessionLabel} ${isActive ? styles.sessionLabelActive : ''}`}>
                        {session.label}
                      </p>
                      <div className={styles.sessionMeta}>
                        <span className={styles.sessionMetaText}>{session.messageCount} {t('msgs', 'הודעות', 'رسائل')}</span>
                        <span className={styles.sessionMetaText}>{formatDate(session.lastDate)}</span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className={styles.sidebarFooter}>
            <UserMenu user={user} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </div>
      )}

      {/* Main chat area */}
      <div className={styles.main}>

        {/* Navbar */}
        <nav className={styles.nav}>
          <div className={styles.navLeft}>
            <button onClick={() => setSidebarOpen(p => !p)} title="Toggle sidebar" className={styles.toggleBtn}>
              ☰
            </button>
            {topicLabel && (() => {
              const parts = topicLabel.split(' › ');
              return (
                <div className={styles.breadcrumb}>
                  <button onClick={() => navigate('/categories')} className={styles.breadcrumbBtn}>
                    {t('Categories', 'קטגוריות', 'الفئات')}
                  </button>
                  <span className={styles.breadcrumbSep}>›</span>
                  {parts.length > 1 ? (
                    <>
                      <button onClick={() => navigate(`/categories/${activeCategoryId}`)} className={styles.breadcrumbBtn}>
                        {parts[0]}
                      </button>
                      <span className={styles.breadcrumbSep}>›</span>
                      <span className={styles.breadcrumbCurrent}>{parts[1]}</span>
                    </>
                  ) : (
                    <span className={styles.breadcrumbCurrent}>{parts[0]}</span>
                  )}
                </div>
              );
            })()}
          </div>

          <div className={styles.navRight}>
            <button onClick={() => navigate('/history')} className={styles.historyBtn}>
              {t('Conversation History', 'היסטוריית שיחות', 'سجل المحادثات')}
            </button>
            <LangToggle />
            <Robot size={32} />
          </div>
        </nav>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.map(msg =>
            msg.role === 'assistant' ? (
              <div key={msg.id} className={styles.aiRow}>
                <Robot size={40} />
                <div className={styles.aiBubble}>
                  {animatingId === msg.id
                    ? <TypingMessage content={msg.content} onDone={() => setAnimatingId(null)} />
                    : msg.content}
                </div>
              </div>
            ) : (
              <div key={msg.id} className={styles.userRow}>
                <div className={styles.userBubble}>{msg.content}</div>
              </div>
            )
          )}
          {loading && (
            <div className={styles.typingRow}>
              <Robot size={34} />
              <span>{t('Typing...', 'כותב...', 'يكتب...')}</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        <div className={styles.inputBar}>
          <div className={styles.inputRow}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder={t('Ask the robot...', 'שאל את הרובוט...', 'اسأل الروبوت...')}
              className={styles.textInput}
            />
            <button onClick={sendMessage} disabled={loading} className={styles.sendBtn}>
              {t('Send', 'שלח', 'أرسل')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
