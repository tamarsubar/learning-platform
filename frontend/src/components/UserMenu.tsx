import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import styles from './UserMenu.module.css';

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

  return (
    <div ref={ref} className={styles.wrapper}>
      <div onClick={() => setOpen(p => !p)} className={styles.trigger}>
        <div className={styles.avatar}>
          {(user.name || 'U').charAt(0).toUpperCase()}
        </div>
        <span className={styles.name}>{user.name || 'User'}</span>
      </div>

      {open && (() => {
        const rect = ref.current?.getBoundingClientRect();
        const dropdownHeight = 110;
        const openAbove = rect && rect.bottom + dropdownHeight > window.innerHeight;
        return (
          <div className={styles.dropdown} style={{
            top: rect ? (openAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 8) : 0,
            left: rect ? Math.max(4, Math.min(rect.left, window.innerWidth - 196)) : 4,
          }}>
            <div className={styles.dropdownHeader}>
              <p className={styles.dropdownLabel}>{t('Signed in as', 'מחובר כ', 'متصل كـ')}</p>
              <p className={styles.dropdownName}>{user.name}</p>
            </div>
            <button onClick={() => setOpen(false)} className={`${styles.menuBtn} ${styles.menuBtnStay}`}>
              {t('Stay', 'הישאר', 'ابقَ')}
            </button>
            <button onClick={onSwitch} className={`${styles.menuBtn} ${styles.menuBtnSwitch}`}>
              {t('Switch User', 'החלף משתמש', 'تغيير المستخدم')}
            </button>
          </div>
        );
      })()}
    </div>
  );
};

export default UserMenu;
