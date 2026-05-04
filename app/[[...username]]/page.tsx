"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HUD } from '@/components/HUD';
import { GalaxyCanvas } from '@/components/GalaxyCanvas';

export default function GitGalaxy() {
  const params = useParams();

  const initialUser = params?.username ? (params.username as string[])[0] : "";

  const [searchInput, setSearchInput] = useState(initialUser);
  const [activeUser, setActiveUser] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [contributors, setContributors] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orbitPaused, setOrbitPaused] = useState(false);

  useEffect(() => {
    if (!searchInput) {
      setRepos([]);
      setContributors({});
      setActiveUser("");
      setUserProfile(null);
      window.history.replaceState(null, '', '/');
      return;
    }

    if (searchInput !== initialUser) {
      window.history.replaceState(null, '', `/${searchInput}`);
    }

    setLoading(true);
    setError("");

    const delayDebounceFn = setTimeout(async () => {
      try {
        const userRes = await fetch(`https://api.github.com/users/${searchInput}`);
        if (!userRes.ok) {
          throw new Error("Signal lost: Commander not found in the GitHub database.");
        }
        const profileData = await userRes.json();
        setUserProfile(profileData);

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

        const contribMap: Record<number, any[]> = {};
        const topRepos = allRepos.slice(0, 20);

        await Promise.all(
          topRepos.map(async (repo) => {
            try {
              const res = await fetch(`https://api.github.com/repos/${searchInput}/${repo.name}/contributors?per_page=8`);
              if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                  contribMap[repo.id] = data.slice(0, 6);
                }
              }
            } catch {
              contribMap[repo.id] = [];
            }
          })
        );

        setContributors(contribMap);
      } catch (err: any) {
        setError(err.message);
        setRepos([]);
        setContributors({});
        setActiveUser("");
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, initialUser]);

  return (
    <div className="w-screen h-screen bg-[#020205] overflow-hidden relative">
      <GalaxyCanvas
        repos={repos}
        contributors={contributors}
        activeUser={activeUser}
        userProfile={userProfile}
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
