/**
 * 订阅管理 API
 * GET /api/payments/subscription - 获取订阅信息
 * DELETE /api/payments/subscription - 取消订阅
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dodoClient } from '@/lib/dodo/client';
import { SubscriptionStatus } from '@prisma/client';

/**
 * 获取用户订阅信息
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 查询订阅信息
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { subscription: null },
        { status: 200 }
      );
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

/**
 * 取消订阅
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const cancelAtPeriodEnd = searchParams.get('cancelAtPeriodEnd') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 查询订阅信息
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // 调用 Dodo API 取消订阅
    await dodoClient.cancelSubscription(subscription.dodoSubscriptionId, {
      cancelAtPeriodEnd,
    });

    // 更新本地订阅记录
    const updatedSubscription = await prisma.subscription.update({
      where: { userId },
      data: {
        cancelAtPeriodEnd,
        ...(cancelAtPeriodEnd
          ? {}
          : {
              status: SubscriptionStatus.CANCELLED,
              canceledAt: new Date(),
              endedAt: new Date(),
            }),
      },
    });

    return NextResponse.json({
      subscription: updatedSubscription,
      message: cancelAtPeriodEnd
        ? 'Subscription will be cancelled at the end of the billing period'
        : 'Subscription cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}
