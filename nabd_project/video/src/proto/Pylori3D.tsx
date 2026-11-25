// Prototype: a toon-shaded 3D H. pylori (helical rod + flagella) drawn with an ink outline so it sits beside the flat 2D art.
import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";

const toonGradient = (() => {
  const c = document.createElement("canvas"); c.width = 4; c.height = 1;
  const g = c.getContext("2d")!; ["#6b8f5a", "#8fb87a", "#b9dba1", "#e7f6d8"].forEach((col, i) => { g.fillStyle = col; g.fillRect(i, 0, 1, 1); });
  const t = new THREE.CanvasTexture(c); t.magFilter = THREE.NearestFilter; t.minFilter = THREE.NearestFilter; return t;
})();

const Bug: React.FC<{ rot: number }> = ({ rot }) => {
  const { body, flag } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; const a = t * Math.PI * 2.6; pts.push(new THREE.Vector3((t - 0.5) * 3.2, Math.sin(a) * 0.38, Math.cos(a) * 0.38)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const body = new THREE.TubeGeometry(curve, 120, 0.34, 24, false);
    const flag: THREE.TubeGeometry[] = [];
    const end = pts[0];
    for (let k = 0; k < 5; k++) {
      const p: THREE.Vector3[] = [];
      for (let i = 0; i <= 20; i++) { const t = i / 20; p.push(new THREE.Vector3(end.x - t * 1.5, end.y + Math.sin(t * 7 + k) * 0.16 * t + (k - 2) * 0.1 * t, end.z + Math.cos(t * 7 + k * 1.3) * 0.16 * t)); }
      flag.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p), 40, 0.03, 8, false));
    }
    return { body, flag };
  }, []);
  const ink = <meshBasicMaterial color="#2B2A28" side={THREE.BackSide} />;
  return (
    <group rotation={[0.2, rot, 0.12]} scale={1} position={[0.5, 0, 0]}>
      <mesh geometry={body}><meshToonMaterial color="#9CC48A" gradientMap={toonGradient} /></mesh>
      <mesh geometry={body} scale={[1.0, 1.1, 1.1]}>{ink}</mesh>
      {[-1.6, 1.6].map((x, i) => (<group key={i}><mesh position={[x, i ? -0.0 : 0, i ? 0.38 : 0.38]}><sphereGeometry args={[0.34, 24, 24]} /><meshToonMaterial color="#9CC48A" gradientMap={toonGradient} /></mesh></group>))}
      <group position={[0.7, 0.18, 0.62]}>
        {[-0.28, 0.28].map((x, i) => (<group key={i} position={[x, 0, 0]}><mesh><sphereGeometry args={[0.2, 24, 24]} /><meshBasicMaterial color="#ffffff" /></mesh><mesh position={[0.03, 0, 0.17]}><sphereGeometry args={[0.09, 16, 16]} /><meshBasicMaterial color="#2B2A28" /></mesh></group>))}
        <mesh position={[0, -0.32, 0.05]} rotation={[0, 0, Math.PI]}><torusGeometry args={[0.17, 0.03, 8, 20, Math.PI]} /><meshBasicMaterial color="#2B2A28" /></mesh>
      </group>
      {flag.map((g, i) => (<group key={i}><mesh geometry={g}><meshBasicMaterial color="#2B2A28" /></mesh></group>))}
    </group>
  );
};

export const Pylori3D: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <ThreeCanvas width={1080} height={1080} camera={{ position: [0, 0, 11], fov: 34 }} style={{ background: "transparent" }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <Bug rot={Math.sin(f / 28) * 0.55} />
    </ThreeCanvas>
  );
};
