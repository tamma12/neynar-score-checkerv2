// Neynar API types and utilities

export type NeynarUser = {
  fid: number;
  username: string;
  display_name: string;
  pfp_url: string;
  custody_address: string;
  profile: {
    bio: {
      text: string;
    };
  };
  follower_count: number;
  following_count: number;
  verifications: string[];
  verified_addresses: {
    eth_addresses: string[];
    sol_addresses: string[];
  };
  power_badge: boolean;
  score: number;
  experimental?: {
    neynar_user_score: number;
  };
};

export type NeynarUserResponse = {
  users: NeynarUser[];
};

export type ScoreLevel = 'excellent' | 'good' | 'average' | 'low' | 'poor';

// Get score level based on Neynar score
export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 0.8) return 'excellent';
  if (score >= 0.65) return 'good';
  if (score >= 0.5) return 'average';
  if (score >= 0.35) return 'low';
  return 'poor';
}

// Get score color based on level
export function getScoreColor(level: ScoreLevel): string {
  const colors: Record<ScoreLevel, string> = {
    excellent: '#10b981',
    good: '#22c55e',
    average: '#eab308',
    low: '#f97316',
    poor: '#ef4444',
  };
  return colors[level];
}

// Get score label
export function getScoreLabel(level: ScoreLevel): string {
  const labels: Record<ScoreLevel, string> = {
    excellent: 'Excellent',
    good: 'Good',
    average: 'Average',
    low: 'Low',
    poor: 'Poor',
  };
  return labels[level];
}

// Get score description
export function getScoreDescription(level: ScoreLevel): string {
  const descriptions: Record<ScoreLevel, string> = {
    excellent: 'Outstanding reputation! Top-tier contributor to the Farcaster ecosystem.',
    good: 'Great reputation! You\'re a valued member of the community.',
    average: 'Decent reputation. Keep engaging positively to improve!',
    low: 'Building reputation. More quality interactions will help.',
    poor: 'Low reputation. Focus on authentic engagement to grow.',
  };
  return descriptions[level];
}

// Get score tips
export function getScoreTips(level: ScoreLevel): string[] {
  const tips: Record<ScoreLevel, string[]> = {
    excellent: [
      'You\'re doing amazing! Keep up the great work.',
      'Help others grow by engaging with newer members.',
      'Your endorsement carries significant weight.',
    ],
    good: [
      'Consistent quality engagement pays off.',
      'Connect with more established users.',
      'Share valuable insights and content.',
    ],
    average: [
      'Post original, thoughtful content.',
      'Engage meaningfully in conversations.',
      'Avoid spam and low-effort posts.',
    ],
    low: [
      'Focus on quality over quantity.',
      'Build genuine connections.',
      'Be patient - scores update weekly.',
    ],
    poor: [
      'Review community guidelines.',
      'Start fresh with authentic engagement.',
      'Avoid actions that seem automated.',
    ],
  };
  return tips[level];
}

// Format address for display
export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}
