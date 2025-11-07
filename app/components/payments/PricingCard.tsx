'use client';

/**
 * 定价卡片组件
 */

import { useTranslations } from 'next-intl';
import SubscribeButton from './SubscribeButton';

interface PricingCardProps {
  userId?: string;
  planId: string;
  planName: string;
  planType: string;
  price: number | null;
  yearlyPrice?: number | null;
  interval: 'month' | 'year';
  credits: number;
  features: string[];
  popular?: boolean;
  custom?: boolean;
  className?: string;
}

export default function PricingCard({
  userId,
  planId,
  planName,
  planType,
  price,
  yearlyPrice,
  interval,
  credits,
  features,
  popular = false,
  custom = false,
  className = '',
}: PricingCardProps) {
  const t = useTranslations('payment');

  const displayPrice = interval === 'year' ? yearlyPrice : price;
  const monthlySavings = yearlyPrice && price
    ? Math.round((1 - yearlyPrice / (price * 12)) * 100)
    : 0;

  return (
    <div
      className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-lg border-2 ${
        popular ? 'border-blue-500' : 'border-gray-200'
      } ${className}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-sm font-medium rounded-full">
          {t('mostPopular')}
        </div>
      )}

      {/* 计划名称 */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900">{planName}</h3>
      </div>

      {/* 价格 */}
      <div className="mb-6">
        {custom ? (
          <div className="text-2xl font-bold text-gray-900">
            {t('customPricing')}
          </div>
        ) : displayPrice === null ? (
          <div className="text-2xl font-bold text-gray-900">
            {t('free')}
          </div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              ${displayPrice}
            </span>
            <span className="text-gray-600">
              /{interval === 'year' ? t('year') : t('month')}
            </span>
          </div>
        )}

        {interval === 'year' && monthlySavings > 0 && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            {t('save', { percent: monthlySavings })}
          </p>
        )}

        {interval === 'year' && yearlyPrice && (
          <p className="mt-1 text-sm text-gray-500">
            {t('billedAnnually', { amount: `$${yearlyPrice}` })}
          </p>
        )}
      </div>

      {/* 积分 */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-lg font-semibold text-blue-900">
          {credits === -1 ? t('unlimitedCredits') : `${credits} ${t('credits')}`}
          {credits !== -1 && ` / ${interval === 'year' ? t('year') : t('month')}`}
        </p>
      </div>

      {/* 功能列表 */}
      <ul className="mb-8 space-y-4 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* 订阅按钮 */}
      {userId ? (
        <SubscribeButton
          userId={userId}
          planId={planId}
          planName={planName}
          interval={interval}
          price={displayPrice}
          variant={popular ? 'primary' : 'secondary'}
          custom={custom}
        />
      ) : (
        <a
          href="/auth/login"
          className={`w-full px-6 py-3 rounded-lg font-medium text-center transition-all duration-200 ${
            popular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
          }`}
        >
          {t('signInToSubscribe')}
        </a>
      )}
    </div>
  );
}
