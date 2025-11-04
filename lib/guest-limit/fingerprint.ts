/**
 * 浏览器指纹检测模块
 * 使用 FingerprintJS 生成唯一的设备标识
 */

"use client";

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * 初始化 FingerprintJS
 */
function initFingerprint() {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
}

/**
 * 获取浏览器指纹
 * @returns Promise<string> 返回唯一的指纹 ID
 */
export async function getFingerprint(): Promise<string> {
  try {
    const fp = await initFingerprint();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Failed to get fingerprint:', error);
    // 如果获取失败，返回基于时间戳和随机数的后备方案
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * 获取用户代理字符串
 */
export function getUserAgent(): string {
  return typeof window !== 'undefined' ? window.navigator.userAgent : '';
}

/**
 * 获取完整的客户端识别信息
 */
export async function getClientIdentity() {
  const fingerprint = await getFingerprint();
  const userAgent = getUserAgent();

  return {
    fingerprint,
    userAgent,
  };
}
