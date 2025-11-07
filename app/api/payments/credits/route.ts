/**
 * 用户积分 API
 * GET /api/payments/credits - 获取积分信息和交易历史
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCreditStats, getCreditTransactions } from '@/lib/dodo/credits';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const includeTransactions = searchParams.get('includeTransactions') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // 获取积分统计
    const stats = await getCreditStats(userId);

    // 如果需要交易历史
    let transactionData = null;
    if (includeTransactions) {
      transactionData = await getCreditTransactions(userId, {
        limit,
        offset,
      });
    }

    return NextResponse.json({
      credits: stats,
      transactions: transactionData,
    });
  } catch (error) {
    console.error('Get credits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credits' },
      { status: 500 }
    );
  }
}
