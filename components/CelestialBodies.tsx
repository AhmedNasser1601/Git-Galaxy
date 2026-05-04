"use client";

import { useFrame } from '@react-three/fiber';
import { Html, Text, Billboard } from '@react-three/drei';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { LANGUAGE_COLORS } from '../lib/constants';

export function CentralStar({ username, userProfile }: { username: string; userProfile: any }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'crosshair';
    return () => { document.body.style.cursor = 'crosshair'; };
  }, [hovered]);

  useFrame((_, delta) => {
    if (coreRef.current) coreRef.current.rotation.y += delta * 0.3;
    if (glowRef.current) {
      glowRef.current.rotation.y -= delta * 0.1;
      glowRef.current.rotation.x += delta * 0.05;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[3.4, 32, 32]} />
        <meshStandardMaterial
          color="#ff9900"
          emissive="#ff6600"
          emissiveIntensity={1.2}
          transparent
          opacity={0.25}
          side={THREE.BackSide}
        />
      </mesh>
      <mesh
        ref={coreRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
        scale={hovered ? 1.08 : 1}
      >
        <sphereGeometry args={[2.5, 64, 64]} />
        <meshStandardMaterial
          color="#fcd34d"
          emissive="#ff8c00"
          emissiveIntensity={hovered ? 4.5 : 3}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {!hovered && (
        <Html distanceFactor={15} center position={[0, 4.5, 0]}>
          <div className="text-white text-xl font-black bg-black/60 px-5 py-2 rounded-full border border-yellow-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(252,211,77,0.5)] pointer-events-none">
            @{username || "git-galaxy"}
          </div>
        </Html>
      )}

      {hovered && userProfile && (
        <Html distanceFactor={12} center position={[0, 5.5, 0]} zIndexRange={[100, 0]}>
          <div className="flex flex-col w-80 bg-slate-900/97 p-5 rounded-2xl border border-yellow-500/40 backdrop-blur-xl shadow-[0_0_40px_rgba(252,211,77,0.2)] pointer-events-none">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={userProfile.avatar_url}
                alt={userProfile.login}
                className="w-16 h-16 rounded-full border-2 border-yellow-400/60 shadow-[0_0_15px_rgba(252,211,77,0.4)]"
              />
              <div className="flex flex-col">
                <span className="text-white font-black text-lg leading-tight">
                  {userProfile.name || userProfile.login}
                </span>
                <span className="text-yellow-400/80 font-mono text-xs">@{userProfile.login}</span>
                {userProfile.company && (
                  <span className="text-slate-400 text-xs mt-0.5">{userProfile.company}</span>
                )}
              </div>
            </div>

            {userProfile.bio && (
              <p className="text-slate-300 text-xs mb-4 leading-relaxed border-l-2 border-yellow-500/40 pl-3">
                {userProfile.bio}
              </p>
            )}

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Repos</div>
                <div className="text-yellow-400 font-mono font-bold text-sm">{userProfile.public_repos}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Followers</div>
                <div className="text-blue-400 font-mono font-bold text-sm">{userProfile.followers}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                <div className="text-slate-400 text-[10px] uppercase tracking-wider">Following</div>
                <div className="text-purple-400 font-mono font-bold text-sm">{userProfile.following}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {userProfile.location && (
                <div className="bg-slate-800/40 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase">Location</span>
                  <span className="text-slate-300 text-xs truncate">{userProfile.location}</span>
                </div>
              )}
              {userProfile.blog && (
                <div className="bg-slate-800/40 rounded-lg p-2 flex items-center gap-2">
                  <span className="text-slate-400 text-[10px] uppercase">Web</span>
                  <span className="text-blue-400 text-xs truncate">{userProfile.blog}</span>
                </div>
              )}
            </div>

            {userProfile.created_at && (
              <div className="mt-3 text-slate-500 text-[10px] text-center font-mono">
                Member since {new Date(userProfile.created_at).getFullYear()}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export function AsteroidBelt({ issueCount, planetRadius, orbitPaused }: { issueCount: number; planetRadius: number; orbitPaused: boolean }) {
  const beltRef = useRef<THREE.Group>(null);
  const asteroids = useMemo(() => {
    const count = Math.min(issueCount, 50);
    return Array.from({ length: count }).map(() => {
      const angle = Math.random() * Math.PI * 2;
      const distance = planetRadius + 0.6 + Math.random() * 1.5;
      return {
        position: [Math.cos(angle) * distance, (Math.random() - 0.5) * 0.8, Math.sin(angle) * distance] as [number, number, number],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: Math.random() * 0.08 + 0.02,
      };
    });
  }, [issueCount, planetRadius]);

  useFrame((_, delta) => {
    if (beltRef.current && !orbitPaused) beltRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={beltRef}>
      {asteroids.map((rock, i) => (
        <mesh key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.9} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
}

function ContributorMoon({
  contributor,
  orbitRadius,
  speed,
  size,
  index,
  orbitPaused,
}: {
  contributor: any;
  orbitRadius: number;
  speed: number;
  size: number;
  index: number;
  orbitPaused: boolean;
}) {
  const spinRef = useRef<THREE.Group>(null);
  const angleRef = useRef(index * ((Math.PI * 2) / 6));
  const [hovered, setHovered] = useState(false);

  const tilt = useMemo(() => (index * 0.38) - 0.55, [index]);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : '';
    return () => { document.body.style.cursor = ''; };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!orbitPaused) {
      angleRef.current += speed * delta;
    }
    if (spinRef.current) {
      spinRef.current.rotation.z = angleRef.current;
    }
  });

  return (
    <group rotation={[Math.PI / 2 + tilt, 0, 0]}>
      <mesh>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={hovered ? 0.3 : 0.08} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={spinRef}>
        <mesh
          position={[orbitRadius, 0, 0]}
          scale={hovered ? 1.4 : 1}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
          onClick={(e) => { e.stopPropagation(); window.open(contributor.html_url, '_blank'); }}
        >
          <sphereGeometry args={[size, 24, 24]} />
          <meshStandardMaterial
            color="#c8d8f0"
            roughness={0.5}
            metalness={0.2}
            emissive={hovered ? "#6699ff" : "#000000"}
            emissiveIntensity={hovered ? 0.8 : 0}
          />

          {hovered && (
            <Html distanceFactor={8} center position={[0, size + 0.5, 0]} zIndexRange={[200, 0]}>
              <div className="flex flex-col items-center gap-1 pointer-events-none">
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-10 h-10 rounded-full border-2 border-blue-400 shadow-lg"
                />
                <div className="text-white text-xs font-bold bg-slate-900/90 px-3 py-1 rounded-full border border-blue-400/50 whitespace-nowrap">
                  @{contributor.login}
                </div>
                <div className="text-slate-300 text-[10px] bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-600/50 whitespace-nowrap">
                  {contributor.contributions} commits
                </div>
              </div>
            </Html>
          )}
        </mesh>
      </group>
    </group>
  );
}

function PlanetRings({ size, color }: { size: number; color: string }) {
  return (
    <group rotation={[Math.PI / 3.5, 0, 0]}>
      <mesh>
        <ringGeometry args={[size * 1.4, size * 1.9, 128]} />
        <meshBasicMaterial color={color} opacity={0.35} transparent side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <ringGeometry args={[size * 2.0, size * 2.2, 128]} />
        <meshBasicMaterial color={color} opacity={0.15} transparent side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PlanetAtmosphere({ size, color }: { size: number; color: string }) {
  return (
    <mesh>
      <sphereGeometry args={[size * 1.08, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.BackSide}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

export function Planet({
  repo,
  index,
  orbitPaused,
  setOrbitPaused,
  contributors,
}: {
  repo: any;
  index: number;
  orbitPaused: boolean;
  setOrbitPaused: (val: boolean) => void;
  contributors: any[];
}) {
  const orbitContainerRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const angleRef = useRef(index * 2);

  const orbitRadius = 6 + (index * 2.5);
  const speed = 0.5 / (1 + index * 0.05);
  const size = Math.max(0.5, Math.min(Math.log10(repo.size || 10) * 0.4, 3));
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;

  const hasRings = repo.stargazers_count > 10;
  const planetType = useMemo(() => index % 5, [index]);

  const roughness = [0.6, 0.3, 0.8, 0.1, 0.5][planetType];
  const metalness = [0.1, 0.5, 0.0, 0.9, 0.2][planetType];

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'crosshair';
    return () => { document.body.style.cursor = 'crosshair'; };
  }, [hovered]);

  useFrame((_, delta) => {
    if (!orbitPaused) {
      angleRef.current += speed * delta;
      if (planetMeshRef.current) planetMeshRef.current.rotation.y += delta * 0.4;
    }

    if (orbitContainerRef.current) {
      orbitContainerRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      orbitContainerRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
  });

  const updatedAt = useMemo(() => {
    if (!repo.updated_at) return null;
    return new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }, [repo.updated_at]);

  const createdAt = useMemo(() => {
    if (!repo.created_at) return null;
    return new Date(repo.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  }, [repo.created_at]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 128]} />
        <meshBasicMaterial color={color} opacity={hovered ? 0.4 : 0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={orbitContainerRef}>
        <PlanetAtmosphere size={size} color={color} />

        <mesh
          ref={planetMeshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setOrbitPaused(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setOrbitPaused(false); }}
          onClick={(e) => { e.stopPropagation(); window.open(repo.html_url, '_blank'); }}
          scale={hovered ? 1.15 : 1}
        >
          <sphereGeometry args={[size, 64, 64]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 1.2 : 0.15}
            roughness={roughness}
            metalness={metalness}
          />
        </mesh>

        {hasRings && <PlanetRings size={size} color={color} />}

        {!hovered && (
          <Billboard position={[0, size + 0.5, 0]}>
            <Text
              fontSize={0.28}
              color={color}
              anchorX="center"
              anchorY="bottom"
              outlineWidth={0.04}
              outlineColor="#000000"
            >
              {repo.name}
            </Text>
          </Billboard>
        )}

        {contributors.map((contributor, i) => {
          const moonOrbitRadius = size + 1.2 + (i * 0.55);
          const moonSpeed = 1.0 - (i * 0.08);
          const moonSize = 0.14 + Math.min(contributor.contributions / 500, 0.1);
          return (
            <ContributorMoon
              key={contributor.id}
              contributor={contributor}
              orbitRadius={moonOrbitRadius}
              speed={moonSpeed}
              size={moonSize}
              index={i}
              orbitPaused={orbitPaused}
            />
          );
        })}

        {repo.open_issues_count > 0 && (
          <AsteroidBelt
            issueCount={repo.open_issues_count}
            planetRadius={size + (contributors.length * 0.55) + 1.5}
            orbitPaused={orbitPaused}
          />
        )}

        {hovered && (
          <Html distanceFactor={12} center position={[0, size + 2.5, 0]} zIndexRange={[100, 0]}>
            <div className="flex flex-col w-72 bg-slate-900/95 p-4 rounded-xl border border-slate-600 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200 pointer-events-none">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-lg leading-tight">{repo.name}</span>
                <span className="text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider" style={{ backgroundColor: `${color}30`, color: color }}>
                  {repo.language || 'Code'}
                </span>
              </div>

              {repo.description && (
                <p className="text-slate-400 text-xs mb-3 line-clamp-2">{repo.description}</p>
              )}

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">Stars</div>
                  <div className="text-yellow-400 font-mono font-bold">{repo.stargazers_count}</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">Forks</div>
                  <div className="text-blue-400 font-mono font-bold">{repo.forks_count}</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">Issues</div>
                  <div className="text-red-400 font-mono font-bold">{repo.open_issues_count}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                {createdAt && (
                  <div className="bg-slate-800/40 rounded p-2">
                    <div className="text-slate-500 text-[10px] uppercase">Created</div>
                    <div className="text-slate-300 font-mono">{createdAt}</div>
                  </div>
                )}
                {updatedAt && (
                  <div className="bg-slate-800/40 rounded p-2">
                    <div className="text-slate-500 text-[10px] uppercase">Updated</div>
                    <div className="text-slate-300 font-mono">{updatedAt}</div>
                  </div>
                )}
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {repo.topics.slice(0, 5).map((topic: string) => (
                      <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full font-mono" style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}30` }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {contributors.length > 0 && (
                <div>
                  <div className="text-slate-500 text-[10px] uppercase mb-1.5">Repo Contributors</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {contributors.map((c) => (
                      <div key={c.id} className="flex flex-col items-center gap-0.5">
                        <img src={c.avatar_url} alt={c.login} title={`@${c.login} — ${c.contributions} commits`} className="w-6 h-6 rounded-full border border-slate-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 w-full bg-white/10 text-white/50 font-bold py-2 rounded-lg text-sm text-center border border-white/20 animate-pulse">
                [ Click to Open Repo ]
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}