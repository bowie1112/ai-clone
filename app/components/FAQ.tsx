'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { questionKey: 'items.0.question', answerKey: 'items.0.answer' },
    { questionKey: 'items.1.question', answerKey: 'items.1.answer' },
    { questionKey: 'items.2.question', answerKey: 'items.2.answer' },
    { questionKey: 'items.3.question', answerKey: 'items.3.answer' },
    { questionKey: 'items.4.question', answerKey: 'items.4.answer' },
    { questionKey: 'items.5.question', answerKey: 'items.5.answer' },
    { questionKey: 'items.6.question', answerKey: 'items.6.answer' },
    { questionKey: 'items.7.question', answerKey: 'items.7.answer' },
    { questionKey: 'items.8.question', answerKey: 'items.8.answer' },
    { questionKey: 'items.9.question', answerKey: 'items.9.answer' },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {t(faq.questionKey)}
                </span>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
              </button>

              {/* 答案区域 */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    {t(faq.answerKey)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
