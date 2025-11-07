'use client';

import { useTranslations } from 'next-intl';

export default function CTASection() {
  const t = useTranslations('cta');
  
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="relative max-w-4xl mx-auto text-center">
        {/* 标题 */}
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          {t('title')}
        </h2>

        {/* 副标题 */}
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {/* CTA 按钮 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg text-base font-medium hover:bg-gray-800 transition-colors">
            {t('primaryButton')}
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-base font-medium hover:bg-white transition-colors">
            {t('secondaryButton')}
        </button>
        </div>

        {/* 额外信息 */}
        <p className="mt-8 text-sm text-gray-500">
          {t('footnote')}
        </p>
      </div>
    </section>
  );
}
