/**
 * Dodo Payments 客户管理
 * 处理客户创建、更新和同步
 */

import { prisma } from '@/lib/prisma';
import { dodoClient } from './client';

/**
 * 为用户创建或获取 Dodo 客户
 */
export async function getOrCreateDodoCustomer(userId: string): Promise<string> {
  // 查找用户
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      payments: {
        where: {
          dodoCustomerId: { not: null },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  });

  if (!user) {
    // 若用户未同步到本地数据库，则创建占位记录，避免支付流程中断
    const placeholderEmail = `${userId}@placeholder.local`;
    const created = await prisma.user.create({
      data: {
        id: userId,
        email: placeholderEmail,
        name: null,
      },
    });

    console.warn(
      `⚠️ Placeholder user created: ${created.id} (${placeholderEmail}). ` +
      'Consider calling /api/users/sync right after sign-in to persist real profile.'
    );

    return await getOrCreateDodoCustomer(userId); // 递归调用以继续流程
  }

  // 如果用户已有 Dodo 客户 ID，直接返回
  if (user.payments.length > 0 && user.payments[0].dodoCustomerId) {
    return user.payments[0].dodoCustomerId;
  }

  // 创建新的 Dodo 客户
  try {
    const customer = await dodoClient.createCustomer({
      email: user.email,
      name: user.name || undefined,
      metadata: {
        userId: user.id,
        createdAt: user.createdAt.toISOString(),
      },
    });

    console.log(`Created Dodo customer ${customer.id} for user ${userId}`);

    return customer.id;
  } catch (error) {
    console.error('Failed to create Dodo customer:', error);
    throw new Error('Failed to create payment customer');
  }
}

/**
 * 同步 Dodo 客户信息到本地数据库
 */
export async function syncDodoCustomer(
  dodoCustomerId: string,
  userId: string
): Promise<void> {
  try {
    const customer = await dodoClient.getCustomer(dodoCustomerId);

    await prisma.user.update({
      where: { id: userId },
      data: {
        email: customer.email,
        name: customer.name || undefined,
      },
    });

    console.log(`Synced Dodo customer ${dodoCustomerId} to user ${userId}`);
  } catch (error) {
    console.error('Failed to sync Dodo customer:', error);
    throw error;
  }
}

/**
 * 更新 Dodo 客户信息
 */
export async function updateDodoCustomer(
  dodoCustomerId: string,
  params: {
    name?: string;
    email?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> {
  try {
    await dodoClient.updateCustomer(dodoCustomerId, params);
    console.log(`Updated Dodo customer ${dodoCustomerId}`);
  } catch (error) {
    console.error('Failed to update Dodo customer:', error);
    throw error;
  }
}

/**
 * 获取用户的 Dodo 客户 ID
 */
export async function getUserDodoCustomerId(
  userId: string
): Promise<string | null> {
  const payment = await prisma.payment.findFirst({
    where: {
      userId,
      dodoCustomerId: { not: null },
    },
    orderBy: { createdAt: 'desc' },
  });

  return payment?.dodoCustomerId || null;
}
