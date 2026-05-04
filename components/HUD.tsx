"use client";

import { useState } from 'react';

interface HUDProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  loading: boolean;
  error: string;
  repos: any[];
}

export function HUD({ searchInput, setSearchInput, loading, error, repos }: HUDProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="absolute top-0 left-0 w-full p-8 pointer-events-none z-10 flex justify-between items-start font-sans">
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-2xl">
            GIT-GALAXY
          </h1>
          <p className="text-yellow-500/70 mt-2 font-mono text-xs tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
            ORBITAL TELEMETRY ACTIVE
          </p>
        </div>

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
            <div className="mt-4 text-red-400 text-sm font-mono bg-red-900/40 px-4 py-3 rounded-xl border border-red-500/50 backdrop-blur-xl shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <span className="font-bold">WARNING:</span> {error}
            </div>
          )}

          {repos.length > 0 && (
            <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 backdrop-blur-md text-white shadow-2xl animate-in fade-in duration-500">
              <h2 className="text-sm text-slate-400 font-mono mb-3 uppercase tracking-wider">System Scan Complete</h2>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <span className="font-semibold">Total Repositories</span>
                <span className="font-mono text-white font-bold">{repos.length}</span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2">
                <span className="font-semibold text-yellow-400">Total Stars</span>
                <span className="font-mono text-yellow-400 font-bold">
                  {repos.reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0)}
                </span>
              </div>

              <div className="flex justify-between items-center mb-5">
                <span className="font-semibold text-red-400">Total Issues</span>
                <span className="font-mono text-red-400 font-bold">
                  {repos.reduce((acc, repo) => acc + (repo.open_issues_count || 0), 0)}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold py-2 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
              >
                {copied ? "Copied to Clipboard!" : "Share This System"}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-6 left-6 pointer-events-auto z-10">
        <a
          href="https://github.com/ahmednasser1601"
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-500 hover:text-white font-mono text-[10px] sm:text-xs tracking-widest transition-colors flex items-center gap-2 bg-black/40 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-2xl hover:border-white/30 hover:bg-black/60"
        >
          DEVELOPED BY @AHMEDNASSER1601
        </a>
      </div>
    </>
  );
}