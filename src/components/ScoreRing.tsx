'use client';

import { useEffect, useState } from 'react';

type ScoreRingProps = {
  score: number; // 0-1
  size?: number;
};

export function ScoreRing({ score, size = 180 }: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const offset = circumference - animatedScore * circumference;
  const percentage = Math.round(animatedScore * 100);

  // Color based on score
  const getColor = () => {
    if (score >= 0.8) return '#10b981'; // green
    if (score >= 0.6) return '#3b82f6'; // blue
    if (score >= 0.4) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor();

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            filter: `drop-shadow(0 0 10px ${color})`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-4xl font-bold"
          style={{ color }}
        >
          {percentage}
        </span>
        <span className="text-gray-400 text-sm">/ 100</span>
      </div>
    </div>
  );
}
