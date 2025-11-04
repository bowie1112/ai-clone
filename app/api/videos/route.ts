/**
 * 视频 API 路由
 * GET - 获取视频列表
 * POST - 创建新视频记录
 */

import { NextRequest, NextResponse } from 'next/server';
import { createVideo, getUserVideos, getAllVideos } from '@/lib/db/videos';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const skip = parseInt(searchParams.get('skip') || '0');
    const take = parseInt(searchParams.get('take') || '20');
    const session = await auth.api.getSession({ headers: request.headers });
    let effectiveUserId = userId || session?.user?.id || undefined;

    // 若会话存在但 userId 未能解析，尝试通过 email 反查用户 id
    if (!effectiveUserId && session?.user?.email) {
      const email = session.user.email;
      try {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) effectiveUserId = existing.id;
      } catch {}
    }

    if (effectiveUserId) {
      // 获取特定用户的视频
      const result = await getUserVideos(effectiveUserId, {
        skip,
        take,
        status: status as any,
      });
      return NextResponse.json(result);
    } else {
      // 获取所有视频（管理员）
      const result = await getAllVideos({
        skip,
        take,
        status: status as any,
      });
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      prompt,
      title,
      description,
      style,
      duration,
      quality,
      aspectRatio,
      locale,
      lumaId,
    } = body;

    // 仅登录用户可创建，强制使用会话中的 userId
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    let userId: string = session.user.id;
    // 兜底：若会话 id 无法匹配，尝试用 email 找到规范 id
    try {
      const existing = await prisma.user.findUnique({ where: { email: session.user.email! } });
      if (existing) userId = existing.id;
    } catch {}

    // 验证必填字段
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const video = await createVideo({
      userId,
      prompt,
      title,
      description,
      style,
      duration,
      quality,
      aspectRatio,
      locale,
      lumaId,
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

