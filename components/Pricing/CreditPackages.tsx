'use client';

import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { CREDIT_PACKAGES } from '@/lib/dodo/config';
import PurchaseButton from '@/app/components/payments/PurchaseButton';

interface CreditPackagesProps {
  locale?: string;
}

/**
 * CreditPackages Component
 * 积分充值包组件 - 极简专业风格
 */
export default function CreditPackages({ locale: propLocale }: CreditPackagesProps) {
  const t = useTranslations('pricing.creditPackages');
  const params = useParams();
  const locale = propLocale || (params.locale as string) || 'en';

  const { data: session } = authClient.useSession();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === '1';

  const packages = CREDIT_PACKAGES.map((p) => ({
    id: p.id,
    credits: p.credits,
    price: p.price,
    discount: 'discount' in p ? p.discount! : 0,
    popular: p.popular ?? false,
    name: p.name,
  }));

  return (
    <div className="mb-24 px-4">
      {/* 标题 */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          {t('title')}
        </h2>
        <p className="text-lg text-gray-600">
          {t('subtitle')}
        </p>
      </div>

      {/* 积分包网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`relative rounded-lg p-6 transition-all ${
              pkg.popular
                ? 'bg-white border-2 border-gray-900 shadow-lg'
                : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
            }`}
          >
            {/* 热门标签 */}
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white">
                  {t('bestValue')}
                </span>
              </div>
            )}

            {/* 折扣标签 */}
            {pkg.discount > 0 && (
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                  -{pkg.discount}%
                </span>
              </div>
            )}

            {/* 积分数量 */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-900 mb-4">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {pkg.credits}
              </h3>
              <p className="text-sm text-gray-500">
                {t('credits')}
              </p>
            </div>

            {/* 价格 */}
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                ${pkg.price}
              </div>
              {pkg.discount > 0 && (
                <p className="text-sm text-gray-500">
                  {t('save', { percent: pkg.discount })}
                </p>
              )}
            </div>

            {/* 购买按钮 */}
            {session?.user?.id ? (
              <PurchaseButton
                userId={session.user.id}
                productId={pkg.id}
                productName={pkg.name}
                price={pkg.price}
                credits={pkg.credits}
                variant={pkg.popular ? 'primary' : 'secondary'}
                className="w-full !py-2.5 !px-4 !text-sm"
              />
            ) : (
              <button
                onClick={async () => {
                  if (googleEnabled) {
                    await authClient.signIn.social({ provider: 'google', callbackURL: `/${locale}/pricing` });
                  }
                }}
                className={`block w-full py-2.5 px-4 rounded-lg text-center text-sm font-medium transition-all ${
                  pkg.popular
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {t('buyNow')}
              </button>
            )}

            {/* 额外信息 */}
            <p className="text-xs text-center text-gray-500 mt-4">
              {t('noExpiry')}
            </p>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          {t('note')}
        </p>
      </div>
    </div>
  );
}
