/**
 * 游客使用记录 API
 * POST /api/guest/record
 *
 * 记录游客使用情况到数据库
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

/**
 * 从 IP 获取地理位置信息（可选功能）
 * 这里提供一个简单的实现，实际生产环境可以使用第三方服务
 */
async function getGeoLocation(ip: string): Promise<{ country?: string; city?: string }> {
  // 简单实现：跳过地理位置获取
  // 实际生产环境可以集成 MaxMind GeoIP 或其他服务
  return {};
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fingerprint, userAgent, videoId } = body;

    // 验证必填字段
    if (!fingerprint || !videoId) {
      return NextResponse.json(
        { error: 'Fingerprint and videoId are required' },
        { status: 400 }
      );
    }

    // 获取客户端信息
    const ipAddress = getClientIp(request);
    const geoLocation = await getGeoLocation(ipAddress);

    // 创建使用记录
    const usage = await prisma.guestUsage.create({
      data: {
        ipAddress,
        fingerprint,
        userAgent: userAgent || null,
        videoId,
        country: geoLocation.country || null,
        city: geoLocation.city || null,
      },
    });

    return NextResponse.json({
      success: true,
      id: usage.id,
    });
  } catch (error) {
    console.error('Error recording guest usage:', error);
    return NextResponse.json(
      { error: 'Failed to record guest usage' },
      { status: 500 }
    );
  }
}
