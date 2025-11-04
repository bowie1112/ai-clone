/**
 * 客户端游客限制检查模块
 * 综合检查本地存储和服务器端记录
 */

"use client";

import { getClientIdentity } from './fingerprint';
import { isMarkedAsUsedLocally, markAsUsedLocally } from './storage';

export interface GuestCheckResult {
  allowed: boolean;
  reason?: string;
  remainingAttempts: number;
}

/**
 * 客户端快速检查（不调用 API）
 * 只检查本地存储
 */
export async function quickCheckLocal(): Promise<boolean> {
  return !isMarkedAsUsedLocally();
}

/**
 * 完整的游客检查（调用服务器 API）
 */
export async function checkGuestLimit(): Promise<GuestCheckResult> {
  try {
    // 1. 先检查本地存储（快速失败）
    if (isMarkedAsUsedLocally()) {
      return {
        allowed: false,
        reason: 'local_storage',
        remainingAttempts: 0,
      };
    }

    // 2. 获取客户端识别信息
    const identity = await getClientIdentity();

    // 3. 调用服务器 API 检查
    const response = await fetch('/api/guest/check', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(identity),
    });

    if (!response.ok) {
      throw new Error('Failed to check guest limit');
    }

    const result: GuestCheckResult = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking guest limit:', error);
    // 出错时允许继续（友好降级）
    return {
      allowed: true,
      reason: 'error_fallback',
      remainingAttempts: 1,
    };
  }
}

/**
 * 记录游客使用
 * @param videoId 生成的视频 ID
 */
export async function recordGuestUsage(videoId: string): Promise<void> {
  try {
    // 1. 标记本地存储
    markAsUsedLocally();

    // 2. 获取客户端识别信息
    const identity = await getClientIdentity();

    // 3. 调用服务器 API 记录
    const response = await fetch('/api/guest/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...identity,
        videoId,
      }),
    });

    if (!response.ok) {
      console.error('Failed to record guest usage on server');
    }
  } catch (error) {
    console.error('Error recording guest usage:', error);
    // 即使服务器记录失败，本地标记已设置
  }
}
