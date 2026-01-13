import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Crystal Ball */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
          }}
        >
          🔮
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 10,
          }}
        >
          Neynar Score Checker
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: '#9ca3af',
          }}
        >
          Check your Farcaster reputation score
        </div>
      </div>
    ),
    {
      width: 600,
      height: 400,
    }
  );
}
