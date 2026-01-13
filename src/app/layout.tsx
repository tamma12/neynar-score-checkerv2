import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/providers/Providers';

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://neynar-score-checkerv2.vercel.app';

export const metadata: Metadata = {
  title: 'Neynar Score Checker | Farcaster Mini App',
  description:
    'Check your Neynar user score and see how you rank in the Farcaster ecosystem.',
  openGraph: {
    title: 'Neynar Score Checker',
    description: 'Check your Farcaster reputation score',
    images: [`${appUrl}/images/og-image.png`],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neynar Score Checker',
    description: 'Check your Farcaster reputation score',
    images: [`${appUrl}/images/og-image.png`],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0f0f1a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Frame embed for Farcaster feeds - must use version "1" and launch_miniapp
  const frameEmbed = {
    version: '1',
    imageUrl: `${appUrl}/images/og-image.png`,
    button: {
      title: '🔮 Check Score',
      action: {
        type: 'launch_miniapp',
        name: 'Neynar Score Checker',
        url: appUrl,
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: '#0f0f1a',
      },
    },
  };

  // For backward compatibility
  const frameEmbedLegacy = {
    version: '1',
    imageUrl: `${appUrl}/images/og-image.png`,
    button: {
      title: '🔮 Check Score',
      action: {
        type: 'launch_frame',
        name: 'Neynar Score Checker',
        url: appUrl,
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: '#0f0f1a',
      },
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Farcaster Mini App Embed Meta Tags */}
        <meta name="fc:miniapp" content={JSON.stringify(frameEmbed)} />
        {/* Backward compatibility */}
        <meta name="fc:frame" content={JSON.stringify(frameEmbedLegacy)} />
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
