"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CentralStar, Planet } from "./CelestialBodies";

interface GalaxyCanvasProps {
  repos: any[];
  contributors: Record<number, any[]>;
  activeUser: string;
  userProfile: any;
  orbitPaused: boolean;
  setOrbitPaused: (val: boolean) => void;
}

export function GalaxyCanvas({
  repos,
  contributors,
  activeUser,
  userProfile,
  orbitPaused,
  setOrbitPaused,
}: GalaxyCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 40, 60], fov: 45, far: 5000 }}
      className="absolute inset-0 z-0"
    >
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 0, 0]} intensity={300} color="#fff8e7" distance={300} />
      <pointLight position={[80, 40, 80]} intensity={15} color="#3a6fd8" distance={200} />
      <pointLight position={[-80, -20, -60]} intensity={10} color="#8b3dff" distance={200} />

      <Stars
        radius={2000}
        depth={500}
        count={25000}
        factor={8}
        saturation={1}
        fade={false}
        speed={0.4}
      />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        autoRotate={!orbitPaused}
        autoRotateSpeed={0.5}
        maxDistance={1800}
        minDistance={5}
        makeDefault
      />

      <EffectComposer>
        <Bloom luminanceThreshold={0.15} luminanceSmoothing={0.85} height={400} intensity={1.8} />
      </EffectComposer>

      {repos.length > 0 && (
        <CentralStar username={activeUser} userProfile={userProfile} />
      )}

      {repos.map((repo, index) => (
        <Planet
          key={repo.id}
          repo={repo}
          index={index}
          orbitPaused={orbitPaused}
          setOrbitPaused={setOrbitPaused}
          contributors={contributors[repo.id] || []}
        />
      ))}
    </Canvas>
  );
}