import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';

const LangToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          padding: '4px 2px',
          background: 'none',
          border: 'none',
          color: open ? '#9b8fff' : '#6060a0',
          fontSize: '13px',
          fontWeight: '500',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '4px',
          transition: 'color 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#9b8fff')}
        onMouseLeave={e => { if (!open) e.currentTarget.style.color = '#6060a0'; }}
      >
        {current.label}
        <span style={{ fontSize: '9px', opacity: 0.6 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'fixed',
          top: ref.current ? ref.current.getBoundingClientRect().bottom + 6 : 0,
          left: ref.current ? Math.min(ref.current.getBoundingClientRect().left, window.innerWidth - 148) : 0,
          background: '#1a1b35',
          border: '1px solid rgba(124,109,250,0.25)',
          borderRadius: '10px',
          padding: '6px',
          minWidth: '130px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          zIndex: 9999,
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                width: '100%', padding: '8px 12px',
                background: lang === l.code ? 'rgba(124,109,250,0.2)' : 'none',
                border: 'none',
                borderRadius: '6px',
                color: lang === l.code ? 'white' : '#b0b0c8',
                fontSize: '13px',
                fontWeight: lang === l.code ? '600' : '400',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
              onMouseEnter={e => { if (lang !== l.code) (e.currentTarget.style.background = 'rgba(255,255,255,0.05)'); }}
              onMouseLeave={e => { if (lang !== l.code) (e.currentTarget.style.background = 'none'); }}
            >
              {l.label}
              {lang === l.code && <span style={{ color: '#7c6dfa', fontSize: '11px' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LangToggle;
