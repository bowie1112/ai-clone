import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Mock flag: set LUMA_USE_MOCK=1 (server) or NEXT_PUBLIC_USE_MOCK=1 (client) to enable
const USE_MOCK = process.env.LUMA_USE_MOCK === '1' || process.env.NEXT_PUBLIC_USE_MOCK === '1';

export async function POST(request: Request) {
  // -------- Mock branch --------
  if (USE_MOCK) {
    // 简单生成一个临时 taskId，前端将立即得到“已完成”状态
    const mockTaskId = `mock-task-${Date.now()}`;
    return NextResponse.json({ taskId: mockTaskId });
  }
  // -------- Real branch --------
  try {
    // 若存在已登录会话可获得 userId，但不再强制要求登录
    const session = await auth.api.getSession({ headers: (request as any).headers ?? new Headers() });

    const apiKey = process.env.LUMA_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing LUMA_API_KEY' }, { status: 500 });
    }

    const body = await request.json();
    const { prompt, videoUrl, callBackUrl, watermark, ...rest } = body ?? {};

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }
    if (!videoUrl || typeof videoUrl !== 'string') {
      return NextResponse.json({ error: 'videoUrl is required' }, { status: 400 });
    }

    const res = await fetch('https://api.kie.ai/api/v1/modify/generate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, videoUrl, callBackUrl, watermark, ...rest }),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.code !== 200) {
      return NextResponse.json(
        { error: data?.msg || 'Failed to create task', details: data },
        { status: res.status || 500 }
      );
    }

    return NextResponse.json({ taskId: data.data?.taskId });
  } catch (err) {
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}


