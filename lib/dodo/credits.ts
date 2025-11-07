/**
 * 用户积分管理
 * 处理积分的增加、扣除和查询
 */

import { prisma } from '@/lib/prisma';
import { CreditTransactionType } from '@prisma/client';

/**
 * 获取用户积分余额
 */
export async function getUserCredits(userId: string): Promise<number> {
  const credit = await prisma.userCredit.findUnique({
    where: { userId },
  });

  return credit?.balance || 0;
}

/**
 * 初始化用户积分账户
 */
export async function initializeUserCredits(userId: string): Promise<void> {
  await prisma.userCredit.upsert({
    where: { userId },
    create: {
      userId,
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
    },
    update: {},
  });
}

/**
 * 增加用户积分
 */
export async function addCredits(params: {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description?: string;
  paymentId?: string;
  metadata?: Record<string, any>;
}): Promise<{ balance: number; transaction: any }> {
  const { userId, amount, type, description, paymentId, metadata } = params;

  if (amount <= 0) {
    throw new Error('Credit amount must be positive');
  }

  // 确保用户积分账户存在
  await initializeUserCredits(userId);

  // 使用事务确保数据一致性
  const result = await prisma.$transaction(async (tx) => {
    // 获取当前余额
    const credit = await tx.userCredit.findUnique({
      where: { userId },
    });

    if (!credit) {
      throw new Error('User credit account not found');
    }

    const balanceBefore = credit.balance;
    const balanceAfter = balanceBefore + amount;

    // 更新积分余额
    const updatedCredit = await tx.userCredit.update({
      where: { userId },
      data: {
        balance: balanceAfter,
        totalEarned: credit.totalEarned + amount,
      },
    });

    // 创建交易记录
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        type,
        amount,
        balanceBefore,
        balanceAfter,
        paymentId,
        description,
        metadata,
      },
    });

    return { balance: updatedCredit.balance, transaction };
  });

  console.log(
    `Added ${amount} credits to user ${userId}. New balance: ${result.balance}`
  );

  return result;
}

/**
 * 扣除用户积分
 */
export async function deductCredits(params: {
  userId: string;
  amount: number;
  type: CreditTransactionType;
  description?: string;
  videoId?: string;
  metadata?: Record<string, any>;
}): Promise<{ balance: number; transaction: any }> {
  const { userId, amount, type, description, videoId, metadata } = params;

  if (amount <= 0) {
    throw new Error('Credit amount must be positive');
  }

  // 使用事务确保数据一致性
  const result = await prisma.$transaction(async (tx) => {
    // 获取当前余额
    const credit = await tx.userCredit.findUnique({
      where: { userId },
    });

    if (!credit) {
      throw new Error('User credit account not found');
    }

    const balanceBefore = credit.balance;

    // 检查余额是否足够
    if (balanceBefore < amount) {
      throw new Error('Insufficient credits');
    }

    const balanceAfter = balanceBefore - amount;

    // 更新积分余额
    const updatedCredit = await tx.userCredit.update({
      where: { userId },
      data: {
        balance: balanceAfter,
        totalSpent: credit.totalSpent + amount,
      },
    });

    // 创建交易记录（负数表示扣除）
    const transaction = await tx.creditTransaction.create({
      data: {
        userId,
        type,
        amount: -amount,
        balanceBefore,
        balanceAfter,
        videoId,
        description,
        metadata,
      },
    });

    return { balance: updatedCredit.balance, transaction };
  });

  console.log(
    `Deducted ${amount} credits from user ${userId}. New balance: ${result.balance}`
  );

  return result;
}

/**
 * 检查用户是否有足够的积分
 */
export async function hasEnoughCredits(
  userId: string,
  amount: number
): Promise<boolean> {
  const balance = await getUserCredits(userId);
  return balance >= amount;
}

/**
 * 获取用户积分交易历史
 */
export async function getCreditTransactions(
  userId: string,
  params?: {
    limit?: number;
    offset?: number;
    type?: CreditTransactionType;
  }
) {
  const { limit = 20, offset = 0, type } = params || {};

  const where = {
    userId,
    ...(type && { type }),
  };

  const [transactions, total] = await Promise.all([
    prisma.creditTransaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.creditTransaction.count({ where }),
  ]);

  return {
    transactions,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * 获取用户积分统计
 */
export async function getCreditStats(userId: string) {
  const credit = await prisma.userCredit.findUnique({
    where: { userId },
    include: {
      transactions: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });

  if (!credit) {
    return {
      balance: 0,
      totalEarned: 0,
      totalSpent: 0,
      recentTransactions: [],
    };
  }

  return {
    balance: credit.balance,
    totalEarned: credit.totalEarned,
    totalSpent: credit.totalSpent,
    recentTransactions: credit.transactions,
  };
}

/**
 * 批量添加积分（用于订阅续费）
 */
export async function grantSubscriptionCredits(
  userId: string,
  credits: number,
  subscriptionId: string
): Promise<void> {
  await addCredits({
    userId,
    amount: credits,
    type: CreditTransactionType.SUBSCRIPTION,
    description: `Monthly subscription credits`,
    metadata: {
      subscriptionId,
    },
  });
}

/**
 * 退款时返还积分
 */
export async function refundCredits(
  userId: string,
  amount: number,
  paymentId: string,
  reason?: string
): Promise<void> {
  await addCredits({
    userId,
    amount,
    type: CreditTransactionType.REFUND,
    description: reason || 'Payment refund',
    paymentId,
  });
}
