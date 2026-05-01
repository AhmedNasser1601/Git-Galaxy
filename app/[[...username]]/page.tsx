// app/[[...username]]/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { HUD } from '@/components/HUD';
import { GalaxyCanvas } from '@/components/GalaxyCanvas';

export default function GitGalaxy() {
  const params = useParams();
  const router = useRouter();

  // 1. Read the URL. If the user goes to /ahmednasser1601, it captures it.
  const initialUser = params?.username ? (params.username as string[])[0] : "";

  // 2. Set the initial state to the URL parameter
  const [searchInput, setSearchInput] = useState(initialUser);
  const [activeUser, setActiveUser] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orbitPaused, setOrbitPaused] = useState(false);

  useEffect(() => {
    if (!searchInput) {
      setRepos([]);
      setActiveUser("");
      router.replace('/'); // Clean up the URL if the search box is empty
      return;
    }

    // 3. BONUS: Silently update the browser URL when typing a new search!
    if (searchInput !== initialUser) {
      router.replace(`/${searchInput}`);
    }
    
    setLoading(true);
    setError("");

    const delayDebounceFn = setTimeout(async () => {
      try {
        // Verify user exists
        const userRes = await fetch(`https://api.github.com/users/${searchInput}`);
        if (!userRes.ok) {
          throw new Error("Signal lost: Commander not found in the GitHub database.");
        }

        // Infinite Fetching Loop
        let allRepos: any[] = [];
        let page = 1;
        let keepFetching = true;

        while (keepFetching) {
          const res = await fetch(`https://api.github.com/users/${searchInput}/repos?sort=pushed&per_page=100&page=${page}`);
          if (!res.ok) throw new Error("API rate limit exceeded.");
          
          const data = await res.json();
          allRepos = [...allRepos, ...data];
          
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
        setActiveUser(""); 
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, initialUser, router]); // Added router and initialUser to dependencies

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
