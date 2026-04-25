import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useHandStore } from '../store';

declare global {
  interface Window { swordPositions?: THREE.Vector3[]; }
}

export function CameraController() {
  const { camera } = useThree();
  const SMOOTH_SPEED = 0.02;
  const smoothTarget = useRef(new THREE.Vector3(0, 0, 0));
  const smoothCamPos = useRef(new THREE.Vector3(0, 5, 35));
  const smoothLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const smoothZoom = useRef(30);

  useFrame(({ clock }) => {
    const isTracking = useHandStore.getState().isTracking;
    const time = clock.getElapsedTime();
    const positions = window.swordPositions;

    let formationSize = 10;
    const formationCenter = new THREE.Vector3(0, 0, 0);

    if (positions && positions.length > 0) {
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      let sumX = 0, sumY = 0, sumZ = 0;
      for (const pos of positions) {
        minX = Math.min(minX, pos.x); maxX = Math.max(maxX, pos.x);
        minY = Math.min(minY, pos.y); maxY = Math.max(maxY, pos.y);
        sumX += pos.x; sumY += pos.y; sumZ += pos.z;
      }
      formationCenter.set(sumX / positions.length, sumY / positions.length, sumZ / positions.length);
      formationSize = Math.max(maxX - minX, maxY - minY);
    }

    const gestureMode = useHandStore.getState().gestureMode;
    const targetZoom = THREE.MathUtils.clamp(formationSize * 1.2 + 18, 22, gestureMode === 'DAGENG' ? 55 : 75);
    smoothZoom.current = THREE.MathUtils.lerp(smoothZoom.current, targetZoom, SMOOTH_SPEED);

    let followPoint: THREE.Vector3;
    if (isTracking) { followPoint = formationCenter.clone(); }
    else { followPoint = new THREE.Vector3(Math.sin(time * 0.5) * 6, Math.cos(time * 0.4) * 4, 0); }
    smoothTarget.current.lerp(followPoint, SMOOTH_SPEED);

    const desiredCamPos = new THREE.Vector3(smoothTarget.current.x * 0.25, smoothTarget.current.y * 0.15 + 3, smoothZoom.current);
    smoothCamPos.current.lerp(desiredCamPos, SMOOTH_SPEED);
    camera.position.copy(smoothCamPos.current);

    const desiredLookAt = new THREE.Vector3(smoothTarget.current.x * 0.4, smoothTarget.current.y * 0.25, 4);
    smoothLookAt.current.lerp(desiredLookAt, SMOOTH_SPEED);
    camera.lookAt(smoothLookAt.current);
  });

  return null;
}
