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

function CentralStar({ username }: { username: string }) {
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
        <div className="text-white text-lg font-bold bg-black/50 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md whitespace-nowrap shadow-lg">
          @{username || "git-galaxy"}
        </div>
      </Html>
    </mesh>
  );
}

function AsteroidBelt({ issueCount, planetRadius }: { issueCount: number, planetRadius: number }) {
  const beltRef = useRef<THREE.Group>(null);
  
  const asteroids = useMemo(() => {
    // Cap asteroids at 50 so it doesn't crash the browser on buggy repos
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

  useFrame(() => {
    if (beltRef.current) beltRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={beltRef}>
      {asteroids.map((rock, i) => (
        <mesh key={i} position={rock.position} rotation={rock.rotation} scale={rock.scale}>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#888888" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Moon({ orbitRadius, speed, size, index }: { orbitRadius: number, speed: number, size: number, index: number }) {
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

function Planet({ repo, index }: { repo: any, index: number }) {
  const orbitContainerRef = useRef<THREE.Group>(null);
  const planetMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Dynamic Math based on GitHub Data
  const orbitRadius = 6 + (index * 4); // Spread them out
  const speed = 0.5 - (index * 0.02); // Outer planets move slower
  // Logarithmic sizing so a 100,000KB repo doesn't cover the sun
  const size = Math.max(0.4, Math.min(Math.log10(repo.size || 10) * 0.3, 2.5)); 
  const color = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default;
  const forks = Math.min(repo.forks_count, 10); // Cap visible moons at 10

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
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.03, orbitRadius + 0.03, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} />
      </mesh>

      <group ref={orbitContainerRef}>
        <mesh 
          ref={planetMeshRef}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          scale={hovered ? 1.1 : 1}
        >
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>

        {Array.from({ length: forks }).map((_, i) => (
          <Moon key={i} index={i} orbitRadius={size + 0.8 + (i * 0.3)} speed={0.8 - (i * 0.05)} size={0.1} />
        ))}

        {repo.open_issues_count > 0 && <AsteroidBelt issueCount={repo.open_issues_count} planetRadius={size} />}
        
        {hovered && (
          <Html distanceFactor={15} center position={[0, size + 1.5, 0]} zIndexRange={[100, 0]}>
            <div className="flex flex-col items-center bg-slate-900/90 px-4 py-3 rounded-xl border border-slate-700 backdrop-blur-md shadow-2xl">
              <span className="text-white font-bold whitespace-nowrap mb-1">{repo.name}</span>
              <div className="flex gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase" style={{ backgroundColor: `${color}30`, color: color }}>
                  {repo.language || 'Unknown'}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">⭐ {repo.stargazers_count}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/40 text-red-400">Issues: {repo.open_issues_count}</span>
              </div>
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

  const fetchGitHubData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput) return;
    
    setLoading(true);
    setError("");
    setRepos([]); // Clear current galaxy

    try {
      // Fetch up to 30 most recently pushed repositories
      const res = await fetch(`https://api.github.com/users/${searchInput}/repos?sort=pushed&per_page=30`);
      if (!res.ok) throw new Error("User not found or API rate limit exceeded");
      
      const data = await res.json();
      setRepos(data);
      setActiveUser(searchInput);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#020205] overflow-hidden relative">
      
      {/* 3D CANVAS */}
      <Canvas camera={{ position: [0, 30, 50], fov: 45 }} className="absolute inset-0 cursor-crosshair z-0">
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 0]} intensity={200} color="#ffffff" distance={200} />
        <Stars radius={150} depth={50} count={8000} factor={5} saturation={1} fade speed={0.5} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={true} autoRotateSpeed={0.3} />
        
        <CentralStar username={activeUser} />
        
        {/* Render a planet for every repository fetched */}
        {repos.map((repo, index) => (
          <Planet key={repo.id} repo={repo} index={index} />
        ))}
      </Canvas>
      
      {/* BRANDING */}
      <div className="absolute top-8 left-8 pointer-events-none z-10">
        <h1 className="text-white text-4xl font-black tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">GIT-GALAXY</h1>
        <p className="text-slate-400 mt-2 font-mono text-sm tracking-wider">ENTER A GITHUB USERNAME</p>
      </div>

      {/* SEARCH INTERFACE (Glassmorphism UI) */}
      <div className="absolute top-8 right-8 z-10 w-80">
        <form onSubmit={fetchGitHubData} className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="e.g., torvalds, facebook" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 text-white px-4 py-3 rounded-xl outline-none focus:border-yellow-500/50 backdrop-blur-md shadow-2xl transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="absolute right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              {loading ? "Warping..." : "Search"}
            </button>
          </div>
          {error && <span className="text-red-400 text-sm font-mono bg-red-900/20 px-3 py-2 rounded-lg border border-red-900/50">{error}</span>}
        </form>
        
        {/* Stats Panel */}
        {repos.length > 0 && (
          <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 backdrop-blur-md text-white shadow-2xl animate-in fade-in duration-500">
            <h2 className="text-sm text-slate-400 font-mono mb-2 uppercase tracking-wider">System Scan Complete</h2>
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
              <span className="font-semibold">Repositories</span>
              <span className="font-mono text-yellow-400">{repos.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Issues (Asteroids)</span>
              <span className="font-mono text-red-400">
                {repos.reduce((acc, repo) => acc + repo.open_issues_count, 0)}
              </span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}