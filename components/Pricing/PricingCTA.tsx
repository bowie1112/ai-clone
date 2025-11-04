'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PricingCTAProps {
  locale?: string;
}

/**
 * PricingCTA Component
 * 行动号召区域组件 - 极简专业风格
 */
export default function PricingCTA({ locale: propLocale }: PricingCTAProps) {
  const t = useTranslations('pricing.cta');
  const params = useParams();
  const locale = propLocale || (params.locale as string) || 'en';

  return (
    <div className="relative mb-24 px-4">
      {/* 简洁的灰色背景卡片 */}
      <div className="relative max-w-4xl mx-auto text-center py-16 px-8 rounded-lg bg-gray-50 border border-gray-200">
        {/* 标题 */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h2>

        {/* 副标题 */}
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {/* 按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* 联系销售按钮 */}
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {t('contactSales')}
          </Link>
        </div>

        {/* 信任元素 - 简洁文字 */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('trust.noCredit')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('trust.instantSetup')}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>{t('trust.moneyBack')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
