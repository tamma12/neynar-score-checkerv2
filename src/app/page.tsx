'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { motion, AnimatePresence } from 'framer-motion';
import ScoreRing from '@/components/ScoreRing';
import UserCard from '@/components/UserCard';
import SearchInput from '@/components/SearchInput';
import WalletConnect from '@/components/WalletConnect';
import { getScoreLevel, getScoreTips } from '@/lib/neynar';

interface UserData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  bio?: string;
  followerCount: number;
  followingCount: number;
  score: number;
}

interface FarcasterContext {
  user?: {
    fid: number;
    username?: string;
    displayName?: string;
    pfpUrl?: string;
  };
  client?: {
    added?: boolean;
  };
}

export default function Home() {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  
  // Ref to track if we've already prompted addMiniApp this session
  const hasPromptedAdd = useRef(false);

  // Initialize SDK and load context
  useEffect(() => {
    const initSDK = async () => {
      try {
        // Load SDK context
        const ctx = await sdk.context;
        setContext(ctx as FarcasterContext);
        setIsSDKLoaded(true);

        // Signal that app is ready (removes splash screen)
        await sdk.actions.ready();
      } catch (err) {
        console.error('Failed to initialize SDK:', err);
        setIsSDKLoaded(true);
        // Still call ready even if context fails
        try {
          await sdk.actions.ready();
        } catch {}
      }
    };

    initSDK();

    // Cleanup listeners on unmount
    return () => {
      sdk.removeAllListeners();
    };
  }, []);

  // Auto-prompt addMiniApp if user hasn't added the app yet
  // This happens ONCE per session, immediately after SDK is loaded
  useEffect(() => {
    const promptAddMiniApp = async () => {
      // Only prompt if:
      // 1. SDK is loaded
      // 2. We have context
      // 3. User has NOT added the app yet
      // 4. We haven't prompted this session yet
      if (
        isSDKLoaded &&
        context &&
        context.client?.added === false &&
        !hasPromptedAdd.current
      ) {
        hasPromptedAdd.current = true; // Mark as prompted

        try {
          // This will show the native Farcaster "Add Mini App" dialog
          const result = await sdk.actions.addMiniApp();
          console.log('AddMiniApp result:', result);
          
          // Update context to reflect the change
          if (result) {
            setContext(prev => prev ? {
              ...prev,
              client: { ...prev.client, added: true }
            } : null);
          }
        } catch (err: any) {
          // User rejected or error occurred
          // This is fine - don't show error to user
          console.log('AddMiniApp declined or failed:', err?.message || err);
        }
      }
    };

    promptAddMiniApp();
  }, [isSDKLoaded, context]);

  // Listen to SDK events for frame added/removed
  useEffect(() => {
    if (!isSDKLoaded) return;

    const handleFrameAdded = (data: { notificationDetails?: any }) => {
      console.log('Frame added event:', data);
      setContext(prev => prev ? {
        ...prev,
        client: { ...prev.client, added: true }
      } : null);
    };

    const handleFrameRemoved = () => {
      console.log('Frame removed event');
      setContext(prev => prev ? {
        ...prev,
        client: { ...prev.client, added: false }
      } : null);
    };

    sdk.on('frameAdded', handleFrameAdded);
    sdk.on('frameRemoved', handleFrameRemoved);

    return () => {
      sdk.removeAllListeners();
    };
  }, [isSDKLoaded]);

  // Fetch user data when context is available
  useEffect(() => {
    const fetchUserData = async () => {
      if (!context?.user?.fid) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/user?fid=${context.user.fid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your score. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isSDKLoaded && context) {
      fetchUserData();
    }
  }, [isSDKLoaded, context]);

  // Search for a user
  const handleSearch = useCallback(async (username: string) => {
    if (!username.trim()) {
      setSearchedUser(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/user?username=${encodeURIComponent(username)}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError(`User @${username} not found`);
          setSearchedUser(null);
          return;
        }
        throw new Error('Failed to search user');
      }

      const data = await response.json();
      setSearchedUser(data);
    } catch (err) {
      console.error('Error searching user:', err);
      setError('Failed to search user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Share score to Farcaster
  const handleShare = useCallback(async () => {
    const displayUser = searchedUser || userData;
    if (!displayUser) return;

    const scorePercent = Math.round(displayUser.score * 100);
    const level = getScoreLevel(displayUser.score);
    
    const levelEmoji = {
      excellent: '🏆',
      good: '⭐',
      average: '📊',
      low: '📈'
    }[level];

    try {
      await sdk.actions.composeCast({
        text: `${levelEmoji} My Neynar Score: ${scorePercent}/100\n\nCheck your Farcaster reputation score!`,
        embeds: [process.env.NEXT_PUBLIC_APP_URL || 'https://neynar-score-checkerv2.vercel.app']
      });
      
      // Haptic feedback
      sdk.haptics?.notificationOccurred?.('success');
    } catch (err) {
      console.error('Failed to compose cast:', err);
    }
  }, [searchedUser, userData]);

  // Reset to show own score
  const handleReset = useCallback(() => {
    setSearchedUser(null);
    setShowSearch(false);
    setError(null);
  }, []);

  const displayUser = searchedUser || userData;
  const scoreLevel = displayUser ? getScoreLevel(displayUser.score) : 'average';
  const tips = displayUser ? getScoreTips(displayUser.score) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-neynar-dark via-neynar-darker to-black text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-neynar-purple/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-farcaster-purple/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-neynar-purple to-farcaster-purple rounded-xl flex items-center justify-center">
              <span className="text-xl">🔮</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">Neynar Score</h1>
              <p className="text-xs text-gray-400">Farcaster Reputation</p>
            </div>
          </div>
          
          <WalletConnect />
        </header>

        {/* Search toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <span>🔍</span>
            <span>{showSearch ? 'Hide Search' : 'Search User'}</span>
          </button>
          
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4">
                  <SearchInput onSearch={handleSearch} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Main content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-neynar-purple/30 border-t-neynar-purple rounded-full animate-spin" />
              <p className="mt-4 text-gray-400">Loading score...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-10"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">😕</span>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          ) : displayUser ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* User card */}
              <UserCard user={displayUser} isSearchResult={!!searchedUser} />

              {/* Score ring */}
              <div className="flex justify-center py-4">
                <ScoreRing score={displayUser.score} size={200} />
              </div>

              {/* Score level badge */}
              <div className="text-center">
                <span className={`
                  inline-block px-4 py-2 rounded-full text-sm font-semibold
                  ${scoreLevel === 'excellent' ? 'bg-green-500/20 text-green-400' : ''}
                  ${scoreLevel === 'good' ? 'bg-blue-500/20 text-blue-400' : ''}
                  ${scoreLevel === 'average' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                  ${scoreLevel === 'low' ? 'bg-red-500/20 text-red-400' : ''}
                `}>
                  {scoreLevel === 'excellent' && '🏆 Excellent Score!'}
                  {scoreLevel === 'good' && '⭐ Good Score'}
                  {scoreLevel === 'average' && '📊 Average Score'}
                  {scoreLevel === 'low' && '📈 Room to Grow'}
                </span>
              </div>

              {/* Tips */}
              {tips.length > 0 && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">💡 Tips to improve</h3>
                  <ul className="space-y-2">
                    {tips.map((tip, index) => (
                      <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-neynar-purple">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {searchedUser && (
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium"
                  >
                    My Score
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-neynar-purple to-farcaster-purple hover:opacity-90 rounded-xl transition-opacity font-medium flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Score
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-user"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-white/5 rounded-full flex items-center justify-center">
                <span className="text-4xl">🔮</span>
              </div>
              <h2 className="text-xl font-semibold mb-2">Welcome!</h2>
              <p className="text-gray-400 mb-6">
                Open this app in Farcaster to check your score, or search for any user above.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Powered by{' '}
            <a 
              href="https://neynar.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neynar-purple hover:underline"
            >
              Neynar
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}
