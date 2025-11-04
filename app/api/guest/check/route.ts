/**
 * 游客限制检查 API
 * POST /api/guest/check
 *
 * 检查游客是否可以生成视频
 * 基于 IP、浏览器指纹和数据库记录进行多重验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

/**
 * 获取客户端 IP 地址
 */
function getClientIp(request: NextRequest): string {
  // 尝试从各种 header 中获取真实 IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIp) return realIp;

  // 后备方案
  return '0.0.0.0';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, userAgent } = body;

    if (!fingerprint) {
      return NextResponse.json(
        { error: 'Fingerprint is required' },
        { status: 400 }
      );
    }

    // 获取客户端 IP
    const ipAddress = getClientIp(request);

    // 检查数据库中是否有记录
    // 使用 OR 条件：IP 或指纹任一匹配即视为已使用
    const existingUsage = await prisma.guestUsage.findFirst({
      where: {
        OR: [
          { ipAddress },
          { fingerprint },
        ],
      },
      orderBy: {
        usedAt: 'desc',
      },
    });

    if (existingUsage) {
      // 已经使用过免费额度
      return NextResponse.json({
        allowed: false,
        reason: 'already_used',
        remainingAttempts: 0,
        usedAt: existingUsage.usedAt,
      });
    }

    // 允许生成
    return NextResponse.json({
      allowed: true,
      remainingAttempts: 1,
    });
  } catch (error) {
    console.error('Error checking guest limit:', error);
    return NextResponse.json(
      {
        error: 'Failed to check guest limit',
        // 友好降级：出错时允许继续
        allowed: true,
        remainingAttempts: 1,
      },
      { status: 500 }
    );
  }
}
