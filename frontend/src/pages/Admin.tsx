import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import LangToggle from '../components/LangToggle';
import UserMenu from '../components/UserMenu';
import { useLanguage } from '../context/LanguageContext';
import styles from './Admin.module.css';

interface Prompt { id: number; prompt: string; response: string; created_at: string; }
interface User { id: number; name: string; phone: string; Prompts?: Prompt[]; }

const ADMIN_KEY = 'admin_auth';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [authed] = useState(() => sessionStorage.getItem(ADMIN_KEY) === 'true');
  const currentUser = { name: 'מנהל' };
  const { t } = useLanguage();

  useEffect(() => {
    if (!authed) { navigate('/'); return; }
    axios.get(`http://localhost:5000/api/admin/users?password=${sessionStorage.getItem(ADMIN_KEY + '_pw')}`)
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [authed]);

  if (!authed) return null;

  const totalPrompts = users.reduce((acc, u) => acc + (u.Prompts?.length || 0), 0);
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
            <span className={styles.breadcrumbCurrent}>{t('Admin', 'ניהול', 'الإدارة')}</span>
          </div>
          <div className={styles.navRight}>
            <LangToggle />
            <UserMenu user={currentUser} onSwitch={() => { sessionStorage.removeItem(ADMIN_KEY); sessionStorage.removeItem(ADMIN_KEY + '_pw'); navigate('/'); }} />
          </div>
        </nav>

        <div className={styles.content}>
          <h1 className={styles.title}>
            {t('User Management', 'ניהול משתמשים', 'إدارة المستخدمين')}
          </h1>
          <p className={styles.subtitle}>
            {t('All users and their conversation history', 'רשימת כל המשתמשים והיסטוריית השיחות שלהם', 'جميع المستخدمين وسجل محادثاتهم')}
          </p>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>{t('Total Users', 'סה"כ משתמשים', 'إجمالي المستخدمين')}</p>
              <p className={styles.statValue}>{users.length}</p>
            </div>
            <div className={styles.statCard}>
              <p className={styles.statLabel}>{t('Total Conversations', 'סה"כ שיחות', 'إجمالي المحادثات')}</p>
              <p className={styles.statValue}>{totalPrompts}</p>
            </div>
          </div>

          {loading ? (
            <div className={styles.noHistory}>{t('Loading...', 'טוען...', 'جاري التحميل...')}</div>
          ) : users.length === 0 ? (
            <div className={styles.noHistory}>{t('No users yet', 'אין משתמשים עדיין', 'لا يوجد مستخدمون بعد')}</div>
          ) : (
            <div className={styles.userList}>
              {users.map(user => (
                <div
                  key={user.id}
                  className={`${styles.userCard} ${expandedUser === user.id ? styles.userCardExpanded : ''}`}
                >
                  <div
                    className={styles.userCardHeader}
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  >
                    <div className={styles.userCardLeft}>
                      <div className={styles.avatar}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className={styles.userName}>{user.name}</p>
                        <p className={styles.userPhone}>{user.phone}</p>
                      </div>
                    </div>
                    <div className={styles.userCardRight}>
                      <span className={styles.userCount}>{user.Prompts?.length || 0} {t('conversations', 'שיחות', 'محادثات')}</span>
                      <span
                        className={styles.chevron}
                        style={{ transform: expandedUser === user.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >▲</span>
                    </div>
                  </div>
                  {expandedUser === user.id && (
                    <div className={styles.userCardBody}>
                      {!user.Prompts?.length ? (
                        <p className={styles.noHistory}>{t('No history for this user', 'אין היסטוריה למשתמש זה', 'لا يوجد سجل لهذا المستخدم')}</p>
                      ) : (
                        user.Prompts.map(p => (
                          <div key={p.id} className={styles.promptCard}>
                            <p className={styles.promptDate}>{formatDate(p.created_at)}</p>
                            <p className={styles.promptText}>{p.prompt}</p>
                            <p className={styles.promptResponse}>{p.response}</p>
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
