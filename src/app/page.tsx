'use client';

import { useState, useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useFarcaster } from '@/providers/Providers';
import { ScoreRing } from '@/components/ScoreRing';
import { composeCast, hapticFeedback } from '@/lib/farcaster';
import { getScoreLevel, getScoreLabel } from '@/lib/neynar';

type UserData = {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio: string;
  followerCount: number;
  followingCount: number;
  powerBadge: boolean;
  neynarScore: number;
  verifiedAddresses?: string[];
};

export default function Home() {
  const { context, isLoading: isFarcasterLoading, isInMiniApp, isReady } = useFarcaster();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  // Add Mini App state
  const [isAdded, setIsAdded] = useState(false);
  const [showAddPrompt, setShowAddPrompt] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Ensure client-side only rendering
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if app is already added and show prompt
  useEffect(() => {
    if (mounted && isReady && isInMiniApp && context) {
      // Check context for added status using type assertion
      const client = context.client as { added?: boolean } | undefined;
      if (client?.added) {
        setIsAdded(true);
      } else {
        // Show add prompt after a short delay
        const timer = setTimeout(() => {
          setShowAddPrompt(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [mounted, isReady, isInMiniApp, context]);

  // Auto-load logged-in user's data when in mini app
  useEffect(() => {
    if (mounted && isReady && context?.user?.fid) {
      loadUser(context.user.fid);
    }
  }, [mounted, isReady, context?.user?.fid]);

  const loadUser = async (fid: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/user?fid=${fid}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to load user');
      }

      setUser(data.user);
      hapticFeedback('notification');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery.trim(), limit: 1 }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'User not found');
      }

      if (data.users && data.users.length > 0) {
        setUser(data.users[0]);
        setSearchQuery('');
        hapticFeedback('notification');
      } else {
        throw new Error('User not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!user) return;

    hapticFeedback('impact');
    
    const level = getScoreLevel(user.neynarScore);
    const label = getScoreLabel(level);
    const scorePercent = (user.neynarScore * 100).toFixed(0);
    
    const text = `🔮 My Neynar Score: ${scorePercent}% (${label})\n\nCheck your Farcaster reputation score!`;
    
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://neynar-score-checkerv2.vercel.app';
    
    await composeCast(text, [appUrl]);
  };

  // Add Mini App handler
  const handleAddMiniApp = useCallback(async () => {
    try {
      setIsAdding(true);
      hapticFeedback('impact');
      
      const result = await sdk.actions.addMiniApp();
      
      // Handle result based on SDK response
      if ('added' in result && result.added === true) {
        setIsAdded(true);
        setShowAddPrompt(false);
        hapticFeedback('notification');
        
        // Save notification details if provided
        if ('notificationDetails' in result && result.notificationDetails && context?.user?.fid) {
          const notifDetails = result.notificationDetails as { url: string; token: string };
          
          // Save to backend for later use
          try {
            await fetch('/api/webhook', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                event: 'frame_added',
                fid: context.user.fid,
                notificationDetails: notifDetails,
              }),
            });
            console.log('Notification details saved for fid:', context.user.fid);
          } catch (err) {
            console.error('Failed to save notification details:', err);
          }
        }
      } else if ('reason' in result) {
        // Still hide the prompt if user rejected
        if (result.reason === 'rejected_by_user') {
          setShowAddPrompt(false);
        }
      }
    } catch (err) {
      console.error('Add mini app error:', err);
    } finally {
      setIsAdding(false);
    }
  }, [context?.user?.fid]);

  // Dismiss add prompt
  const dismissAddPrompt = useCallback(() => {
    setShowAddPrompt(false);
  }, []);

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Don't render until mounted (prevents hydration issues)
  if (!mounted) {
    return null;
  }

  // Show loading state while Farcaster SDK initializes
  if (isFarcasterLoading || !isReady) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🔮</div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] pb-20">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <span className="text-xl">🔮</span>
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">Neynar Score</h1>
            <p className="text-xs text-gray-400">Farcaster Reputation</p>
          </div>
        </div>
        
        {/* Added indicator */}
        {isAdded && (
          <div className="px-3 py-1.5 bg-green-500/20 rounded-full text-xs text-green-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Saved</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="p-4 flex flex-col items-center">
        {/* Error State */}
        {error && (
          <div className="w-full max-w-md bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-300 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center">
            <div className="text-5xl mb-4 animate-pulse">🔮</div>
            <p className="text-gray-400">Loading score...</p>
          </div>
        )}

        {/* User Score Card */}
        {user && !isLoading && (
          <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.pfpUrl || '/images/icon.png'}
                alt={user.displayName}
                className="w-16 h-16 rounded-full border-2 border-purple-500/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/icon.png';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-white text-lg truncate">
                    {user.displayName}
                  </h2>
                  {user.powerBadge && <span className="text-purple-400">⚡</span>}
                </div>
                <p className="text-gray-400 text-sm">@{user.username}</p>
                <p className="text-gray-500 text-xs">FID: {user.fid}</p>
              </div>
            </div>

            {/* Verified Address */}
            {user.verifiedAddresses && user.verifiedAddresses.length > 0 && (
              <div className="mb-4 p-3 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs text-gray-400">Verified Address</span>
                </div>
                <p className="text-sm text-white font-mono mt-1">
                  {formatAddress(user.verifiedAddresses[0])}
                </p>
              </div>
            )}

            {/* Score Ring */}
            <div className="flex justify-center mb-6">
              <ScoreRing score={user.neynarScore || 0} size={180} />
            </div>

            {/* Score Label */}
            <div className="text-center mb-6">
              <span className={`
                px-4 py-2 rounded-full text-sm font-medium
                ${(user.neynarScore || 0) >= 0.8 ? 'bg-green-500/20 text-green-400' :
                  (user.neynarScore || 0) >= 0.6 ? 'bg-blue-500/20 text-blue-400' :
                  (user.neynarScore || 0) >= 0.4 ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'}
              `}>
                {getScoreLabel(getScoreLevel(user.neynarScore || 0))}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{(user.followerCount || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">Followers</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-white">{(user.followingCount || 0).toLocaleString()}</p>
                <p className="text-xs text-gray-400">Following</p>
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl text-white font-medium transition-all"
            >
              📤 Share My Score
            </button>
          </div>
        )}

        {/* Empty State - Search */}
        {!user && !isLoading && !error && (
          <div className="w-full max-w-md text-center">
            <div className="text-6xl mb-6 animate-bounce">🔮</div>
            <h2 className="text-2xl font-bold text-white mb-2">Check Your Score</h2>
            <p className="text-gray-400 mb-6">
              {isInMiniApp
                ? 'Search for any Farcaster user to see their Neynar score.'
                : 'Open in Farcaster to auto-load your score, or search below.'}
            </p>
          </div>
        )}

        {/* Search Box - Always visible when not loading */}
        {!isLoading && (
          <div className="w-full max-w-md mt-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchUser()}
                placeholder="Search username..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
              />
              <button
                onClick={searchUser}
                disabled={!searchQuery.trim()}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-colors"
              >
                🔍
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Mini App Prompt */}
      {showAddPrompt && !isAdded && isInMiniApp && (
        <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 shadow-2xl shadow-purple-500/30">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🔮</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-base">Save to your apps</h3>
                <p className="text-white/70 text-sm mt-0.5">
                  Quick access & get notifications
                </p>
              </div>
              <button
                onClick={dismissAddPrompt}
                className="text-white/60 hover:text-white p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={handleAddMiniApp}
              disabled={isAdding}
              className="w-full mt-3 py-2.5 bg-white text-purple-600 font-semibold rounded-xl hover:bg-white/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span>➕</span>
                  <span>Add to Warpcast</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center bg-gradient-to-t from-[#0f0f1a] to-transparent">
        <p className="text-xs text-gray-500">
          Powered by Neynar & Farcaster
        </p>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </main>
  );
}
