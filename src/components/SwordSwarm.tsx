import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { useHandStore, CONFIG } from '../store';
import type { GestureMode } from '../store';

const simplex = {
  noise3D: (x: number, y: number, z: number) => {
    return Math.sin(x * 1.2 + y * 0.8) * Math.cos(y * 1.1 + z * 0.9) * Math.sin(z * 0.7 + x * 1.3);
  },
};

declare global {
  interface Window { swordPositions?: THREE.Vector3[]; }
}

export function SwordSwarm() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const auraRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useRef<THREE.Vector3[]>([]);
  const velocities = useRef<THREE.Vector3[]>([]);

  if (positions.current.length === 0) {
    for (let i = 0; i < CONFIG.swordCount; i++) {
      positions.current.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10 - 5
      ));
      velocities.current.push(new THREE.Vector3());
    }
    window.swordPositions = positions.current;
  }

  const geometry = useMemo(() => {
    const bladeGeo = new THREE.ConeGeometry(0.12, 2.5, 4);
    bladeGeo.scale(0.4, 1, 1); bladeGeo.rotateX(Math.PI / 2); bladeGeo.translate(0, 0, 1.0);
    const guardGeo = new THREE.BoxGeometry(0.5, 0.08, 0.15);
    guardGeo.translate(0, 0, -0.2);
    const handleGeo = new THREE.CylinderGeometry(0.05, 0.06, 0.7, 6);
    handleGeo.rotateX(Math.PI / 2); handleGeo.translate(0, 0, -0.6);
    return mergeGeometries([bladeGeo, guardGeo, handleGeo]) || bladeGeo;
  }, []);

  const material = useMemo(() => new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }), []);

  const auraGeometry = useMemo(() => {
    const g = new THREE.ConeGeometry(0.15, 2.6, 4);
    g.scale(0.5, 1, 1); g.rotateX(Math.PI / 2); g.translate(0, 0, 1.0);
    return g;
  }, []);

  const auraMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0xffcc00, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending,
  }), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const targetPosition = useHandStore.getState().targetPosition;
    const isTracking = useHandStore.getState().isTracking;
    const gestureMode = useHandStore.getState().gestureMode;
    const pathHistory = useHandStore.getState().pathHistory;
    const extendPath = useHandStore.getState().extendPath;
    const time = clock.getElapsedTime();
    const delta = 1 / 60;

    let currentTarget = targetPosition;
    if (!isTracking) {
      currentTarget = new THREE.Vector3(0, 0, 0);
      pathHistory.pop(); pathHistory.unshift(currentTarget.clone());
    } else if (gestureMode === 'DRAGON') { extendPath(); }

    for (let i = 0; i < CONFIG.swordCount; i++) {
      const pos = positions.current[i];
      const vel = velocities.current[i];
      const target = new THREE.Vector3();

      if (gestureMode === 'SHIELD' && isTracking) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / CONFIG.swordCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const orbitX = CONFIG.shieldRadius * Math.sin(phi) * Math.cos(theta + time * CONFIG.shieldOrbitSpeed);
        const orbitY = CONFIG.shieldRadius * Math.sin(phi) * Math.sin(theta + time * CONFIG.shieldOrbitSpeed);
        const orbitZ = CONFIG.shieldRadius * Math.cos(phi);
        const rotatedX = orbitX * Math.cos(time * 0.3) - orbitZ * Math.sin(time * 0.3);
        const rotatedZ = orbitX * Math.sin(time * 0.3) + orbitZ * Math.cos(time * 0.3);
        target.set(currentTarget.x + rotatedX, currentTarget.y + orbitY, currentTarget.z + rotatedZ);
        target.x += Math.sin(time * 3 + i) * 0.2;
        target.y += Math.cos(time * 3 + i * 0.7) * 0.2;
      } else if (gestureMode === 'LOTUS' || (gestureMode === ('LOTUS' as GestureMode) && !isTracking)) {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        const maxRadius = CONFIG.lotusRadius; const minRadius = 6;
        const t = i / (CONFIG.swordCount - 1);
        const r = minRadius + (maxRadius - minRadius) * Math.sqrt(t);
        const theta = i * goldenAngle + time * CONFIG.lotusRotateSpeed;
        const breathe = 1 + Math.sin(time * 2) * 0.05;
        const currentR = r * breathe;
        const x = currentR * Math.cos(theta); const y = currentR * Math.sin(theta);
        const z = Math.sin(time * 2 + i * 0.1) * 0.2;
        target.set(currentTarget.x + x, currentTarget.y + y, currentTarget.z + z);
      } else if (gestureMode === 'DAGENG' && isTracking) {
        if (i === 0) {
          target.set(currentTarget.x, currentTarget.y + 5, currentTarget.z);
        } else {
          const effectiveI = i - 1; const effectiveCount = CONFIG.swordCount - 1;
          const layerCount = 10;
          const perLayer = Math.max(1, Math.floor(effectiveCount / layerCount));
          const layerIdx = Math.floor(effectiveI / perLayer);
          const idxInLayer = effectiveI % perLayer;
          const radius = CONFIG.dagengRadius + layerIdx * 1.5 + 2;
          const dir = layerIdx % 2 === 0 ? 1 : -1;
          const theta = (idxInLayer / perLayer) * Math.PI * 2 + time * CONFIG.dagengRotateSpeed * dir;
          const hCenter = currentTarget.y - 10; const hRange = CONFIG.dagengHeight;
          const hRand = Math.sin(effectiveI * 13.1) * 0.5 + 0.5;
          target.set(currentTarget.x + Math.cos(theta) * radius, hCenter + (hRand - 0.5) * hRange, currentTarget.z + Math.sin(theta) * radius);
        }
      } else {
        if (i < 5) {
          target.copy(currentTarget);
          target.x += Math.sin(time * 8 + i) * 0.3; target.y += Math.cos(time * 8 + i) * 0.3;
        } else {
          const pathIdx = i * 0.8;
          const idxA = Math.min(Math.floor(pathIdx), pathHistory.length - 1);
          const idxB = Math.min(idxA + 1, pathHistory.length - 1);
          const alpha = pathIdx - Math.floor(pathIdx);
          if (pathHistory[idxA] && pathHistory[idxB]) target.lerpVectors(pathHistory[idxA], pathHistory[idxB], alpha);
          else if (pathHistory[idxA]) target.copy(pathHistory[idxA]);
          else target.copy(currentTarget);
          target.x += Math.sin(time * 10 + i * 0.5) * 0.2; target.y += Math.cos(time * 10 + i * 0.5) * 0.2;
          const ns = CONFIG.noiseScale;
          const na = CONFIG.noiseStrength * (0.8 + Math.sin(time * 2 + i * 0.05) * 0.4);
          target.x += simplex.noise3D(pos.x * ns, pos.y * ns, time) * na;
          target.y += simplex.noise3D(pos.y * ns, pos.z * ns, time + 100) * na;
          target.z += simplex.noise3D(pos.z * ns, pos.x * ns, time + 200) * na;
        }
      }

      let speed = gestureMode === 'SHIELD' ? CONFIG.sprintSpeed : CONFIG.maxSpeed;
      if (target.distanceTo(pos) > 4) speed = CONFIG.sprintSpeed;
      else if (target.distanceTo(pos) < 1) speed = target.distanceTo(pos) * CONFIG.maxSpeed;

      const desired = target.sub(pos);
      const d = desired.length();
      if (d > 0) { desired.normalize(); desired.multiplyScalar(d < 10 ? speed * (d / 10) : speed); }

      const steer = desired.sub(vel);
      const steerFactor = gestureMode === 'SHIELD' || gestureMode === 'LOTUS' ? 3 : 1;
      steer.clampLength(0, CONFIG.steerForce * delta * steerFactor);
      vel.add(steer);

      if (i > 0 && gestureMode !== 'SHIELD' && (gestureMode !== 'LOTUS' || !isTracking)) {
        const prev = positions.current[i - 1];
        const diff = pos.clone().sub(prev);
        const dd = diff.length();
        if (dd < CONFIG.separationDist && dd > 0.01) {
          diff.normalize().multiplyScalar(CONFIG.separationForce * delta);
          vel.add(diff);
        }
      }

      pos.add(vel.clone().multiplyScalar(delta));
      dummy.position.copy(pos);

      let lookTarget: THREE.Vector3;
      if (gestureMode === 'SHIELD' && isTracking) {
        if (vel.length() > 0.1) lookTarget = pos.clone().add(vel.clone().normalize());
        else { const relPos = pos.clone().sub(currentTarget); lookTarget = pos.clone().add(new THREE.Vector3(-relPos.z, 0, relPos.x).normalize()); }
      } else if (gestureMode === 'LOTUS') {
        lookTarget = pos.clone().add(pos.clone().sub(currentTarget).normalize());
      } else if (gestureMode === 'DAGENG' && isTracking) {
        lookTarget = pos.clone().add(new THREE.Vector3(0, -1, 0));
      } else {
        lookTarget = pos.clone().add(vel.length() > 0.1 ? vel : new THREE.Vector3(0, 0, -1));
      }
      dummy.lookAt(lookTarget);

      let targetScale = 1;
      if (gestureMode === 'DAGENG' && isTracking) { targetScale = i === 0 ? 6 : 1.5; }
      const currentScale = meshRef.current.userData.currentScale || 1;
      const lerpSpeed = i === 0 && gestureMode === 'DAGENG' ? 0.01 : 0.02;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale, lerpSpeed);
      meshRef.current.userData.currentScale = newScale;
      dummy.scale.set(newScale, newScale, newScale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      if (auraRef.current) {
        const isActive = gestureMode === 'SHIELD'
          ? Math.sin(time * 30 + i * 0.5) > 0.0
          : Math.sin(time * 20 + i * 0.7) > 0.3;
        const auraScale = newScale * (isActive ? 1.3 : 1.0);
        if (!isActive && !(i === 0 && gestureMode === 'DAGENG')) dummy.scale.set(0, 0, 0);
        else dummy.scale.set(auraScale, auraScale, auraScale);
        dummy.updateMatrix();
        auraRef.current.setMatrixAt(i, dummy.matrix);
        dummy.scale.set(newScale, newScale, newScale);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (auraRef.current) auraRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[geometry, material, CONFIG.swordCount]} frustumCulled={false} />
      <instancedMesh ref={auraRef} args={[auraGeometry, auraMaterial, CONFIG.swordCount]} frustumCulled={false} />
    </group>
  );
}
