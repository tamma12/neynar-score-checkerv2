'use client';

import { ScoreRing } from './ScoreRing';
import { getScoreLevel, getScoreLabel } from '@/lib/neynar';

type UserCardProps = {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    bio: string;
    followerCount: number;
    followingCount: number;
    powerBadge: boolean;
    neynarScore: number;
  };
  onShare?: () => void;
  onViewProfile?: () => void;
};

export function UserCard({ user, onShare, onViewProfile }: UserCardProps) {
  const level = getScoreLevel(user.neynarScore);
  const label = getScoreLabel(level);

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-full max-w-md mx-auto">
      {/* User Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onViewProfile}
          className="relative group"
        >
          <img
            src={user.pfpUrl || '/images/icon.png'}
            alt={user.displayName}
            className="w-16 h-16 rounded-full border-2 border-purple-500/50 object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/images/icon.png'; }}
          />
          {user.powerBadge && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-xs">
              ⚡
            </div>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-white text-lg truncate">
              {user.displayName}
            </h2>
          </div>
          <p className="text-gray-400 text-sm">@{user.username}</p>
          <p className="text-gray-500 text-xs mt-1">FID: {user.fid}</p>
        </div>
      </div>

      {/* Score Ring */}
      <div className="flex justify-center mb-6">
        <ScoreRing score={user.neynarScore} size={180} />
      </div>

      {/* Score Label */}
      <div className="text-center mb-6">
        <span className={`
          inline-block px-4 py-2 rounded-full text-sm font-medium
          ${level === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
            level === 'good' ? 'bg-green-500/20 text-green-400' :
            level === 'average' ? 'bg-yellow-500/20 text-yellow-400' :
            level === 'low' ? 'bg-orange-500/20 text-orange-400' :
            'bg-red-500/20 text-red-400'}
        `}>
          {label}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {user.followerCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Followers</p>
        </div>
        <div className="bg-white/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-white">
            {user.followingCount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">Following</p>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-gray-400 text-sm text-center mb-6 line-clamp-2">
          {user.bio}
        </p>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onShare}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
        >
          <span>📤</span>
          Share Score
        </button>
        <button
          onClick={onViewProfile}
          className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
        >
          👤
        </button>
      </div>
    </div>
  );
}
