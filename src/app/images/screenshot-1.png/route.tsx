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
          background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
          padding: '80px 60px',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '40px' }}>🔮</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>Neynar Score</span>
            <span style={{ fontSize: '20px', color: '#9ca3af' }}>Farcaster Reputation</span>
          </div>
        </div>

        {/* User Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '40px',
            padding: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* User Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '50px' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '50px' }}>👤</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff' }}>Your Name</span>
              <span style={{ fontSize: '28px', color: '#9ca3af' }}>@username</span>
            </div>
          </div>

          {/* Score Ring */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '50px',
            }}
          >
            <div
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '160px',
                background: 'conic-gradient(#22c55e 0deg 306deg, rgba(255,255,255,0.1) 306deg 360deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '280px',
                  height: '280px',
                  borderRadius: '140px',
                  background: '#1a1a2e',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '80px', fontWeight: 'bold', color: '#fff' }}>85</span>
                <span style={{ fontSize: '28px', color: '#9ca3af' }}>/ 100</span>
              </div>
            </div>
          </div>

          {/* Score Label */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '50px' }}>
            <div
              style={{
                padding: '16px 40px',
                borderRadius: '30px',
                background: 'rgba(34,197,94,0.2)',
                color: '#22c55e',
                fontSize: '28px',
                fontWeight: '600',
              }}
            >
              Excellent Reputation
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '24px' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>1,234</span>
              <span style={{ fontSize: '22px', color: '#9ca3af' }}>Followers</span>
            </div>
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '24px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff' }}>567</span>
              <span style={{ fontSize: '22px', color: '#9ca3af' }}>Following</span>
            </div>
          </div>
        </div>

        {/* Share Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              padding: '24px 80px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              color: '#fff',
              fontSize: '32px',
              fontWeight: '600',
            }}
          >
            📤 Share My Score
          </div>
        </div>
      </div>
    ),
    {
      width: 1284,
      height: 2778,
    }
  );
}
