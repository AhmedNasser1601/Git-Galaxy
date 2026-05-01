// components/GalaxyCanvas.tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CentralStar, Planet } from "./CelestialBodies";

interface GalaxyCanvasProps {
  repos: any[];
  activeUser: string;
  orbitPaused: boolean;
  setOrbitPaused: (val: boolean) => void;
}

export function GalaxyCanvas({
  repos,
  activeUser,
  orbitPaused,
  setOrbitPaused,
}: GalaxyCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 40, 60], fov: 45 }}
      className="absolute inset-0 z-0"
    >
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 0, 0]}
        intensity={250}
        color="#ffffff"
        distance={200}
      />

      <Stars
        radius={150}
        depth={50}
        count={10000}
        factor={6}
        saturation={1}
        fade
        speed={1}
      />

      {/* Pauses the camera spin when hovered */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!orbitPaused}
        autoRotateSpeed={0.5}
        makeDefault
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
          intensity={1.5}
        />
      </EffectComposer>

      {repos.length > 0 && <CentralStar username={activeUser} />}

      {repos.map((repo, index) => (
        <Planet
          key={repo.id}
          repo={repo}
          index={index}
          orbitPaused={orbitPaused}
          setOrbitPaused={setOrbitPaused}
        />
      ))}
    </Canvas>
  );
}
