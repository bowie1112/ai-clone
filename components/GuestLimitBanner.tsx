/**
 * 游客限制提示横幅组件
 * 显示游客剩余生成次数
 */

"use client";

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { quickCheckLocal } from '@/lib/guest-limit/client-check';

interface GuestLimitBannerProps {
  isLoggedIn: boolean;
}

export function GuestLimitBanner({ isLoggedIn }: GuestLimitBannerProps) {
  const t = useTranslations('guestLimit');
  const [hasUsed, setHasUsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 如果已登录，不显示横幅
    if (isLoggedIn) {
      setLoading(false);
      return;
    }

    // 检查游客是否已使用
    async function checkLocal() {
      const canUse = await quickCheckLocal();
      setHasUsed(!canUse);
      setLoading(false);
    }

    checkLocal();
  }, [isLoggedIn]);

  // 登录用户不显示
  if (isLoggedIn || loading) {
    return null;
  }

  return (
    <div className={`rounded-lg p-4 mb-4 ${
      hasUsed
        ? 'bg-red-50 border border-red-200'
        : 'bg-blue-50 border border-blue-200'
    }`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {hasUsed ? (
            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <h3 className={`text-sm font-medium ${
            hasUsed ? 'text-red-900' : 'text-blue-900'
          }`}>
            {hasUsed ? t('limitExceeded') : t('freeTrialAvailable')}
          </h3>
          <p className={`mt-1 text-sm ${
            hasUsed ? 'text-red-700' : 'text-blue-700'
          }`}>
            {hasUsed ? t('limitExceededMessage') : t('remainingAttempts', { count: 1 })}
          </p>
        </div>
        {hasUsed && (
          <div>
            <a
              href="/login"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              {t('signInButton')}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
