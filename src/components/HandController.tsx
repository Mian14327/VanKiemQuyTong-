import { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useHandStore } from '../store';
import type { GestureMode } from '../store';
import { globalVideo, globalLandmarker, detectGesture } from '../services/HandTrackingService';

let lastVideoTime = -1;

export function HandController() {
  const { camera } = useThree();
  const setTarget = useHandStore((state) => state.setTarget);
  const setTracking = useHandStore((state) => state.setTracking);
  const setGestureMode = useHandStore((state) => state.setGestureMode);
  const updatePath = useHandStore((state) => state.updatePath);

  const pendingGesture = useRef<GestureMode | null>(null);
  const gestureStartTime = useRef<number>(0);
  const currentConfirmedGesture = useRef<GestureMode>('LOTUS');

  useFrame(({ clock }) => {
    if (!globalLandmarker || !globalVideo || globalVideo.readyState !== 4) return;
    if (globalVideo.currentTime === lastVideoTime) return;

    lastVideoTime = globalVideo.currentTime;
    const results = globalLandmarker.detectForVideo(globalVideo, performance.now());

    if (results.landmarks && results.landmarks.length > 0) {
      setTracking(true);
      const lm = results.landmarks[0];
      const detectedGesture = detectGesture(lm);
      const now = clock.getElapsedTime();

      if (detectedGesture !== pendingGesture.current) {
        pendingGesture.current = detectedGesture;
        gestureStartTime.current = now;
      } else {
        const duration = now - gestureStartTime.current;
        if (duration > 0.25 && detectedGesture !== currentConfirmedGesture.current) {
          currentConfirmedGesture.current = detectedGesture;
          setGestureMode(detectedGesture);
        }
      }

      const activeGesture = currentConfirmedGesture.current;
      let targetPoint: { x: number; y: number };

      if (activeGesture === 'SHIELD' || activeGesture === 'LOTUS') {
        const wrist = lm[0]; const middleBase = lm[9];
        targetPoint = { x: (wrist.x + middleBase.x) / 2, y: (wrist.y + middleBase.y) / 2 };
      } else {
        targetPoint = lm[8];
      }

      const ndcX = (1 - targetPoint.x) * 2 - 1;
      const ndcY = -(targetPoint.y * 2 - 1);
      const vec = new THREE.Vector3(ndcX, ndcY, 0.5).unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

      setTarget(worldPos);
      if (activeGesture === 'DRAGON') updatePath(worldPos);
    } else {
      setTracking(false);
    }
  });

  return null;
}
