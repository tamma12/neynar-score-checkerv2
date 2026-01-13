'use client';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
};

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
        
        {/* Spinning arc */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 animate-spin"
        />
        
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-purple-500/20 animate-pulse" />
      </div>

      {text && (
        <p className="text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
}

// Skeleton loader for cards
export function CardSkeleton() {
  return (
    <div className="glass-card rounded-3xl p-6 max-w-md mx-auto animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-white/10" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-white/10 rounded mb-2" />
          <div className="h-4 w-20 bg-white/10 rounded" />
        </div>
      </div>

      {/* Score ring skeleton */}
      <div className="flex justify-center mb-6">
        <div className="w-44 h-44 rounded-full bg-white/10" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="h-20 bg-white/10 rounded-xl" />
        <div className="h-20 bg-white/10 rounded-xl" />
      </div>

      {/* Button skeleton */}
      <div className="h-12 bg-white/10 rounded-xl" />
    </div>
  );
}
