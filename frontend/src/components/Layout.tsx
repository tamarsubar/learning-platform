import React, { useMemo } from 'react';

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
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0b0c1e' }}>
      {stars.map(star => (
        <div key={star.id} style={{
          position: 'fixed',
          top: `${star.top}%`,
          left: `${star.left}%`,
          width: `${star.size}px`,
          height: `${star.size}px`,
          borderRadius: '50%',
          background: 'white',
          opacity: star.opacity,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ))}
      <div style={{
        position: 'fixed', width: 400, height: 400, top: '-10%', right: '-10%',
        background: 'rgba(124,109,250,0.07)', borderRadius: '50%',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'fixed', width: 300, height: 300, bottom: '5%', left: '-8%',
        background: 'rgba(255,229,102,0.04)', borderRadius: '50%',
        filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
