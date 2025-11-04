/**
 * 导航栏组件
 * 带有滚动效果、语言切换器和认证按钮
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === '1';
  const t = useTranslations('nav');
  const syncedUserId = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId || syncedUserId.current === userId) {
      return;
    }

    syncedUserId.current = userId;

    fetch('/api/users/sync', {
      method: 'POST',
      credentials: 'same-origin',
    })
      .then(async (res) => {
        if (!res.ok) {
          // 未登录或会话尚未落地，静默忽略，稍后会再次触发
          if (res.status === 401) return;
          // 其它错误则释放重试机会
          syncedUserId.current = null;
        }
      })
      .catch(() => {
        syncedUserId.current = null;
      });
  }, [session?.user?.id]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">
              Sora 2 AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {t('features')}
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {t('pricing')}
            </a>
            <a
              href="#about"
              className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            >
              {t('about')}
            </a>
          </div>

          {/* Auth Buttons & Language Switcher */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            
            {session?.user ? (
              <>
                <span className="hidden sm:inline text-gray-700">{session.user.email ?? t('login')}</span>
                <button
                  onClick={async () => {
                    await authClient.signOut();
                  }}
                  className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition-all duration-300"
                >
                  {t('logout')}
                </button>
              </>
            ) : googleEnabled ? (
              <button
                onClick={async () => {
                  await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
                }}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2.5 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t('login')}
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-200 text-gray-500 px-6 py-2.5 rounded-full font-medium cursor-not-allowed"
                title={t('login')}
              >
                {t('login')}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
