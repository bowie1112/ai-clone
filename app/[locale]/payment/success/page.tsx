/**
 * 支付成功页面
 * /payment/success
 */

import { Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';

function SuccessContent() {
  const t = useTranslations('payment');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* 成功图标 */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg
            className="h-10 w-10 text-green-600"
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
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('success.title')}
        </h1>

        {/* 描述 */}
        <p className="text-gray-600 mb-8">
          {t('success.description')}
        </p>

        {/* 提示信息 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            {t('success.processingNote')}
          </p>
        </div>

        {/* 操作按钮 */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            {t('success.goToDashboard')}
          </Link>

          <Link
            href="/"
            className="block w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors"
          >
            {t('success.backToHome')}
          </Link>
        </div>

        {/* 帮助链接 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {t('success.needHelp')}{' '}
            <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('success.contactSupport')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function PaymentSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
