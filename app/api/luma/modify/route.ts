import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 登录校验：未登录不允许创建生成任务
    const session = await auth.api.getSession({ headers: (request as any).headers ?? new Headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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


