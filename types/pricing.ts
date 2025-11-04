/**
 * Pricing Types
 * 定价页面相关的类型定义
 */

export type BillingPeriod = 'monthly' | 'yearly';

export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface PricingFeature {
  text: string;
  included: boolean;
  tooltip?: string;
}

export interface PricingPlan {
  id: PlanType;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  popular?: boolean;
}

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  currency: string;
  discount?: number;
  popular?: boolean;
}

export interface ComparisonFeature {
  category: string;
  features: {
    name: string;
    free: string | boolean;
    basic: string | boolean;
    pro: string | boolean;
    enterprise: string | boolean;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingConfig {
  plans: PricingPlan[];
  creditPackages: CreditPackage[];
  comparisonFeatures: ComparisonFeature[];
  faqs: FAQItem[];
  yearlyDiscount: number; // 年付折扣百分比
}
