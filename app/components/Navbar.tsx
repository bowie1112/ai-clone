/**
 * 导航栏组件
 * 带有滚动效果、语言切换器和认证按钮
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session } = authClient.useSession();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === '1';
  const t = useTranslations('nav');
  const locale = useLocale();
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

    (async () => {
      try {
        const res = await fetch('/api/users/sync', {
          method: 'POST',
          credentials: 'same-origin',
        });
        if (!res.ok && res.status !== 401) {
          // 非授权错误才打印
          console.debug('User sync failed:', res.status);
          syncedUserId.current = null;
        }
      } catch (error) {
        // 静默失败，稍后重试
        syncedUserId.current = null;
      }
    })();
  }, [session?.user?.id]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white border-b border-gray-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              isScrolled ? 'bg-gray-900' : 'bg-white'
            }`}>
              <svg
                className={`w-5 h-5 transition-colors ${
                  isScrolled ? 'text-white' : 'text-gray-900'
                }`}
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
            <span className={`text-lg font-semibold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              Sora 2 AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className={`text-sm transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {t('features')}
            </a>
            <Link
              href={`/${locale}/pricing`}
              className={`text-sm transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {t('pricing')}
            </Link>
            <a
              href="#about"
              className={`text-sm transition-colors ${
                isScrolled 
                  ? 'text-gray-600 hover:text-gray-900' 
                  : 'text-white/90 hover:text-white'
              }`}
            >
              {t('about')}
            </a>
          </div>

          {/* Auth Buttons & Language Switcher */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            {session?.user ? (
              <>
                <span className={`hidden sm:inline text-sm transition-colors ${
                  isScrolled ? 'text-gray-600' : 'text-white/90'
                }`}>{session.user.email ?? t('login')}</span>
                <button
                  onClick={async () => {
                    await authClient.signOut();
                  }}
                  className={`text-sm px-4 py-2 transition-colors ${
                    isScrolled 
                      ? 'text-gray-600 hover:text-gray-900' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {t('logout')}
                </button>
              </>
            ) : googleEnabled ? (
              <button
                onClick={async () => {
                  await authClient.signIn.social({ provider: 'google', callbackURL: '/' });
                }}
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                  isScrolled
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-white text-gray-900 hover:bg-gray-100'
                }`}
              >
                {t('login')}
              </button>
            ) : (
              <button
                disabled
                className="bg-gray-200 text-gray-400 text-sm px-4 py-2 rounded-lg font-medium cursor-not-allowed"
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
