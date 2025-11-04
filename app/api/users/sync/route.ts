/**
 * 用户同步 API
 * 当用户登录后调用以确保用户信息写入数据库
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, email, name, image } = session.user;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 以 email 为准对齐用户，避免因不同 id 导致唯一键冲突
    const existing = await prisma.user.findUnique({ where: { email } });
    let canonicalId = existing?.id;

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          name: name ?? null,
          avatar: image ?? null,
          updatedAt: new Date(),
        },
      });
    } else {
      const created = await prisma.user.create({
        data: {
          id,
          email,
          name: name ?? null,
          avatar: image ?? null,
        },
      });
      canonicalId = created.id;
    }

    return NextResponse.json({ success: true, userId: canonicalId });
  } catch (error) {
    console.error('Failed to sync user', error);
    return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 });
  }
}

