'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/wagmi';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import type { FarcasterContext } from '@/lib/farcaster';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 2,
    },
  },
});

// Farcaster Context
type FarcasterContextValue = {
  context: FarcasterContext | null;
  isLoading: boolean;
  isInMiniApp: boolean;
  isReady: boolean;
};

const FarcasterCtx = createContext<FarcasterContextValue>({
  context: null,
  isLoading: true,
  isInMiniApp: false,
  isReady: false,
});

export function useFarcaster() {
  return useContext(FarcasterCtx);
}

// Farcaster Provider
function FarcasterProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<FarcasterContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInMiniApp, setIsInMiniApp] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initFarcaster() {
      try {
        // Check if we're in a mini app environment by trying to get context
        const ctx = await sdk.context;
        
        if (ctx) {
          setIsInMiniApp(true);
          setContext(ctx as FarcasterContext);
        }
      } catch (error) {
        console.log('Not running in Farcaster Mini App environment');
        setIsInMiniApp(false);
      } finally {
        setIsLoading(false);
      }
    }

    initFarcaster();
  }, []);

  // Call ready() after loading is complete - ALWAYS call this
  useEffect(() => {
    if (!isLoading) {
      // Always call ready() to hide splash screen
      sdk.actions.ready().then(() => {
        console.log('SDK ready called successfully');
        setIsReady(true);
      }).catch((err) => {
        console.log('SDK ready error (might not be in mini app):', err);
        setIsReady(true); // Still set ready for non-mini-app environments
      });
    }
  }, [isLoading]);

  return (
    <FarcasterCtx.Provider value={{ context, isLoading, isInMiniApp, isReady }}>
      {children}
    </FarcasterCtx.Provider>
  );
}

// Combined Providers
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <FarcasterProvider>{children}</FarcasterProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
