'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm text-white transition-colors flex items-center gap-2"
      >
        <span className="w-2 h-2 bg-green-400 rounded-full" />
        {formatAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        const connector = connectors[0];
        if (connector) {
          connect({ connector });
        }
      }}
      className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-sm text-purple-300 transition-colors"
    >
      Connect
    </button>
  );
}
