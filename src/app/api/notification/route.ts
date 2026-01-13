import { NextRequest, NextResponse } from 'next/server';
import { notificationStore } from '@/lib/notificationStore';

type NotificationRequest = {
  fid?: number;
  notificationDetails?: {
    url: string;
    token: string;
  };
  title: string;
  body: string;
  targetUrl?: string;
};

export async function POST(request: NextRequest) {
  try {
    const data: NotificationRequest = await request.json();
    const { fid, notificationDetails: providedDetails, title, body, targetUrl } = data;

    const appUrl = targetUrl || process.env.NEXT_PUBLIC_APP_URL || 'https://neynar-score-checkerv2.vercel.app';

    // Get notification details - either provided or from store
    let notifDetails = providedDetails;
    
    if (!notifDetails && fid) {
      notifDetails = notificationStore.get(fid);
    }

    if (!notifDetails?.url || !notifDetails?.token) {
      return NextResponse.json(
        { error: 'No notification details found for this user' },
        { status: 400 }
      );
    }

    // Send notification to Farcaster
    const response = await fetch(notifDetails.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notificationId: `neynar-score-${fid || 'unknown'}-${Date.now()}`,
        title,
        body,
        targetUrl: appUrl,
        tokens: [notifDetails.token],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Notification failed:', errorText);
      return NextResponse.json(
        { error: 'Failed to send notification', details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error('Notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check notification status for a user
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid');
  
  if (!fid) {
    return NextResponse.json({ error: 'FID required' }, { status: 400 });
  }
  
  const hasNotifications = notificationStore.has(Number(fid));
  
  return NextResponse.json({
    fid: Number(fid),
    notificationsEnabled: hasNotifications,
    totalUsersWithNotifications: notificationStore.count(),
  });
}
