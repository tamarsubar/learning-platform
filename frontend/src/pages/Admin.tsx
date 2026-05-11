import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';

interface Prompt { id: number; prompt: string; response: string; created_at: string; }
interface User { id: number; name: string; phone: string; Prompts?: Prompt[]; }

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const { t } = useLanguage();

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalPrompts = users.reduce((acc, u) => acc + (u.Prompts?.length || 0), 0);
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
            <span style={{ color: 'white', fontWeight: '600' }}>{t('Admin', 'ניהול', 'الإدارة')}</span>
          </div>

          {/* Right: controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <LangToggle />
            <UserMenu user={currentUser} onSwitch={() => { localStorage.removeItem('user'); navigate('/'); }} />
          </div>
        </nav>

        <div style={{ flex: 1, padding: '48px 60px' }}>
          <h1 style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            {t('User Management', 'ניהול משתמשים', 'إدارة المستخدمين')}
          </h1>
          <p style={{ color: '#6b7080', fontSize: '15px', marginBottom: '40px' }}>
            {t('All users and their conversation history', 'רשימת כל המשתמשים והיסטוריית השיחות שלהם', 'جميع المستخدمين وسجل محادثاتهم')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', maxWidth: '500px', marginBottom: '40px' }}>
            <div style={{ background: '#1c2035', border: '1px solid rgba(124,109,250,0.2)', borderRadius: '14px', padding: '20px 24px' }}>
              <p style={{ color: '#8080a0', fontSize: '13px', marginBottom: '6px' }}>{t('Total Users', 'סה"כ משתמשים', 'إجمالي المستخدمين')}</p>
              <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{users.length}</p>
            </div>
            <div style={{ background: '#1c2035', border: '1px solid rgba(124,109,250,0.2)', borderRadius: '14px', padding: '20px 24px' }}>
              <p style={{ color: '#8080a0', fontSize: '13px', marginBottom: '6px' }}>{t('Total Conversations', 'סה"כ שיחות', 'إجمالي المحادثات')}</p>
              <p style={{ color: 'white', fontSize: '28px', fontWeight: 'bold' }}>{totalPrompts}</p>
            </div>
          </div>

          {loading ? (
            <div style={{ color: '#8080a0', textAlign: 'center' }}>{t('Loading...', 'טוען...', 'جاري التحميل...')}</div>
          ) : users.length === 0 ? (
            <div style={{ color: '#8080a0', textAlign: 'center', marginTop: '60px' }}>{t('No users yet', 'אין משתמשים עדיין', 'لا يوجد مستخدمون بعد')}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '900px' }}>
              {users.map(user => (
                <div key={user.id} style={{ background: '#181a32', border: `1px solid ${expandedUser === user.id ? '#7c6dfa' : 'rgba(124,109,250,0.2)'}`, borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <div onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #7c5cf5, #9b78ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px', flexShrink: 0 }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p style={{ color: 'white', fontWeight: 'bold', fontSize: '15px', marginBottom: '2px' }}>{user.name}</p>
                        <p style={{ color: '#8080a0', fontSize: '13px' }}>{user.phone}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ color: '#7c6dfa', fontSize: '13px' }}>{user.Prompts?.length || 0} {t('conversations', 'שיחות', 'محادثات')}</span>
                      <span style={{ color: '#7c6dfa', fontSize: '12px', transition: 'transform 0.2s', display: 'inline-block', transform: expandedUser === user.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>▲</span>
                    </div>
                  </div>
                  {expandedUser === user.id && (
                    <div style={{ borderTop: '1px solid rgba(124,109,250,0.15)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {!user.Prompts?.length ? (
                        <p style={{ color: '#8080a0', textAlign: 'center', fontSize: '14px' }}>{t('No history for this user', 'אין היסטוריה למשתמש זה', 'لا يوجد سجل لهذا المستخدم')}</p>
                      ) : (
                        user.Prompts.map(p => (
                          <div key={p.id} style={{ background: '#1c2035', borderRadius: '10px', padding: '14px 18px', border: '1px solid rgba(124,109,250,0.1)' }}>
                            <p style={{ color: '#6b7080', fontSize: '12px', marginBottom: '6px' }}>{formatDate(p.created_at)}</p>
                            <p style={{ color: 'white', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>{p.prompt}</p>
                            <p style={{ color: '#9090b0', fontSize: '13px', lineHeight: '1.6' }}>{p.response}</p>
                          </div>
                        ))
                      )}
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

export default Admin;
