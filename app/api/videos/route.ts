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

/**
 * 获取客户端 IP 地址
 */
function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp;

  return '0.0.0.0';
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
      fingerprint, // 游客指纹（可选）
      userAgent,   // 游客 User Agent（可选）
    } = body;

    // 验证必填字段
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // 检查用户登录状态
    const session = await auth.api.getSession({ headers: request.headers });

    let userId: string | null = null;
    let isGuest = false;

    if (session?.user?.id) {
      // 登录用户
      userId = session.user.id;
      // 兜底：若会话 id 无法匹配，尝试用 email 找到规范 id
      try {
        const existing = await prisma.user.findUnique({ where: { email: session.user.email! } });
        if (existing) userId = existing.id;
      } catch {}
    } else {
      // 游客用户
      isGuest = true;

      // 检查游客是否已使用过免费额度
      if (!fingerprint) {
        return NextResponse.json(
          { error: 'Fingerprint is required for guest users' },
          { status: 400 }
        );
      }

      const ipAddress = getClientIp(request);

      // 检查数据库记录
      const existingUsage = await prisma.guestUsage.findFirst({
        where: {
          OR: [
            { ipAddress },
            { fingerprint },
          ],
        },
      });

      if (existingUsage) {
        return NextResponse.json(
          {
            error: 'Guest limit exceeded',
            message: 'You have already used your free generation. Please sign in to continue.',
            code: 'GUEST_LIMIT_EXCEEDED',
          },
          { status: 403 }
        );
      }
    }

    // 创建视频记录
    const video = await createVideo({
      userId: userId || undefined,
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

    // 如果是游客，记录使用情况
    if (isGuest && fingerprint) {
      const ipAddress = getClientIp(request);
      try {
        await prisma.guestUsage.create({
          data: {
            ipAddress,
            fingerprint,
            userAgent: userAgent || null,
            videoId: video.id,
          },
        });
      } catch (error) {
        console.error('Error recording guest usage:', error);
        // 不影响视频创建流程
      }
    }

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: 'Failed to create video' },
      { status: 500 }
    );
  }
}

