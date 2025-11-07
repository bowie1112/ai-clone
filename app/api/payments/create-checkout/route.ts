/**
 * 创建支付链接 API
 * POST /api/payments/create-checkout
 *
 * 简化版本：直接使用 Dodo Payments 产品链接
 * 格式: https://checkout.dodopayments.com/buy/{productId}?metadata[key]=value
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CREDIT_PACKAGES, SUBSCRIPTION_PLANS, DODO_CONFIG } from '@/lib/dodo/config';
import { prisma } from '@/lib/prisma';

// 验证请求体
const createCheckoutSchema = z.object({
  userId: z.string(),
  type: z.enum(['credit_package', 'subscription']),
  productId: z.string(),
  interval: z.enum(['month', 'year']).optional(),
  customerEmail: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    const { userId, type, productId, interval, customerEmail } = createCheckoutSchema.parse(body);

    let paymentData: {
      productId: string;
      productName: string;
      amount: number;
      credits?: number;
      description?: string;
    };

    // 根据类型获取产品信息
    if (type === 'credit_package') {
      const pkg = CREDIT_PACKAGES.find((p) => p.id === productId);
      if (!pkg) {
        return NextResponse.json(
          { error: 'Invalid product ID' },
          { status: 400 }
        );
      }

      paymentData = {
        productId: pkg.id,
        productName: pkg.name,
        amount: pkg.price,
        credits: pkg.credits,
        description: pkg.description,
      };
    } else if (type === 'subscription') {
      const plan = SUBSCRIPTION_PLANS.find((p) => p.id === productId);
      if (!plan) {
        return NextResponse.json(
          { error: 'Invalid plan ID' },
          { status: 400 }
        );
      }

      const isYearly = interval === 'year';
      const amount = isYearly ? plan.yearlyPrice : plan.price;

      if (amount === null) {
        return NextResponse.json(
          { error: 'Custom pricing - please contact sales' },
          { status: 400 }
        );
      }

      paymentData = {
        productId: plan.id,
        productName: `${plan.name} - ${isYearly ? 'Yearly' : 'Monthly'}`,
        amount,
        credits: plan.credits,
        description: `${plan.name} subscription`,
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid payment type' },
        { status: 400 }
      );
    }

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error('User not found:', userId);
      return NextResponse.json(
        { error: 'User not found or session invalid. Please log in again.' },
        { status: 401 }
      );
    }

    // 创建本地支付记录
    const payment = await prisma.payment.create({
      data: {
        userId,
        type: type === 'credit_package' ? 'CREDIT_PACKAGE' : 'SUBSCRIPTION',
        status: 'PENDING',
        amount: paymentData.amount,
        currency: 'USD',
        credits: paymentData.credits,
        productId: paymentData.productId,
        productName: paymentData.productName,
        description: paymentData.description,
        metadata: {
          interval,
          userId,
          credits: paymentData.credits,
          type,
        },
      },
    });

    // 构建 Dodo Checkout URL
    // 格式: https://checkout.dodopayments.com/buy/{productId}?metadata[key]=value
    const checkoutBaseUrl = DODO_CONFIG.testMode
      ? 'https://test.checkout.dodopayments.com'
      : 'https://checkout.dodopayments.com';

    const checkoutUrl = new URL(`${checkoutBaseUrl}/buy/${productId}`);

    // 添加 metadata 参数 - 这些会在 webhook 中返回
    checkoutUrl.searchParams.set('metadata[userId]', userId);
    checkoutUrl.searchParams.set('metadata[paymentId]', payment.id);
    checkoutUrl.searchParams.set('metadata[type]', type);
    checkoutUrl.searchParams.set('metadata[credits]', String(paymentData.credits || 0));

    // 添加 quantity (默认为 1)
    checkoutUrl.searchParams.set('quantity', '1');

    // 添加回调 URL (可选)
    // 注意：部分支付网关需要在产品设置中配置回调 URL
    // checkoutUrl.searchParams.set('success_url', successUrl);
    // checkoutUrl.searchParams.set('cancel_url', cancelUrl);

    // 如果有客户邮箱，预填充
    if (customerEmail) {
      checkoutUrl.searchParams.set('prefilled_email', customerEmail);
    }

    console.log('Created checkout URL:', checkoutUrl.toString());

    return NextResponse.json({
      url: checkoutUrl.toString(),
      paymentId: payment.id,
    });
  } catch (error) {
    console.error('Create checkout error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues },
        { status: 400 }
      );
    }

    // 处理 Prisma 外键约束错误
    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'User not found. Please log in again.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
