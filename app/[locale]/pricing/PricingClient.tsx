'use client';

import { useState } from 'react';
import { BillingPeriod } from '@/types/pricing';
import PricingHero from '@/components/Pricing/PricingHero';
import PricingToggle from '@/components/Pricing/PricingToggle';
import PricingGrid from '@/components/Pricing/PricingGrid';
import CreditPackages from '@/components/Pricing/CreditPackages';
import PricingComparison from '@/components/Pricing/PricingComparison';
import PricingFAQ from '@/components/Pricing/PricingFAQ';
import PricingCTA from '@/components/Pricing/PricingCTA';

interface PricingClientProps {
  locale: string;
}

/**
 * PricingClient Component
 * 客户端定价页面组件
 */
export default function PricingClient({ locale }: PricingClientProps) {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  return (
    <>
      {/* Hero 区域 */}
      <PricingHero />

      {/* 月付/年付切换 */}
      <PricingToggle
        period={billingPeriod}
        onChange={setBillingPeriod}
        discount={20}
      />

      {/* 定价卡片网格 */}
      <PricingGrid period={billingPeriod} locale={locale} />

      {/* 积分充值包 */}
      <CreditPackages locale={locale} />

      {/* 功能对比表 */}
      <PricingComparison />

      {/* FAQ 常见问题 */}
      <PricingFAQ />

      {/* CTA 行动号召 */}
      <PricingCTA locale={locale} />
    </>
  );
}
