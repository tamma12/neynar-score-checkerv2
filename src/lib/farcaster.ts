import { sdk } from '@farcaster/miniapp-sdk';

export type FarcasterUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  verifiedAddresses?: {
    ethAddresses?: string[];
    solAddresses?: string[];
  };
};

export type FarcasterContext = {
  user?: FarcasterUser;
  client?: {
    clientFid?: number;
    clientUrl?: string;
  };
  location?: {
    type: string;
    cast?: {
      fid: number;
      hash: string;
    };
  };
};

// Initialize and setup the Mini App SDK
export async function initializeMiniApp(): Promise<boolean> {
  try {
    // Call ready() to hide splash screen
    await sdk.actions.ready();
    return true;
  } catch (error) {
    console.error('Failed to initialize Mini App SDK:', error);
    return false;
  }
}

// Get the Farcaster context (user info)
export async function getFarcasterContext(): Promise<FarcasterContext | null> {
  try {
    const context = await sdk.context;
    return context as FarcasterContext;
  } catch (error) {
    console.error('Failed to get Farcaster context:', error);
    return null;
  }
}

// Get Quick Auth token for authentication
export async function getAuthToken(): Promise<string | null> {
  try {
    const { token } = await sdk.quickAuth.getToken();
    return token;
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

// Make authenticated fetch request
export async function authenticatedFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  return sdk.quickAuth.fetch(url, options);
}

// Check if running inside Mini App environment
export function isInMiniApp(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    // Check if SDK context is available
    return Boolean(sdk);
  } catch {
    return false;
  }
}

// Open a URL (can be used to open profile via Warpcast URL)
export async function openUrl(url: string): Promise<void> {
  try {
    await sdk.actions.openUrl(url);
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
}

// Open a Farcaster profile using URL
export async function openProfile(fid: number): Promise<void> {
  try {
    // Use openUrl with Warpcast profile URL
    const profileUrl = `https://warpcast.com/~/profiles/${fid}`;
    await sdk.actions.openUrl(profileUrl);
  } catch (error) {
    console.error('Failed to open profile:', error);
  }
}

// Compose a cast
export async function composeCast(text: string, embeds?: string[]): Promise<void> {
  try {
    const castOptions: { text: string; embeds?: [string] | [string, string] } = { text };
    
    if (embeds && embeds.length > 0) {
      // SDK expects tuple of 1 or 2 strings max
      if (embeds.length === 1) {
        castOptions.embeds = [embeds[0]];
      } else if (embeds.length >= 2) {
        castOptions.embeds = [embeds[0], embeds[1]];
      }
    }
    
    await sdk.actions.composeCast(castOptions);
  } catch (error) {
    console.error('Failed to compose cast:', error);
  }
}

// Trigger haptic feedback
export async function hapticFeedback(
  type: 'impact' | 'notification' | 'selection' = 'impact'
): Promise<void> {
  try {
    switch (type) {
      case 'impact':
        await sdk.haptics.impactOccurred('medium');
        break;
      case 'notification':
        await sdk.haptics.notificationOccurred('success');
        break;
      case 'selection':
        await sdk.haptics.selectionChanged();
        break;
    }
  } catch (error) {
    // Haptics might not be available on all devices
    console.log('Haptic feedback not available');
  }
}

// Get the Ethereum provider for wallet interactions
export function getEthereumProvider() {
  return sdk.wallet.getEthereumProvider();
}
