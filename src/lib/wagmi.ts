import { http, createConfig } from 'wagmi';
import { base, mainnet, optimism, arbitrum } from 'wagmi/chains';
import { farcasterMiniApp } from '@farcaster/miniapp-wagmi-connector';

// Configure wagmi with Farcaster Mini App connector
export const wagmiConfig = createConfig({
  chains: [base, mainnet, optimism, arbitrum],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
  },
  connectors: [farcasterMiniApp()],
});

// Chain names for display
export const chainNames: Record<number, string> = {
  [base.id]: 'Base',
  [mainnet.id]: 'Ethereum',
  [optimism.id]: 'Optimism',
  [arbitrum.id]: 'Arbitrum',
};

export const supportedChainIds = [base.id, mainnet.id, optimism.id, arbitrum.id];
