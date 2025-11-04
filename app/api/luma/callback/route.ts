import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    // In production, persist this payload and notify the client side via websockets or polling
    return NextResponse.json({ received: true, payload });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid callback payload' }, { status: 400 });
  }
}


