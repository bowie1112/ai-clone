/**
 * 存储管理模块
 * 管理 Cookie 和 LocalStorage 的游客使用记录
 */

"use client";

const STORAGE_KEY = 'guest_video_used';
const COOKIE_NAME = 'guest_video_used';
const COOKIE_EXPIRES_DAYS = 365; // Cookie 有效期 1 年

/**
 * 设置 Cookie
 */
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

/**
 * 获取 Cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * 检查本地存储是否已标记为已使用
 */
export function isMarkedAsUsedLocally(): boolean {
  try {
    // 检查 LocalStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const localValue = localStorage.getItem(STORAGE_KEY);
      if (localValue === 'true') {
        return true;
      }
    }

    // 检查 Cookie
    const cookieValue = getCookie(COOKIE_NAME);
    if (cookieValue === 'true') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking local storage:', error);
    return false;
  }
}

/**
 * 标记为已使用（写入 LocalStorage 和 Cookie）
 */
export function markAsUsedLocally(): void {
  try {
    // 设置 LocalStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, 'true');
    }

    // 设置 Cookie
    setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRES_DAYS);
  } catch (error) {
    console.error('Error marking as used:', error);
  }
}

/**
 * 清除本地标记（仅用于测试）
 */
export function clearLocalMarks(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(STORAGE_KEY);
    }
    // 清除 Cookie（设置过期时间为过去）
    setCookie(COOKIE_NAME, '', -1);
  } catch (error) {
    console.error('Error clearing local marks:', error);
  }
}

/**
 * 获取存储的使用信息（用于调试）
 */
export function getStorageInfo() {
  return {
    localStorage: typeof window !== 'undefined' && window.localStorage
      ? localStorage.getItem(STORAGE_KEY)
      : null,
    cookie: getCookie(COOKIE_NAME),
  };
}
