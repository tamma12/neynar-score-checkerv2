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
            marginBottom: '100px',
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

        {/* Main Content - Search */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          {/* Animated Icon */}
          <div style={{ fontSize: '200px', marginBottom: '60px' }}>🔮</div>

          <h2
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            Check Your Score
          </h2>

          <p
            style={{
              fontSize: '28px',
              color: '#9ca3af',
              marginBottom: '80px',
              textAlign: 'center',
              maxWidth: '800px',
            }}
          >
            Search for any Farcaster user to see their Neynar reputation score
          </p>

          {/* Search Box */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              maxWidth: '900px',
              gap: '20px',
            }}
          >
            <div
              style={{
                flex: 1,
                padding: '30px 40px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '24px',
                color: '#6b7280',
                fontSize: '28px',
              }}
            >
              Search username...
            </div>
            <div
              style={{
                padding: '30px 50px',
                background: '#8b5cf6',
                borderRadius: '24px',
                color: '#fff',
                fontSize: '32px',
              }}
            >
              🔍
            </div>
          </div>

          {/* Recent Searches */}
          <div
            style={{
              marginTop: '100px',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: '900px',
            }}
          >
            <span style={{ fontSize: '24px', color: '#6b7280', marginBottom: '30px' }}>
              Popular searches
            </span>

            {/* User items */}
            {['dwr.eth', 'v', 'jessepollak'].map((name, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '30px',
                    background: `linear-gradient(135deg, ${i === 0 ? '#8b5cf6' : i === 1 ? '#6366f1' : '#4f46e5'} 0%, #1e1b4b 100%)`,
                  }}
                />
                <span style={{ fontSize: '28px', color: '#fff' }}>@{name}</span>
                <span style={{ marginLeft: 'auto', fontSize: '24px', color: '#22c55e' }}>
                  {95 - i * 5}%
                </span>
              </div>
            ))}
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
