import { NextRequest, NextResponse } from 'next/server';
import { notificationStore } from '@/lib/notificationStore';

// Webhook handler for Farcaster Mini App events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle direct notification save from client (frame_added event from SDK)
    if (body.event === 'frame_added' && body.fid && body.notificationDetails) {
      notificationStore.set(body.fid, body.notificationDetails);
      return NextResponse.json({ success: true, message: 'Notification details saved' });
    }
    
    // Handle Farcaster webhook events (from Warpcast server)
    if (body.header && body.payload && body.signature) {
      // Decode the payload
      const payloadJson = Buffer.from(body.payload, 'base64').toString();
      const payload = JSON.parse(payloadJson);
      
      console.log('Received webhook event:', payload.event);
      console.log('From FID:', payload.fid);
      
      // Handle different event types
      switch (payload.event) {
        case 'frame_added':
        case 'mini_app_added':
          console.log('User added mini app:', payload.fid);
          if (payload.notificationDetails) {
            notificationStore.set(payload.fid, payload.notificationDetails);
          }
          break;
          
        case 'frame_removed':
        case 'mini_app_removed':
          console.log('User removed mini app:', payload.fid);
          notificationStore.delete(payload.fid);
          break;
          
        case 'notifications_enabled':
          console.log('Notifications enabled for FID:', payload.fid);
          if (payload.notificationDetails) {
            notificationStore.set(payload.fid, payload.notificationDetails);
          }
          break;
          
        case 'notifications_disabled':
          console.log('Notifications disabled for FID:', payload.fid);
          notificationStore.delete(payload.fid);
          break;
          
        default:
          console.log('Unknown event type:', payload.event);
      }
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
