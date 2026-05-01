"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useRef, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';

// --- DATA & CONFIGURATION ---
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572A5", Java: "#b07219",
  "C#": "#178600", HTML: "#e34c26", CSS: "#563d7c", Ruby: "#701516", Go: "#00ADD8",
  Rust: "#dea584", C: "#555555", "C++": "#f34b7d", PHP: "#4F5D95", Swift: "#F05138",
  Default: "#8b949e"
};

// --- 3D COMPONENTS ---

function CentralStar({ username }: { username: string }) {
  return (
    <mesh>
      <sphereGeometry args={[2.5, 64, 64]} />
      {/* High emissive intensity triggers the Bloom effect */}
      <meshStandardMaterial color="#fcd34d" emissive="#fcd34d" emissiveIntensity={4} />
      <Html distanceFactor={15} center position={[0, 4, 0]}>
        <div className="text-white text-xl font-black bg-black/60 px-5 py-2 rounded-full border border-yellow-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(252,211,77,0.5)]">
          @{username || "git-galaxy"}
        </div>
      </Html>
    </mesh>
  );
}

function Planet({ repo, index, setOrbitPaused }: { repo: any, index: number, setOrbitPaused: (val: boolean) => void }) {
  const orbitContainerRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const orbitRadius = 8 + (index * 4.5); 
  const speed = 0.4 - (index * 0.015); 
  const size = Math.max(0.5, Math.min(Math.log10(repo.size || 10) * 0.4, 3)); 
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (orbitContainerRef.current) {
      orbitContainerRef.current.position.x = Math.cos(elapsedTime * speed) * orbitRadius;
      orbitContainerRef.current.position.z = Math.sin(elapsedTime * speed) * orbitRadius;
    }
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* Orbit Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.05, orbitRadius + 0.05, 128]} />
        <meshBasicMaterial color={color} opacity={hovered ? 0.4 : 0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={orbitContainerRef}>
        <mesh 
          ref={planetMeshRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); setOrbitPaused(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setOrbitPaused(false); }}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[size, 64, 64]} />
          {/* Planets glow slightly based on their language color */}
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 1.5 : 0.2} roughness={0.2} />
        </mesh>

        {hovered && (
          <Html distanceFactor={12} center position={[0, size + 2, 0]} zIndexRange={[100, 0]}>
            <div className="flex flex-col w-64 bg-slate-900/95 p-4 rounded-xl border border-slate-600 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-bold text-lg leading-tight">{repo.name}</span>
                <span className="text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider" style={{ backgroundColor: `${color}30`, color: color }}>
                  {repo.language || 'Code'}
                </span>
              </div>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2">{repo.description || "No description provided."}</p>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">Stars</div>
                  <div className="text-yellow-400 font-mono font-bold">{repo.stargazers_count}</div>
                </div>
                <div className="bg-slate-800/50 rounded p-2 text-center">
                  <div className="text-slate-400 text-[10px] uppercase">Issues</div>
                  <div className="text-red-400 font-mono font-bold">{repo.open_issues_count}</div>
                </div>
              </div>

              <a 
                href={repo.html_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-white text-black font-bold py-2 rounded-lg text-sm text-center hover:bg-yellow-400 transition-colors shadow-lg cursor-pointer"
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

// --- MAIN APPLICATION INTERFACE ---

export default function GitGalaxy() {
  const [searchInput, setSearchInput] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orbitPaused, setOrbitPaused] = useState(false);

  // Live-Search Telemetry (Debounced)
  useEffect(() => {
    if (!searchInput) return;
    
    setLoading(true);
    setError("");

    // Wait 800ms after the user stops typing before fetching
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${searchInput}/repos?sort=pushed&per_page=25`);
        if (!res.ok) throw new Error("Signal lost: User not found");
        
        const data = await res.json();
        setRepos(data);
        setActiveUser(searchInput);
      } catch (err: any) {
        setError(err.message);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
    <div className="w-screen h-screen bg-[#020205] overflow-hidden relative font-sans text-white">
      
      {/* 3D CANVAS */}
      <Canvas camera={{ position: [0, 40, 60], fov: 45 }} className="absolute inset-0 cursor-crosshair z-0">
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 0]} intensity={250} color="#ffffff" distance={200} />
        
        <Stars radius={150} depth={50} count={10000} factor={6} saturation={1} fade speed={1} />
        
        {/* Dynamic Controls: Pauses when interacting with a planet */}
        <OrbitControls 
          enablePan={true} 
          enableZoom={true} 
          enableRotate={true} 
          autoRotate={!orbitPaused} 
          autoRotateSpeed={0.5} 
          makeDefault
        />
        
        {/* Post-Processing for Sci-Fi Glow */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
        </EffectComposer>

        {repos.length > 0 && <CentralStar username={activeUser} />}
        
        {repos.map((repo, index) => (
          <Planet key={repo.id} repo={repo} index={index} setOrbitPaused={setOrbitPaused} />
        ))}
      </Canvas>
      
      {/* HUD UI (Heads Up Display) */}
      <div className="absolute top-0 left-0 w-full p-8 pointer-events-none z-10 flex justify-between items-start">
        
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-2xl">
            GIT-GALAXY
          </h1>
          <p className="text-yellow-500/70 mt-2 font-mono text-xs tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            ORBITAL TELEMETRY ACTIVE
          </p>
        </div>

        {/* Live Search Terminal */}
        <div className="w-96 pointer-events-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <input 
              type="text" 
              placeholder="Initialize scan (Type a username)..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="relative w-full bg-black/80 border border-slate-700 text-white px-5 py-4 rounded-xl outline-none focus:border-yellow-500 transition-all font-mono shadow-2xl backdrop-blur-xl placeholder:text-slate-500"
            />
            {loading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            )}
          </div>
          
          {error && (
            <div className="mt-4 text-red-400 text-xs font-mono bg-red-900/20 px-4 py-3 rounded-lg border border-red-900/50 backdrop-blur-md">
              ⚠ {error}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
