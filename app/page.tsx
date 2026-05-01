// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { HUD } from '@/components/HUD';
import { GalaxyCanvas } from '@/components/GalaxyCanvas';

export default function GitGalaxy() {
  const [searchInput, setSearchInput] = useState("");
  const [activeUser, setActiveUser] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orbitPaused, setOrbitPaused] = useState(false);

  useEffect(() => {
    if (!searchInput) {
      setRepos([]);
      setActiveUser("");
      return;
    }
    
    setLoading(true);
    setError("");

    const delayDebounceFn = setTimeout(async () => {
      try {
        // 1. First, verify the user actually exists to handle 404s cleanly
        const userRes = await fetch(`https://api.github.com/users/${searchInput}`);
        if (!userRes.ok) {
          throw new Error("Signal lost: Commander not found in the GitHub database.");
        }

        // 2. Fetch ALL repositories using pagination (Capped at 5 pages/500 repos to prevent crashes)
        let allRepos: any[] = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
          const res = await fetch(`https://api.github.com/users/${searchInput}/repos?sort=pushed&per_page=100&page=${page}`);
          if (!res.ok) throw new Error("API rate limit exceeded.");
          
          const data = await res.json();
          allRepos = [...allRepos, ...data];
          
          // If we got less than 100 items, it means we hit the last page!
          if (data.length < 100 || page >= 5) {
            keepFetching = false;
          } else {
            page++;
          }
        }

        setRepos(allRepos);
        setActiveUser(searchInput);
      } catch (err: any) {
        setError(err.message);
        setRepos([]);
        setActiveUser(""); // Clear the active user so the central star disappears on error
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  return (
    <div className="w-screen h-screen bg-[#020205] overflow-hidden relative">
      <GalaxyCanvas 
        repos={repos} 
        activeUser={activeUser} 
        orbitPaused={orbitPaused} 
        setOrbitPaused={setOrbitPaused} 
      />
      <HUD 
        searchInput={searchInput} 
        setSearchInput={setSearchInput} 
        loading={loading} 
        error={error} 
        repos={repos} 
      />
    </div>
  );
}
