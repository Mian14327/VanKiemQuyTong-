import { useState, useEffect } from 'react';

export function OrientationGuard({ children }: { children: React.ReactNode }) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      let isVertical = false;
      if (screen.orientation) { isVertical = screen.orientation.type.includes('portrait'); }
      else if (typeof window.orientation !== 'undefined') { isVertical = Math.abs(window.orientation as number) !== 90; }
      else if (window.matchMedia) { isVertical = window.matchMedia('(orientation: portrait)').matches; }
      else { isVertical = window.innerHeight > window.innerWidth; }

      const isMobile =
        // @ts-ignore
        (navigator.userAgentData && navigator.userAgentData.mobile) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
        'ontouchstart' in window || window.innerWidth < 1024;
      setIsPortrait(isMobile && isVertical);
    };

    checkOrientation();
    if (screen.orientation) screen.orientation.addEventListener('change', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      if (screen.orientation) screen.orientation.removeEventListener('change', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (isPortrait && !dismissed) {
    return (
      <>
        {children}
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(5px)',
          color: '#00ff88', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          textAlign: 'center', padding: '20px', transition: 'opacity 0.3s',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📱➡️🔄</div>
          <h2 style={{ marginBottom: '10px', fontFamily: '"Courier New", monospace', fontSize: '24px' }}>
            Xoay ngang để trải nghiệm tốt hơn
          </h2>
          <p style={{ color: '#ccc', maxWidth: '300px', marginBottom: '30px', lineHeight: '1.6', fontSize: '15px' }}>
            Để có tầm nhìn tốt nhất, hãy xoay thiết bị của bạn.
            <br /><span style={{ fontSize: '12px', opacity: 0.8 }}>(Chế độ dọc có thể bị hạn chế góc nhìn)</span>
          </p>
          <button onClick={() => setDismissed(true)} style={{
            padding: '10px 24px', background: 'transparent', border: '1px solid #00ff88',
            color: '#00ff88', borderRadius: '20px', fontSize: '14px', cursor: 'pointer', outline: 'none',
          }}>
            Tiếp tục &gt;
          </button>
        </div>
      </>
    );
  }

  return <>{children}</>;
}
