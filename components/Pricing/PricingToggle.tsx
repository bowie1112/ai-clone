'use client';

import { useTranslations } from 'next-intl';
import { BillingPeriod } from '@/types/pricing';

interface PricingToggleProps {
  period: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
  discount?: number;
}

/**
 * PricingToggle Component
 * 月付/年付切换组件 - 极简风格
 */
export default function PricingToggle({ period, onChange, discount = 20 }: PricingToggleProps) {
  const t = useTranslations('pricing');

  return (
    <div className="flex flex-col items-center gap-3 mb-16">
      {/* Toggle 开关 */}
      <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
        <button
          onClick={() => onChange('monthly')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            period === 'monthly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('monthly')}
        </button>

        <button
          onClick={() => onChange('yearly')}
          className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
            period === 'yearly'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {t('yearly')}
        </button>
      </div>

      {/* 折扣提示 - 简洁文字 */}
      {discount > 0 && period === 'yearly' && (
        <p className="text-sm text-gray-500">
          {t('save', { percent: discount })}
        </p>
      )}
    </div>
  );
}
