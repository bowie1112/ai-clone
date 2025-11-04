'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

/**
 * PricingComparison Component
 * 功能对比表组件 - 极简专业风格
 */
export default function PricingComparison() {
  const t = useTranslations('pricing.comparison');

  // 功能对比数据
  const comparisonData = [
    {
      category: t('categories.basic'),
      features: [
        {
          name: t('features.monthlyCredits'),
          free: '10',
          basic: '100',
          pro: '500',
          enterprise: t('unlimited'),
        },
        {
          name: t('features.speed'),
          free: t('standard'),
          basic: t('fast'),
          pro: t('priority'),
          enterprise: t('dedicated'),
        },
        {
          name: t('features.resolution'),
          free: '720p',
          basic: '1080p',
          pro: '4K',
          enterprise: '8K',
        },
        {
          name: t('features.watermark'),
          free: true,
          basic: false,
          pro: false,
          enterprise: false,
        },
      ],
    },
    {
      category: t('categories.features'),
      features: [
        {
          name: t('features.batchGeneration'),
          free: false,
          basic: true,
          pro: true,
          enterprise: true,
        },
        {
          name: t('features.advancedFeatures'),
          free: false,
          basic: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t('features.apiAccess'),
          free: false,
          basic: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t('features.customBranding'),
          free: false,
          basic: false,
          pro: false,
          enterprise: true,
        },
      ],
    },
    {
      category: t('categories.support'),
      features: [
        {
          name: t('features.emailSupport'),
          free: false,
          basic: true,
          pro: true,
          enterprise: true,
        },
        {
          name: t('features.prioritySupport'),
          free: false,
          basic: false,
          pro: true,
          enterprise: true,
        },
        {
          name: t('features.dedicatedSupport'),
          free: false,
          basic: false,
          pro: false,
          enterprise: true,
        },
      ],
    },
  ];

  const renderCell = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg className="w-5 h-5 text-gray-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>;
  };

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

      {/* 对比表格 - 桌面版 */}
      <div className="hidden lg:block max-w-6xl mx-auto overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* 表头 */}
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900">{t('feature')}</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-900">{t('plans.free')}</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-900">{t('plans.basic')}</th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-900 bg-gray-100 relative">
                  <span className="relative z-10">{t('plans.pro')}</span>
                  <div className="absolute -top-2 right-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-900 text-white">
                      {t('popular')}
                    </span>
                  </div>
                </th>
                <th className="py-4 px-6 text-center text-sm font-semibold text-gray-900">{t('plans.enterprise')}</th>
              </tr>
            </thead>

            {/* 表体 */}
            <tbody className="bg-white">
              {comparisonData.map((category, categoryIndex) => (
                <React.Fragment key={categoryIndex}>
                  {/* 分类标题 */}
                  <tr className="bg-gray-50">
                    <td
                      colSpan={5}
                      className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      {category.category}
                    </td>
                  </tr>
                  {/* 功能行 */}
                  {category.features.map((feature, featureIndex) => (
                    <tr
                      key={featureIndex}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6 text-sm text-gray-700">
                        {feature.name}
                      </td>
                      <td className="py-4 px-6 text-center">{renderCell(feature.free)}</td>
                      <td className="py-4 px-6 text-center">{renderCell(feature.basic)}</td>
                      <td className="py-4 px-6 text-center bg-gray-50">
                        {renderCell(feature.pro)}
                      </td>
                      <td className="py-4 px-6 text-center">{renderCell(feature.enterprise)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 对比表格 - 移动版 */}
      <div className="lg:hidden space-y-6 max-w-2xl mx-auto">
        {comparisonData.map((category, categoryIndex) => (
          <div key={categoryIndex} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
            {/* 分类标题 */}
            <div className="bg-gray-50 py-3 px-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{category.category}</h3>
            </div>

            {/* 功能列表 */}
            <div className="divide-y divide-gray-200">
              {category.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="p-4">
                  <div className="font-medium text-gray-900 mb-3 text-sm">
                    {feature.name}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-sm">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Free</div>
                      <div>{renderCell(feature.free)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Basic</div>
                      <div>{renderCell(feature.basic)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg py-1">
                      <div className="text-xs text-gray-500 mb-1">Pro</div>
                      <div>{renderCell(feature.pro)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Enterprise</div>
                      <div>{renderCell(feature.enterprise)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
