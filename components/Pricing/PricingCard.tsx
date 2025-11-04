'use client';

import { useTranslations } from 'next-intl';
import { PricingPlan, BillingPeriod } from '@/types/pricing';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface PricingCardProps {
  plan: PricingPlan;
  period: BillingPeriod;
  locale?: string;
}

/**
 * PricingCard Component
 * 单个定价卡片组件 - 极简专业风格
 */
export default function PricingCard({ plan, period, locale: propLocale }: PricingCardProps) {
  const t = useTranslations('pricing');
  const params = useParams();
  const locale = propLocale || (params.locale as string) || 'en';

  const price = period === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  const isEnterprise = plan.id === 'enterprise';

  return (
    <div
      className={`relative rounded-lg p-8 transition-all ${
        plan.highlighted
          ? 'bg-white border-2 border-gray-900 shadow-lg ring-4 ring-gray-900/5'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* 推荐标签 */}
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
            {t('popular')}
          </span>
        </div>
      )}

      {/* 套餐名称 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {plan.name}
        </h3>
        <p className="text-sm text-gray-500">
          {plan.description}
        </p>
      </div>

      {/* 价格 */}
      <div className="mb-8">
        {isEnterprise ? (
          <div className="text-3xl font-bold text-gray-900">
            {t('plans.enterprise.customPrice')}
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900">
                {plan.currency}{price}
              </span>
              <span className="text-base text-gray-500">
                /{t(period === 'monthly' ? 'perMonth' : 'perYear')}
              </span>
            </div>
            {period === 'yearly' && price > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {t('billedAnnually', { amount: `${plan.currency}${price}` })}
              </p>
            )}
          </>
        )}
      </div>

      {/* CTA 按钮 */}
      <Link
        href={isEnterprise ? `/${locale}/contact` : `/${locale}/signup?plan=${plan.id}`}
        className={`block w-full py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-all mb-8 ${
          plan.highlighted
            ? 'bg-gray-900 text-white hover:bg-gray-800'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {plan.cta}
      </Link>

      {/* 功能列表 */}
      <ul className="space-y-3">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            {feature.included ? (
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span
              className={`text-sm ${
                feature.included
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
