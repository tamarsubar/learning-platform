import React, { useMemo } from 'react';
import styles from './Layout.module.css';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      top: (Math.sin(i * 127.1 + 1) * 0.5 + 0.5) * 100,
      left: (Math.sin(i * 311.7 + 2) * 0.5 + 0.5) * 100,
      size: (Math.sin(i * 53.3) * 0.5 + 0.5) * 2 + 0.5,
      opacity: (Math.sin(i * 89.7) * 0.5 + 0.5) * 0.55 + 0.15,
    })), []
  );

  return (
    <div className={styles.container}>
      {stars.map(star => (
        <div key={star.id} className={styles.star} style={{
          top: `${star.top}%`,
          left: `${star.left}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
        }} />
      ))}
      <div className={styles.glowTopRight} />
      <div className={styles.glowBottomLeft} />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
