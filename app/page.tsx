"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
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

function CentralStar({ liveUsername }: { liveUsername: string }) {
  const starMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    if (starMaterialRef.current) {
      const hue = (clock.getElapsedTime() * 0.1) % 1;
      starMaterialRef.current.color.setHSL(hue, 0.8, 0.5);
      starMaterialRef.current.emissive.setHSL(hue, 0.8, 0.5);
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial ref={starMaterialRef} emissiveIntensity={2} />
      <Html distanceFactor={15} center position={[0, 3.5, 0]}>
        <div className="text-white text-lg font-bold bg-black/50 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
          @{liveUsername || "awaiting_input..."}
        </div>
      </Html>
    </mesh>
  );
}

function Planet({ repo, index, setActiveRepo, activeRepo }: any) {
  const orbitContainerRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const orbitRadius = 6 + (index * 4);
  const speed = 0.5 - (index * 0.015);
  const size = Math.max(0.4, Math.min(Math.log10(repo.size || 10) * 0.3, 2.5)); 
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
  const isActive = activeRepo?.id === repo.id;

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
      {/* Orbit Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial color={isActive ? color : "#ffffff"} opacity={isActive ? 0.3 : 0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={orbitContainerRef}>
        {/* Selection Ring (Only visible when clicked) */}
        {isActive && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size + 0.3, size + 0.4, 32]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* The Planet */}
        <mesh 
          ref={planetMeshRef}
          onClick={(e) => {
            e.stopPropagation(); // Prevents click from passing through to the background
            setActiveRepo(isActive ? null : repo); // Toggle selection
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'crosshair';
          }}
          scale={hovered || isActive ? 1.2 : 1}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} emissive={color} emissiveIntensity={hovered || isActive ? 0.4 : 0} />
        </mesh>
        
        {/* Quick Hover Tooltip */}
        {hovered && !isActive && (
          <Html distanceFactor={15} center position={[0, size + 1.2, 0]} zIndexRange={[100, 0]}>
            <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-700 backdrop-blur-md text-white text-sm font-bold shadow-xl whitespace-nowrap pointer-events-none">
              {repo.name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

// --- MAIN APPLICATION INTERFACE ---

export default function GitGalaxy() {
  const [liveInput, setLiveInput] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [activeRepo, setActiveRepo] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Live-Typing Auto-Fetch (Debounced)
  useEffect(() => {
    if (!liveInput) return;

    // Reset selection when searching a new user
    setActiveRepo(null);

    // Wait 1.2 seconds after the user stops typing before fetching
    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setError("");
      
      try {
        const res = await fetch(`https://api.github.com/users/${liveInput}/repos?sort=pushed&per_page=30`);
        if (!res.ok) throw new Error("User not found.");
        const data = await res.json();
        setRepos(data);
        setActiveUser(liveInput);
      } catch (err: any) {
        setRepos([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 1200);

    return () => clearTimeout(delayDebounceFn); // Cleanup timer if user types again
  }, [liveInput]);

  // Click background to deselect planet
  const handleCanvasClick = () => {
    if (activeRepo) setActiveRepo(null);
  };

  return (
    <div className="w-screen h-screen bg-[#020205] overflow-hidden relative font-sans">
      
      {/* 3D CANVAS */}
      <Canvas onClick={handleCanvasClick} camera={{ position: [0, 30, 50], fov: 45 }} className="absolute inset-0 z-0">
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 0]} intensity={200} color="#ffffff" distance={200} />
        <Stars radius={150} depth={50} count={8000} factor={5} saturation={1} fade speed={0.5} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={!activeRepo} autoRotateSpeed={0.3} />
        
        <CentralStar liveUsername={liveInput} />
        
        {repos.map((repo, index) => (
          <Planet key={repo.id} repo={repo} index={index} activeRepo={activeRepo} setActiveRepo={setActiveRepo} />
        ))}
      </Canvas>
      
      {/* TOP LEFT BRANDING */}
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <h1 className="text-white text-4xl font-black tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">GIT-GALAXY</h1>
        <div className="flex items-center gap-3 mt-2">
           <div className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
           <p className="text-slate-400 font-mono text-xs tracking-wider">
             {loading ? 'SCANNING SECTOR...' : 'SYSTEM READY'}
           </p>
        </div>
      </div>

      {/* TOP RIGHT SEARCH INPUT */}
      <div className="absolute top-8 right-8 z-10 w-80">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Type a username..." 
            value={liveInput}
            onChange={(e) => setLiveInput(e.target.value)}
            className="w-full bg-slate-900/40 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-500/80 focus:bg-slate-900/80 backdrop-blur-md shadow-2xl transition-all font-mono"
          />
          {loading && <div className="absolute right-4 w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>}
        </div>
        {error && <p className="text-red-400 text-xs font-mono mt-2 ml-2">{error}</p>}
      </div>

      {/* RIGHT SIDE DATA PANEL (Visible only when a planet is clicked) */}
      {activeRepo && (
        <div className="absolute top-1/4 right-8 z-20 w-80 bg-slate-900/80 border border-slate-600 rounded-2xl p-6 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-right-8 fade-in duration-300 text-white">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold leading-tight break-words">{activeRepo.name}</h2>
            <button onClick={() => setActiveRepo(null)} className="text-slate-400 hover:text-white transition-colors">
              ✕
            </button>
          </div>
          
          <p className="text-slate-300 text-sm mb-6 line-clamp-3">
            {activeRepo.description || "No description provided for this repository."}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Language</span>
              <span className="font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_COLORS[activeRepo.language] || LANGUAGE_COLORS.Default }}></div>
                {activeRepo.language || 'N/A'}
              </span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Size</span>
              <span className="font-semibold">{(activeRepo.size / 1024).toFixed(2)} MB</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Stars</span>
              <span className="font-semibold text-yellow-400">⭐ {activeRepo.stargazers_count}</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <span className="text-xs text-slate-400 font-mono uppercase block mb-1">Issues</span>
              <span className="font-semibold text-red-400">🐛 {activeRepo.open_issues_count}</span>
            </div>
          </div>

          <a 
            href={activeRepo.html_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full text-center bg-white text-black font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg"
          >
            Visit Repository 🚀
          </a>
        </div>
      )}

    </div>
  );
}
