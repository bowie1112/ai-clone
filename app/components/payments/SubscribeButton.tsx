'use client';

/**
 * 订阅按钮组件
 */

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface SubscribeButtonProps {
  userId: string;
  planId: string;
  planName: string;
  interval: 'month' | 'year';
  price: number | null;
  className?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  custom?: boolean;
}

export default function SubscribeButton({
  userId,
  planId,
  planName,
  interval,
  price,
  className = '',
  variant = 'primary',
  disabled = false,
  custom = false,
}: SubscribeButtonProps) {
  const t = useTranslations('payment');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    // 如果是自定义定价，跳转到联系页面
    if (custom) {
      window.location.href = '/contact';
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 调用创建 checkout API
      const response = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          type: 'subscription',
          productId: planId,
          interval,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create checkout');
      }

      const { url } = await response.json();

      // 重定向到支付页面
      window.location.href = url;
    } catch (err) {
      console.error('Subscribe error:', err);
      setError(err instanceof Error ? err.message : 'Subscribe failed');
      setLoading(false);
    }
  };

  const baseStyles =
    'w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300',
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSubscribe}
        disabled={disabled || loading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('processing')}
          </span>
        ) : custom ? (
          t('contactSales')
        ) : (
          t('subscribe')
        )}
      </button>

      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
