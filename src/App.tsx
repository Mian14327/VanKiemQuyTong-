import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Scene } from './components/Scene';
import { HandController } from './components/HandController';
import { initHandTracking } from './services/HandTrackingService';
import { useHandStore } from './store';
import { OrientationGuard } from './components/OrientationGuard';
import './index.css';

function StatusIndicator() {
  const isTracking = useHandStore((state) => state.isTracking);
  const gestureMode = useHandStore((state) => state.gestureMode);

  const getModeText = () => {
    if (!isTracking) return '⏳ Đang chờ cử chỉ...';
    switch (gestureMode) {
      case 'LOTUS': return '🌸 Trận Hoa Sen';
      case 'SHIELD': return '🛡️ Phong Kiếm Trận';
      case 'DAGENG': return '🤘 Đại Canh Kiếm Trận';
      default: return '🐉 Du Long Phi Hành';
    }
  };

  const getModeColor = () => {
    if (!isTracking) return '#ff6666';
    switch (gestureMode) {
      case 'LOTUS': return '#ffaa44';
      case 'SHIELD': return '#88ccff';
      default: return '#00ff88';
    }
  };

  return (
    <div style={{
      position: 'fixed', top: '10px', left: '10px', padding: '8px 16px',
      background: 'rgba(0, 0, 0, 0.5)', borderRadius: '20px',
      color: getModeColor(), fontSize: '12px', zIndex: 100, transition: 'color 0.3s',
    }}>
      {getModeText()}
    </div>
  );
}

function UI() {
  const gestureMode = useHandStore((state) => state.gestureMode);
  const isTracking = useHandStore((state) => state.isTracking);

  const getColor = () => {
    if (!isTracking) return '#00ff88';
    switch (gestureMode) {
      case 'LOTUS': return '#ffaa44';
      case 'SHIELD': return '#88ccff';
      default: return '#00ff88';
    }
  };

  const getHint = () => {
    if (!isTracking) return '👋 Vẫy tay để kích hoạt kiếm...';
    switch (gestureMode) {
      case 'DAGENG': return '🤘 Kết Ấn · Đại Canh Kiếm Trận';
      case 'LOTUS': return '🖐️ Xòe Tay · Hoa Sen Hiện Thế';
      case 'SHIELD': return '✊ Nắm Đấm · Hãm Phong Kiếm Trận';
      default: return '👈 Kiếm Chỉ · Du Long Phi Hành';
    }
  };

  return (
    <div style={{
      position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
      textAlign: 'center', zIndex: 100, color: '#fff', textShadow: '0 0 10px #00ff88',
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '8px', color: getColor(), transition: 'color 0.3s' }}>
        Vạn Kiếm Quy Tông
      </h1>
      <p style={{ fontSize: '14px', opacity: 0.7 }}>{getHint()}</p>
    </div>
  );
}

function WebcamView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      initHandTracking(videoRef.current).then((success) => { setIsReady(success); });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      style={{
        position: 'fixed', top: '10px', right: '10px', width: '120px', height: '90px',
        borderRadius: '8px',
        border: `2px solid ${isReady ? 'rgba(0, 255, 136, 0.5)' : 'rgba(255, 100, 100, 0.5)'}`,
        transform: 'scaleX(-1)', opacity: 0, zIndex: 100,
      }}
      autoPlay playsInline muted
    />
  );
}

export default function App() {
  return (
    <OrientationGuard>
      <div style={{ width: '100vw', height: '100vh' }}>
        <WebcamView />
        <Canvas camera={{ position: [0, 3, 35], fov: 60 }} dpr={[1, 2]} gl={{ antialias: false, alpha: true }}>
          <Scene />
          <HandController />
        </Canvas>
        <StatusIndicator />
        <UI />
      </div>
    </OrientationGuard>
  );
}
