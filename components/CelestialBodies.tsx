// components/CelestialBodies.tsx
"use client";

import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";
import { LANGUAGE_COLORS } from "../lib/constants";

export function CentralStar({ username }: { username: string }) {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#fcd34d"
        emissive="#fcd34d"
        emissiveIntensity={4}
      />
      <Html distanceFactor={15} center position={[0, 4, 0]}>
        <div className="text-white text-xl font-black bg-black/60 px-5 py-2 rounded-full border border-yellow-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(252,211,77,0.5)]">
          @{username || "git-galaxy"}
        </div>
      </Html>
    </mesh>
  );
}

export function AsteroidBelt({
  issueCount,
  planetRadius,
}: {
  issueCount: number;
  planetRadius: number;
}) {
  const beltRef = useRef<THREE.Group>(null);
  const asteroids = useMemo(() => {
    const count = Math.min(issueCount, 50);
    return Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = planetRadius + 0.6 + Math.random() * 1.5;
      return {
        position: [
          Math.cos(angle) * distance,
          (Math.random() - 0.5) * 0.8,
          Math.sin(angle) * distance,
        ] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [
          number,
          number,
          number
        ],
        scale: Math.random() * 0.08 + 0.02,
      };
    });
  }, [issueCount, planetRadius]);

  useFrame(() => {
    if (beltRef.current) beltRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={beltRef}>
      {asteroids.map((rock, i) => (
        <mesh
          key={i}
          position={rock.position}
          rotation={rock.rotation}
          scale={rock.scale}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Moon({
  orbitRadius,
  speed,
  size,
  index,
}: {
  orbitRadius: number;
  speed: number;
  size: number;
  index: number;
}) {
  const moonRef = useRef<THREE.Mesh>(null);
  const offset = index * (Math.PI / 2);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    if (moonRef.current) {
      moonRef.current.position.x = Math.cos(t) * orbitRadius;
      moonRef.current.position.z = Math.sin(t) * orbitRadius;
    }
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
    </mesh>
  );
}

export function Planet({
  repo,
  index,
  setOrbitPaused,
}: {
  repo: any;
  index: number;
  setOrbitPaused: (val: boolean) => void;
}) {
  const orbitContainerRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const orbitRadius = 8 + index * 4.5;
  const speed = 0.4 - index * 0.015;
  const size = Math.max(0.5, Math.min(Math.log10(repo.size || 10) * 0.4, 3));
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
  const forks = Math.min(repo.forks_count || 0, 10);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (orbitContainerRef.current) {
      orbitContainerRef.current.position.x =
        Math.cos(elapsedTime * speed) * orbitRadius;
      orbitContainerRef.current.position.z =
        Math.sin(elapsedTime * speed) * orbitRadius;
    }
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 128]} />
        <meshBasicMaterial
          color={color}
          opacity={hovered ? 0.4 : 0.05}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      <group ref={orbitContainerRef}>
        <mesh
          ref={planetMeshRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            setOrbitPaused(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
            setOrbitPaused(false);
          }}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.5 : 0.2}
            roughness={0.2}
          />
        </mesh>

        {Array.from({ length: forks }).map((_, i) => (
          <Moon
            key={i}
            index={i}
            orbitRadius={size + 0.8 + i * 0.3}
            speed={0.8 - i * 0.05}
            size={0.1}
          />
        ))}

        {repo.open_issues_count > 0 && (
          <AsteroidBelt
            issueCount={repo.open_issues_count}
            planetRadius={size}
          />
        )}

        {hovered && (
          <Html
            distanceFactor={12}
            center
            position={[0, size + 2, 0]}
            zIndexRange={[100, 0]}
          >
            <div className="flex flex-col w-64 bg-slate-900/95 p-4 rounded-xl border border-slate-600 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-lg leading-tight">
                  {repo.name}
                </span>
                <span
                  className="text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider"
                  style={{ backgroundColor: `${color}30`, color: color }}
                >
                  {repo.language || "Code"}
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">
                {repo.description || "No description provided."}
              </p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Stars
                  </div>
                  <div className="text-yellow-400 font-mono font-bold">
                    {repo.stargazers_count}
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Issues
                  </div>
                  <div className="text-red-400 font-mono font-bold">
                    {repo.open_issues_count}
                  </div>
                </div>
              </div>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm text-center hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer block"
              >
                Initiate Warp (Visit)
              </a>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
