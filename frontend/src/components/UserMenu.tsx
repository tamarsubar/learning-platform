import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

interface Props {
  user: any;
  onSwitch: () => void;
}

const UserMenu: React.FC<Props> = ({ user, onSwitch }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '8px 12px', background: 'none', border: 'none',
    fontSize: '13px', cursor: 'pointer', textAlign: 'left', borderRadius: '6px',
  };

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '5px 12px 5px 6px',
          background: '#1c2035', borderRadius: '20px',
          cursor: 'pointer', border: '1px solid rgba(124,109,250,0.2)', userSelect: 'none',
        }}
      >
        <div style={{
          width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, #7c5cf5, #9b78ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontWeight: 'bold', fontSize: '13px',
        }}>
          {(user.name || 'U').charAt(0).toUpperCase()}
        </div>
        <span style={{ color: 'white', fontSize: '14px', fontWeight: '500' }}>
          {user.name || 'User'}
        </span>
      </div>

      {open && (
        <div style={{
          position: 'fixed',
          top: ref.current ? ref.current.getBoundingClientRect().bottom + 8 : 0,
          left: ref.current ? Math.max(4, Math.min(ref.current.getBoundingClientRect().left, window.innerWidth - 196)) : 4,
          background: '#1a1b35', border: '1px solid rgba(124,109,250,0.25)',
          borderRadius: '10px', padding: '8px', minWidth: '180px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)', zIndex: 9999,
        }}>
          <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '6px' }}>
            <p style={{ color: '#8080a0', fontSize: '11px', margin: '0 0 2px' }}>{t('Signed in as', 'מחובר כ', 'متصل كـ')}</p>
            <p style={{ color: 'white', fontSize: '14px', fontWeight: '600', margin: 0 }}>{user.name}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ ...btnStyle, color: '#b0b0c8' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {t('Stay', 'הישאר', 'ابقَ')}
          </button>
          <button
            onClick={onSwitch}
            style={{ ...btnStyle, color: '#e05555' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,85,85,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
          >
            {t('Switch User', 'החלף משתמש', 'تغيير المستخدم')}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
