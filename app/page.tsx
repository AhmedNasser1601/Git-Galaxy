// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { HUD } from "@/components/HUD";
import { GalaxyCanvas } from "@/components/GalaxyCanvas";

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
        const res = await fetch(
          `https://api.github.com/users/${searchInput}/repos?sort=pushed&per_page=25`
        );
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
