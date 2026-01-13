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
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '60px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
          {/* Saved badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 24px',
              background: 'rgba(34,197,94,0.2)',
              borderRadius: '30px',
            }}
          >
            <span style={{ color: '#22c55e', fontSize: '24px' }}>✓</span>
            <span style={{ color: '#22c55e', fontSize: '22px' }}>Saved</span>
          </div>
        </div>

        {/* Score Card (faded) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '40px',
            padding: '50px',
            border: '1px solid rgba(255,255,255,0.05)',
            opacity: 0.6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff' }}>Your Name</span>
              <span style={{ fontSize: '24px', color: '#9ca3af' }}>@username</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                width: '250px',
                height: '250px',
                borderRadius: '125px',
                background: 'rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '60px', fontWeight: 'bold', color: '#fff' }}>85%</span>
            </div>
          </div>
        </div>

        {/* Floating Add Prompt */}
        <div
          style={{
            position: 'absolute',
            bottom: '200px',
            left: '60px',
            right: '60px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            borderRadius: '32px',
            padding: '40px',
            boxShadow: '0 30px 80px rgba(139,92,246,0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '45px' }}>🔮</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff' }}>
                Save to your apps
              </span>
              <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
                Quick access & get notifications
              </span>
            </div>
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '24px',
              background: '#fff',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '28px' }}>➕</span>
            <span style={{ fontSize: '28px', fontWeight: '600', color: '#8b5cf6' }}>
              Add to Warpcast
            </span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '22px', color: '#6b7280' }}>Powered by Neynar & Farcaster</span>
        </div>
      </div>
    ),
    {
      width: 1284,
      height: 2778,
    }
  );
}
