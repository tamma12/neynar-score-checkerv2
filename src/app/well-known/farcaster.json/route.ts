import { NextResponse } from 'next/server';

export async function GET() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://neynar-score-checkerv2.vercel.app';
  
  // Account association signature
  const header = process.env.NEXT_PUBLIC_FARCASTER_HEADER || '';
  const payload = process.env.NEXT_PUBLIC_FARCASTER_PAYLOAD || '';
  const signature = process.env.NEXT_PUBLIC_FARCASTER_SIGNATURE || '';
  
  const manifest = {
    accountAssociation: {
      header,
      payload,
      signature,
    },
    frame: {
      // Required fields
      version: '1',
      name: 'Neynar Score',
      iconUrl: `${appUrl}/images/icon.png`,
      homeUrl: appUrl,
      
      // Splash screen
      splashImageUrl: `${appUrl}/images/splash.png`,
      splashBackgroundColor: '#0f0f1a',
      
      // Webhook for notifications
      webhookUrl: `${appUrl}/api/webhook`,
      
      // App Store / Discovery fields
      subtitle: 'Check your Farcaster score',  // Max 30 chars
      description: 'Discover your Neynar score - a reputation metric based on your Farcaster activity, engagement, and network quality. Share your score with friends!',
      primaryCategory: 'social',
      tags: ['reputation', 'score', 'neynar', 'analytics', 'farcaster'],
      
      // Screenshots (3 max, 1284x2778 portrait)
      screenshotUrls: [
        `${appUrl}/images/screenshot-1.png`,
        `${appUrl}/images/screenshot-2.png`,
        `${appUrl}/images/screenshot-3.png`,
      ],
      
      // Hero/promotional image (1200x630, 1.91:1 ratio)
      heroImageUrl: `${appUrl}/images/hero.png`,
      tagline: 'Know your Farcaster reputation',
      
      // Open Graph
      ogTitle: 'Neynar Score',
      ogDescription: 'Check your Farcaster reputation score powered by Neynar',
      ogImageUrl: `${appUrl}/images/og-image.png`,
      
      // Deprecated but still useful for backward compat
      imageUrl: `${appUrl}/images/og-image.png`,
      buttonTitle: '🔮 Check Score',
    },
  };

  return NextResponse.json(manifest, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
