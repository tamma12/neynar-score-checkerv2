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
    miniapp: {
      // Required fields
      version: '1',
      name: 'Neynar Score',
      iconUrl: `${appUrl}/images/icon.png`,        // Must be 1024x1024 PNG, no alpha
      homeUrl: appUrl,
      
      // Splash screen
      splashImageUrl: `${appUrl}/images/splash.png`,  // Must be 200x200px
      splashBackgroundColor: '#0f0f1a',
      
      // Webhook for notifications
      webhookUrl: `${appUrl}/api/webhook`,
      
      // App Store / Discovery fields (no emojis, no special chars)
      subtitle: 'Check your Farcaster score',  // Max 30 chars
      description: 'Discover your Neynar score based on your Farcaster activity and engagement. Share your reputation score with friends.',  // Max 170 chars
      primaryCategory: 'social',
      tags: ['reputation', 'score', 'neynar', 'analytics', 'social'],  // lowercase, no spaces
      
      // Screenshots (3 max, 1284x2778 portrait)
      screenshotUrls: [
        `${appUrl}/images/screenshot-1.png`,
        `${appUrl}/images/screenshot-2.png`,
        `${appUrl}/images/screenshot-3.png`,
      ],
      
      // Hero/promotional image (1200x630, 1.91:1 ratio)
      heroImageUrl: `${appUrl}/images/hero.png`,
      tagline: 'Know your Farcaster reputation',  // Max 30 chars
      
      // Open Graph
      ogTitle: 'Neynar Score',  // Max 30 chars
      ogDescription: 'Check your Farcaster reputation score powered by Neynar',  // Max 100 chars
      ogImageUrl: `${appUrl}/images/og-image.png`,  // 1200x630 PNG
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
