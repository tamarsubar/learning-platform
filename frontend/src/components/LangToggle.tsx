import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, LANGUAGES } from '../context/LanguageContext';
import styles from './LangToggle.module.css';

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
    <div ref={ref} className={styles.wrapper}>
      <button
        onClick={() => setOpen(p => !p)}
        className={`${styles.trigger} ${open ? styles.triggerOpen : ''}`}
      >
        {current.label}
        <span className={styles.arrow}>▼</span>
      </button>

      {open && (
        <div className={styles.dropdown} style={{
          top: ref.current ? ref.current.getBoundingClientRect().bottom + 6 : 0,
          left: ref.current ? Math.min(ref.current.getBoundingClientRect().left, window.innerWidth - 148) : 0,
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`${styles.langBtn} ${lang === l.code ? styles.langBtnActive : ''}`}
            >
              {l.label}
              {lang === l.code && <span className={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LangToggle;
