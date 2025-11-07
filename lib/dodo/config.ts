/**
 * Dodo Payments 配置
 * 用于管理支付相关的配置和常量
 */

// Dodo Payments API 配置
export const DODO_CONFIG = {
  apiKey: process.env.DODO_PAYMENTS_API_KEY || '',
  webhookSecret: process.env.DODO_WEBHOOK_SECRET || '',
  baseUrl: process.env.DODO_BASE_URL || 'https://api.dodopayments.com',
  testMode: process.env.DODO_TEST_MODE === 'true',
} as const;

// 验证配置
if (!DODO_CONFIG.apiKey) {
  console.warn('⚠️ DODO_PAYMENTS_API_KEY is not set');
}

if (!DODO_CONFIG.webhookSecret) {
  console.warn('⚠️ DODO_WEBHOOK_SECRET is not set');
}

// 积分包配置
export const CREDIT_PACKAGES = [
  {
    id: 'pdt_Yx6bTyxVG2e02BeXAsb9i',
    name: '50 Credits',
    credits: 50,
    price: 4.99,
    currency: 'USD',
    description: 'Perfect for trying out',
    popular: false,
  },
  {
    id: 'pdt_QI7mLpKaeGrFNijDk2Jvw',
    name: '100 Credits',
    credits: 100,
    price: 8.99,
    currency: 'USD',
    description: 'Great starter pack',
    popular: false,
    discount: 10, // 10% discount
  },
  {
    id: 'pdt_tCVkKlzGiZsW4OpLQrD2i',
    name: '500 Credits',
    credits: 500,
    price: 39.99,
    currency: 'USD',
    description: 'Great for regular use',
    popular: true,
    discount: 20, // 20% discount
  },
  {
    id: 'pdt_PpGUI8HB2jN1feXbwjqI0',
    name: '1000 Credits',
    credits: 1000,
    price: 69.99,
    currency: 'USD',
    description: 'Best value for professionals',
    popular: false,
    discount: 30, // 30% discount
  },
] as const;

// 订阅计划配置
export const SUBSCRIPTION_PLANS = [
  {
    id: 'plan_free',
    name: 'Free',
    type: 'free',
    interval: 'month',
    price: 0,
    yearlyPrice: 0,
    currency: 'USD',
    credits: 10,
    features: [
      '10 credits per month',
      'Standard generation',
      'Up to 720p resolution',
      'Basic support',
      'Watermark removal (additional cost)',
    ],
    popular: false,
  },
  {
    id: 'plan_basic_monthly',
    name: 'Basic',
    type: 'basic',
    interval: 'month',
    price: 9.99,
    yearlyPrice: 99.99,
    currency: 'USD',
    credits: 100,
    features: [
      '100 credits per month',
      'Fast generation',
      'Up to 1080p resolution',
      'No watermark',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'plan_pro_monthly',
    name: 'Pro',
    type: 'pro',
    interval: 'month',
    price: 29.99,
    yearlyPrice: 299.99,
    currency: 'USD',
    credits: 500,
    features: [
      '500 credits per month',
      'Priority generation',
      'Up to 4K resolution',
      'No watermark',
      'Advanced features',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'plan_enterprise_monthly',
    name: 'Enterprise',
    type: 'enterprise',
    interval: 'month',
    price: null, // Custom pricing
    yearlyPrice: null,
    currency: 'USD',
    credits: -1, // Unlimited
    features: [
      'Suitable for large teams',
      'Priority service',
      'API access',
      'Custom features',
      '24/7 dedicated support',
    ],
    popular: false,
    custom: true,
  },
] as const;

// 视频生成积分消耗配置
export const VIDEO_CREDIT_COST = {
  quality: {
    standard: 1,
    hd: 2,
    '4k': 5,
  },
  duration: {
    // 每秒的基础积分
    base: 1,
  },
} as const;

/**
 * 计算视频生成所需积分
 */
export function calculateVideoCredits(
  duration: number,
  quality: 'standard' | 'hd' | '4k' = 'standard'
): number {
  const qualityMultiplier = VIDEO_CREDIT_COST.quality[quality];
  const baseCost = duration * VIDEO_CREDIT_COST.duration.base;
  return Math.ceil(baseCost * qualityMultiplier);
}

// Webhook 事件类型
export enum DodoWebhookEvent {
  // Payment events
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_SUCCEEDED = 'payment.succeeded',
  PAYMENT_FAILED = 'payment.failed',

  // Subscription events
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_DELETED = 'subscription.deleted',
  SUBSCRIPTION_TRIAL_ENDING = 'subscription.trial_ending',

  // Customer events
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',
  CUSTOMER_DELETED = 'customer.deleted',

  // Refund events
  REFUND_CREATED = 'refund.created',
  REFUND_UPDATED = 'refund.updated',
}

// API 端点
export const DODO_ENDPOINTS = {
  // Payment links
  createPaymentLink: '/payment-links',

  // Customers
  createCustomer: '/customers',
  getCustomer: (customerId: string) => `/customers/${customerId}`,
  updateCustomer: (customerId: string) => `/customers/${customerId}`,

  // Subscriptions
  createSubscription: '/subscriptions',
  getSubscription: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  updateSubscription: (subscriptionId: string) => `/subscriptions/${subscriptionId}`,
  cancelSubscription: (subscriptionId: string) => `/subscriptions/${subscriptionId}/cancel`,

  // Events (for usage-based billing)
  ingestEvent: '/events/ingest',

  // Refunds
  createRefund: '/refunds',
  getRefund: (refundId: string) => `/refunds/${refundId}`,
} as const;

export type CreditPackage = typeof CREDIT_PACKAGES[number];
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[number];
