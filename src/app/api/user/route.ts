import { NextRequest, NextResponse } from 'next/server';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_API_URL = 'https://api.neynar.com/v2/farcaster';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid');
    const username = searchParams.get('username');

    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      );
    }

    let userData;

    // Fetch by FID
    if (fid) {
      const response = await fetch(
        `${NEYNAR_API_URL}/user/bulk?fids=${fid}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': NEYNAR_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status}`);
      }

      const data = await response.json();
      userData = data.users?.[0];
    }
    // Fetch by username
    else if (username) {
      const response = await fetch(
        `${NEYNAR_API_URL}/user/by_username?username=${encodeURIComponent(username)}`,
        {
          headers: {
            'accept': 'application/json',
            'x-api-key': NEYNAR_API_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Neynar API error: ${response.status}`);
      }

      const data = await response.json();
      userData = data.user;
    } else {
      return NextResponse.json(
        { error: 'Either fid or username is required' },
        { status: 400 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Extract the neynar_user_score
    const neynarScore = userData.experimental?.neynar_user_score ?? userData.score ?? 0;

    // Return formatted user data
    return NextResponse.json({
      user: {
        fid: userData.fid,
        username: userData.username,
        displayName: userData.display_name,
        pfpUrl: userData.pfp_url,
        bio: userData.profile?.bio?.text || '',
        followerCount: userData.follower_count,
        followingCount: userData.following_count,
        powerBadge: userData.power_badge,
        custodyAddress: userData.custody_address,
        verifiedAddresses: userData.verified_addresses?.eth_addresses || [],
        neynarScore: neynarScore,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// Search users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 5 } = body;

    if (!NEYNAR_API_KEY) {
      return NextResponse.json(
        { error: 'Neynar API key not configured' },
        { status: 500 }
      );
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${NEYNAR_API_URL}/user/search?q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          'accept': 'application/json',
          'x-api-key': NEYNAR_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.status}`);
    }

    const data = await response.json();

    // Format search results
    const users = data.result?.users?.map((user: any) => ({
      fid: user.fid,
      username: user.username,
      displayName: user.display_name,
      pfpUrl: user.pfp_url,
      bio: user.profile?.bio?.text || '',
      followerCount: user.follower_count,
      followingCount: user.following_count,
      powerBadge: user.power_badge,
      verifiedAddresses: user.verified_addresses?.eth_addresses || [],
      neynarScore: user.experimental?.neynar_user_score ?? user.score ?? 0,
    })) || [];

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error searching users:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search users' },
      { status: 500 }
    );
  }
}
