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
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-150px',
            left: '-150px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: '160px',
              height: '160px',
              borderRadius: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 60px rgba(139,92,246,0.4)',
            }}
          >
            <span style={{ fontSize: '80px' }}>🔮</span>
          </div>

          {/* Text */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h1
              style={{
                fontSize: '72px',
                fontWeight: 'bold',
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Neynar Score
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: '#9ca3af',
                margin: '10px 0 0 0',
              }}
            >
              Check your Farcaster reputation
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ fontSize: '24px', color: '#6b7280' }}>Powered by</span>
          <span style={{ fontSize: '24px', color: '#a855f7', fontWeight: 'bold' }}>Neynar</span>
          <span style={{ fontSize: '24px', color: '#6b7280' }}>&</span>
          <span style={{ fontSize: '24px', color: '#8b5cf6', fontWeight: 'bold' }}>Farcaster</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
