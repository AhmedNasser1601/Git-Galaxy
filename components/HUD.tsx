// components/HUD.tsx
"use client";

interface HUDProps {
  searchInput: string;
  setSearchInput: (val: string) => void;
  loading: boolean;
  error: string;
  repos: any[];
}

export function HUD({
  searchInput,
  setSearchInput,
  loading,
  error,
  repos,
}: HUDProps) {
  return (
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
              <div
                className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 text-red-400 text-xs font-mono bg-red-900/20 px-4 py-3 rounded-lg border border-red-900/50 backdrop-blur-md">
            ⚠ {error}
          </div>
        )}

        {repos.length > 0 && (
          <div className="mt-4 bg-slate-900/60 border border-slate-700 rounded-xl p-4 backdrop-blur-md text-white shadow-2xl animate-in fade-in duration-500">
            <h2 className="text-sm text-slate-400 font-mono mb-2 uppercase tracking-wider">
              System Scan Complete
            </h2>
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
