'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

/**
 * PricingFAQ Component
 * 常见问题组件 - 极简专业风格
 */
export default function PricingFAQ() {
  const t = useTranslations('pricing.faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQ 问题列表
  const faqs = [
    {
      question: t('q1.question'),
      answer: t('q1.answer'),
    },
    {
      question: t('q2.question'),
      answer: t('q2.answer'),
    },
    {
      question: t('q3.question'),
      answer: t('q3.answer'),
    },
    {
      question: t('q4.question'),
      answer: t('q4.answer'),
    },
    {
      question: t('q5.question'),
      answer: t('q5.answer'),
    },
    {
      question: t('q6.question'),
      answer: t('q6.answer'),
    },
    {
      question: t('q7.question'),
      answer: t('q7.answer'),
    },
    {
      question: t('q8.question'),
      answer: t('q8.answer'),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
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

      {/* FAQ 列表 */}
      <div className="max-w-3xl mx-auto space-y-2">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all"
          >
            {/* 问题按钮 */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">
                {faq.question}
              </span>
              <svg
                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 答案内容 */}
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100">
                <div className="pt-4">{faq.answer}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 联系支持 */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          {t('stillHaveQuestions')}
        </p>
        <a
          href="mailto:support@example.com"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          {t('contactSupport')}
        </a>
      </div>
    </div>
  );
}
