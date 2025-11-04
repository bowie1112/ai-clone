'use client';

import { BillingPeriod } from '@/types/pricing';
import PricingCard from './PricingCard';
import { useTranslations } from 'next-intl';

interface PricingGridProps {
  period: BillingPeriod;
  locale: string;
}

/**
 * PricingGrid Component
 * 定价卡片网格布局
 */
export default function PricingGrid({ period, locale }: PricingGridProps) {
  const t = useTranslations('pricing.plans');

  // 定义定价方案
  const plans = [
    {
      id: 'free' as const,
      name: t('free.name'),
      description: t('free.description'),
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: '$',
      cta: t('free.cta'),
      popular: false,
      highlighted: false,
      features: [
        { text: t('free.features.credits'), included: true },
        { text: t('free.features.speed'), included: true },
        { text: t('free.features.resolution'), included: true },
        { text: t('free.features.support'), included: true },
        { text: t('free.features.watermark'), included: false },
      ],
    },
    {
      id: 'basic' as const,
      name: t('basic.name'),
      description: t('basic.description'),
      monthlyPrice: 9.99,
      yearlyPrice: 95.9, // ~20% discount
      currency: '$',
      cta: t('basic.cta'),
      popular: false,
      highlighted: false,
      features: [
        { text: t('basic.features.credits'), included: true },
        { text: t('basic.features.speed'), included: true },
        { text: t('basic.features.resolution'), included: true },
        { text: t('basic.features.watermark'), included: true },
        { text: t('basic.features.support'), included: true },
      ],
    },
    {
      id: 'pro' as const,
      name: t('pro.name'),
      description: t('pro.description'),
      monthlyPrice: 29.99,
      yearlyPrice: 287.9, // ~20% discount
      currency: '$',
      cta: t('pro.cta'),
      popular: true,
      highlighted: true,
      features: [
        { text: t('pro.features.credits'), included: true },
        { text: t('pro.features.speed'), included: true },
        { text: t('pro.features.resolution'), included: true },
        { text: t('pro.features.watermark'), included: true },
        { text: t('pro.features.advanced'), included: true },
        { text: t('pro.features.support'), included: true },
      ],
    },
    {
      id: 'enterprise' as const,
      name: t('enterprise.name'),
      description: t('enterprise.description'),
      monthlyPrice: 0,
      yearlyPrice: 0,
      currency: '$',
      cta: t('enterprise.cta'),
      popular: false,
      highlighted: false,
      features: [
        { text: t('enterprise.features.credits'), included: true },
        { text: t('enterprise.features.server'), included: true },
        { text: t('enterprise.features.api'), included: true },
        { text: t('enterprise.features.custom'), included: true },
        { text: t('enterprise.features.support'), included: true },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 px-4">
      {plans.map((plan) => (
        <PricingCard key={plan.id} plan={plan} period={period} locale={locale} />
      ))}
    </div>
  );
}
