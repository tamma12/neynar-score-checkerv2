'use client';

import { useState, useEffect, useRef } from 'react';

type SearchResult = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  followerCount: number;
  neynarScore: number;
};

type SearchInputProps = {
  onSelect: (fid: number) => void;
  placeholder?: string;
};

export function SearchInput({
  onSelect,
  placeholder = 'Search by username...',
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const res = await fetch('/api/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, limit: 5 }),
          });
          const data = await res.json();
          setResults(data.users || []);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (user: SearchResult) => {
    setQuery(user.username);
    setShowResults(false);
    onSelect(user.fid);
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'text-emerald-400';
    if (score >= 0.65) return 'text-green-400';
    if (score >= 0.5) return 'text-yellow-400';
    if (score >= 0.35) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
        />
        
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden z-50">
          {results.map((user) => (
            <button
              key={user.fid}
              onClick={() => handleSelect(user)}
              className="w-full flex items-center gap-3 p-3 hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0">
                <img
                  src={user.pfpUrl || '/images/icon.png'}
                  alt={user.displayName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon.png'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{user.displayName}</div>
                <div className="text-sm text-gray-400">@{user.username}</div>
              </div>
              <div className={`font-mono font-bold ${getScoreColor(user.neynarScore)}`}>
                {(user.neynarScore * 100).toFixed(0)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
