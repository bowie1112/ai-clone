'use client';

import { useTranslations } from 'next-intl';

/**
 * PricingHero Component
 * Pricing 页面的头部组件 - 极简专业风格
 */
export default function PricingHero() {
  const t = useTranslations('pricing');

  return (
    <div className="text-center max-w-3xl mx-auto mb-20 px-4 pt-12">
      {/* 标题 - 简洁的黑色字体 */}
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
        {t('title')}
      </h1>

      {/* 副标题 - 中性灰色 */}
      <p className="text-xl text-gray-600 mb-12 leading-relaxed">
        {t('subtitle')}
      </p>

      {/* 信任标识 - 简洁的图标 + 文字 */}
      <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{t('features.noCard')}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{t('features.cancelAnytime')}</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>{t('features.moneyBack')}</span>
        </div>
      </div>
    </div>
  );
}
