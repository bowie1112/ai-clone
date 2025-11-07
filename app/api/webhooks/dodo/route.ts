/**
 * Dodo Payments Webhook 处理器
 * POST /api/webhooks/dodo
 *
 * 处理来自 Dodo Payments 的 webhook 事件
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { Webhook } from 'standardwebhooks';
import { prisma } from '@/lib/prisma';
import { addCredits, refundCredits } from '@/lib/dodo/credits';
import { DODO_CONFIG, DodoWebhookEvent } from '@/lib/dodo/config';
import {
  PaymentStatus,
  SubscriptionStatus,
  RefundStatus,
  CreditTransactionType
} from '@prisma/client';

/**
 * 异步处理 webhook 事件
 * 在响应后异步处理，避免阻塞webhook响应
 */
async function processWebhookAsync(eventType: DodoWebhookEvent, event: any) {
  console.log('=== Processing Webhook Event ===');
  console.log('Event Type:', eventType);
  console.log('Full Event Object:', JSON.stringify(event, null, 2));

  // 验证事件结构
  if (!event) {
    console.error('❌ Event is null or undefined');
    return;
  }

  console.log('Event Keys:', Object.keys(event));
  console.log('Has data field:', !!event.data);

  if (event.data) {
    console.log('Data Keys:', Object.keys(event.data));
  } else {
    console.error('❌ Event.data is missing');
  }

  try {
    switch (eventType) {
      case DodoWebhookEvent.PAYMENT_SUCCEEDED:
        await handlePaymentSucceeded(event);
        break;

      case DodoWebhookEvent.PAYMENT_FAILED:
        await handlePaymentFailed(event);
        break;

      case DodoWebhookEvent.SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event);
        break;

      case DodoWebhookEvent.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event);
        break;

      case DodoWebhookEvent.SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event);
        break;

      case DodoWebhookEvent.REFUND_CREATED:
        await handleRefundCreated(event);
        break;

      default:
        console.log('Unhandled webhook event:', eventType);
    }
  } catch (error) {
    console.error('❌ Error processing webhook event:', eventType, error);
    // 不要重新抛出错误，避免阻塞其他webhook处理
  }
}

/**
 * 处理支付成功事件
 */
async function handlePaymentSucceeded(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      console.log('Event:', JSON.stringify(event, null, 2));
      return;
    }

    const { payment, customer, metadata } = event.data;

    // 验证 payment 对象
    if (!payment) {
      console.error('❌ Invalid event data: missing payment object');
      console.log('Event data keys:', Object.keys(event.data));
      return;
    }

    if (!payment.id) {
      console.error('❌ Invalid payment: missing id field');
      console.log('Payment object:', JSON.stringify(payment, null, 2));
      return;
    }

    console.log('✅ Processing payment succeeded:', payment.id);

    // 验证 userId
    const userId = metadata?.userId;
    if (!userId) {
      console.error('❌ No userId in payment metadata');
      console.log('Metadata:', JSON.stringify(metadata, null, 2));
      return;
    }

    // 验证 sessionId
    if (!payment.sessionId) {
      console.error('❌ No sessionId in payment');
      console.log('Payment:', JSON.stringify(payment, null, 2));
      return;
    }

    // 更新支付记录
    const updatedPayment = await prisma.payment.update({
      where: { dodoSessionId: payment.sessionId },
      data: {
        status: PaymentStatus.COMPLETED,
        dodoPaymentId: payment.id,
        completedAt: new Date(),
      },
    });

    console.log('✅ Payment record updated:', updatedPayment.id);

    // 如果是积分包购买，添加积分
    if (updatedPayment.credits && updatedPayment.credits > 0) {
      await addCredits({
        userId,
        amount: updatedPayment.credits,
        type: CreditTransactionType.PURCHASE,
        description: `Purchased ${updatedPayment.credits} credits`,
        paymentId: updatedPayment.id,
        metadata: {
          dodoPaymentId: payment.id,
          productId: updatedPayment.productId,
        },
      });

      console.log(`✅ Added ${updatedPayment.credits} credits to user ${userId}`);
    }
  } catch (error) {
    console.error('❌ Error in handlePaymentSucceeded:', error);
    throw error;
  }
}

/**
 * 处理支付失败事件
 */
async function handlePaymentFailed(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      return;
    }

    const { payment, metadata } = event.data;

    // 验证 payment 对象
    if (!payment) {
      console.error('❌ Invalid event data: missing payment object');
      return;
    }

    if (!payment.id) {
      console.error('❌ Invalid payment: missing id field');
      return;
    }

    console.log('✅ Processing payment failed:', payment.id);

    // 更新支付记录
    await prisma.payment.updateMany({
      where: {
        OR: [
          { dodoSessionId: payment.sessionId },
          { dodoPaymentId: payment.id },
        ],
      },
      data: {
        status: PaymentStatus.FAILED,
      },
    });

    console.log('✅ Payment record marked as failed');
  } catch (error) {
    console.error('❌ Error in handlePaymentFailed:', error);
    throw error;
  }
}

/**
 * 处理订阅创建事件
 */
async function handleSubscriptionCreated(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      return;
    }

    const { subscription, customer, metadata } = event.data;

    // 验证 subscription 对象
    if (!subscription) {
      console.error('❌ Invalid event data: missing subscription object');
      return;
    }

    if (!subscription.id) {
      console.error('❌ Invalid subscription: missing id field');
      return;
    }

    console.log('✅ Processing subscription created:', subscription.id);

    // 验证 userId
    const userId = metadata?.userId;
    if (!userId) {
      console.error('❌ No userId in subscription metadata');
      return;
    }

    // 验证 customer 对象
    if (!customer || !customer.id) {
      console.error('❌ Invalid customer object');
      return;
    }

    // 获取订阅信息
    const planType = metadata?.planType || 'basic';
    const planName = metadata?.planName || 'Basic Plan';
    const monthlyCredits = parseInt(metadata?.credits || '100');
    const amount = parseFloat(subscription.amount || '0');
    const interval = subscription.interval || 'month';

    // 创建或更新订阅记录
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        dodoSubscriptionId: subscription.id,
        dodoCustomerId: customer.id,
        dodoProductId: subscription.productId,
        status: SubscriptionStatus.ACTIVE,
        planName,
        planType,
        monthlyCredits,
        amount,
        currency: subscription.currency || 'USD',
        interval,
        currentPeriodStart: new Date(subscription.currentPeriodStart),
        currentPeriodEnd: new Date(subscription.currentPeriodEnd),
        metadata: metadata,
      },
      update: {
        dodoSubscriptionId: subscription.id,
        dodoCustomerId: customer.id,
        dodoProductId: subscription.productId,
        status: SubscriptionStatus.ACTIVE,
        planName,
        planType,
        monthlyCredits,
        amount,
        interval,
        currentPeriodStart: new Date(subscription.currentPeriodStart),
        currentPeriodEnd: new Date(subscription.currentPeriodEnd),
        cancelAtPeriodEnd: false,
      },
    });

    // 添加订阅积分
    await addCredits({
      userId,
      amount: monthlyCredits,
      type: CreditTransactionType.SUBSCRIPTION,
      description: `${planName} subscription credits`,
      metadata: {
        subscriptionId: subscription.id,
        period: interval,
      },
    });

    console.log(`✅ Created subscription and added ${monthlyCredits} credits to user ${userId}`);
  } catch (error) {
    console.error('❌ Error in handleSubscriptionCreated:', error);
    throw error;
  }
}

/**
 * 处理订阅更新事件
 */
async function handleSubscriptionUpdated(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      return;
    }

    const { subscription, metadata } = event.data;

    // 验证 subscription 对象
    if (!subscription) {
      console.error('❌ Invalid event data: missing subscription object');
      return;
    }

    if (!subscription.id) {
      console.error('❌ Invalid subscription: missing id field');
      return;
    }

    console.log('✅ Processing subscription updated:', subscription.id);

    // 更新订阅记录
    await prisma.subscription.update({
      where: { dodoSubscriptionId: subscription.id },
      data: {
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: new Date(subscription.currentPeriodStart),
        currentPeriodEnd: new Date(subscription.currentPeriodEnd),
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd || false,
      },
    });

    console.log('✅ Subscription record updated');
  } catch (error) {
    console.error('❌ Error in handleSubscriptionUpdated:', error);
    throw error;
  }
}

/**
 * 处理订阅删除/取消事件
 */
async function handleSubscriptionDeleted(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      return;
    }

    const { subscription } = event.data;

    // 验证 subscription 对象
    if (!subscription) {
      console.error('❌ Invalid event data: missing subscription object');
      return;
    }

    if (!subscription.id) {
      console.error('❌ Invalid subscription: missing id field');
      return;
    }

    console.log('✅ Processing subscription deleted:', subscription.id);

    // 更新订阅记录
    await prisma.subscription.update({
      where: { dodoSubscriptionId: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        canceledAt: new Date(),
        endedAt: new Date(),
      },
    });

    console.log('✅ Subscription cancelled');
  } catch (error) {
    console.error('❌ Error in handleSubscriptionDeleted:', error);
    throw error;
  }
}

/**
 * 处理退款创建事件
 */
async function handleRefundCreated(event: any) {
  try {
    // 验证事件结构
    if (!event || !event.data) {
      console.error('❌ Invalid event structure: missing data field');
      return;
    }

    const { refund, payment, metadata } = event.data;

    // 验证 refund 对象
    if (!refund) {
      console.error('❌ Invalid event data: missing refund object');
      return;
    }

    if (!refund.id) {
      console.error('❌ Invalid refund: missing id field');
      return;
    }

    console.log('✅ Processing refund created:', refund.id);

    // 验证 userId
    const userId = metadata?.userId;
    if (!userId) {
      console.error('❌ No userId in refund metadata');
      return;
    }

    // 验证 payment 对象
    if (!payment || !payment.id) {
      console.error('❌ Invalid payment object in refund event');
      return;
    }

    // 获取原支付记录
    const originalPayment = await prisma.payment.findFirst({
      where: { dodoPaymentId: payment.id },
    });

    if (!originalPayment) {
      console.error('❌ Original payment not found:', payment.id);
      return;
    }

    // 创建退款记录
    const refundRecord = await prisma.refund.create({
      data: {
        userId,
        dodoRefundId: refund.id,
        dodoPaymentId: payment.id,
        status: RefundStatus.PENDING,
        amount: parseFloat(refund.amount),
        currency: refund.currency || 'USD',
        reason: refund.reason,
        creditsRefunded: originalPayment.credits,
      },
    });

    console.log('✅ Refund record created:', refundRecord.id);

    // 如果退款成功，返还积分
    if (refund.status === 'succeeded') {
      await prisma.refund.update({
        where: { id: refundRecord.id },
        data: {
          status: RefundStatus.SUCCEEDED,
          processedAt: new Date(),
        },
      });

      if (originalPayment.credits && originalPayment.credits > 0) {
        await refundCredits(
          userId,
          originalPayment.credits,
          originalPayment.id,
          refund.reason
        );
        console.log(`✅ Refunded ${originalPayment.credits} credits to user ${userId}`);
      }

      // 更新原支付记录
      await prisma.payment.update({
        where: { id: originalPayment.id },
        data: { status: PaymentStatus.REFUNDED },
      });

      console.log('✅ Payment marked as refunded');
    }
  } catch (error) {
    console.error('❌ Error in handleRefundCreated:', error);
    throw error;
  }
}

/**
 * 主 webhook 处理函数
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const payload = await request.text();
    const headersList = await headers();

    // 调试信息：打印所有 headers
    console.log('=== Webhook Request Debug ===');
    console.log('All headers:', Object.fromEntries(headersList.entries()));
    console.log('Payload preview:', payload.substring(0, 200));
    console.log('Webhook Secret exists:', !!DODO_CONFIG.webhookSecret);

    // 获取标准 webhook headers
    const webhookId = headersList.get('webhook-id');
    const webhookSignature = headersList.get('webhook-signature');
    const webhookTimestamp = headersList.get('webhook-timestamp');

    console.log('Webhook ID:', webhookId);
    console.log('Webhook Signature:', webhookSignature);
    console.log('Webhook Timestamp:', webhookTimestamp);

    // 开发模式：跳过签名验证（仅用于测试）
    const isDevelopment = process.env.NODE_ENV === 'development';
    const skipVerification = process.env.SKIP_WEBHOOK_VERIFICATION === 'true';

    if (isDevelopment && skipVerification) {
      console.warn('⚠️ WARNING: Webhook signature verification SKIPPED in development mode');
    } else {
      // 生产模式：必须验证签名
      if (!webhookSignature) {
        console.error('No webhook-signature header provided');
        return NextResponse.json(
          { error: 'No signature provided' },
          { status: 401 }
        );
      }

      if (!webhookTimestamp) {
        console.error('No webhook-timestamp header provided');
        return NextResponse.json(
          { error: 'No timestamp provided' },
          { status: 401 }
        );
      }

      // 验证 webhook secret 是否配置
      if (!DODO_CONFIG.webhookSecret) {
        console.error('DODO_WEBHOOK_SECRET not configured');
        return NextResponse.json(
          { error: 'Webhook secret not configured' },
          { status: 500 }
        );
      }

      // 使用 standardwebhooks 库验证签名
      try {
        const wh = new Webhook(DODO_CONFIG.webhookSecret);

        // 构造 webhook headers 对象
        const webhookHeaders = {
          'webhook-id': webhookId || '',
          'webhook-signature': webhookSignature,
          'webhook-timestamp': webhookTimestamp,
        };

        // 验证签名（会抛出异常如果验证失败）
        wh.verify(payload, webhookHeaders);
        console.log('✅ Webhook signature verified successfully');
      } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    // 解析事件数据
    const event = JSON.parse(payload);
    const eventType = event.type as DodoWebhookEvent;

    console.log('Received webhook event:', eventType);

    // 立即响应 200（webhook 最佳实践）
    const response = NextResponse.json({ received: true });

    // 异步处理 webhook 事件（不阻塞响应）
    // 注意：在无服务器环境中，这可能不会完全执行
    // 建议使用消息队列（如 SQS, Redis Queue）来处理
    processWebhookAsync(eventType, event).catch((error) => {
      console.error('Async webhook processing error:', error);
    });

    return response;
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
