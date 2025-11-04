import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing LUMA_API_KEY' }, { status: 500 });
    }

    const url = new URL(request.url);
    const taskId = url.searchParams.get('taskId');
    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
    }

    const res = await fetch(`https://api.kie.ai/api/v1/modify/record-info?taskId=${encodeURIComponent(taskId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.code !== 200) {
      return NextResponse.json(
        { error: data?.msg || 'Failed to get status', details: data },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({ status: data.data });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


