'use client';

import { useTranslations } from 'next-intl';

export default function Testimonials() {
  const t = useTranslations('testimonials');
  
  const testimonials = [
    {
      rating: 5,
      textKey: 'items.0.text',
      avatar: 'SC',
      nameKey: 'items.0.name',
      roleKey: 'items.0.role',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      textKey: 'items.1.text',
      avatar: 'MR',
      nameKey: 'items.1.name',
      roleKey: 'items.1.role',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      textKey: 'items.2.text',
      avatar: 'EW',
      nameKey: 'items.2.name',
      roleKey: 'items.2.role',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      textKey: 'items.3.text',
      avatar: 'DK',
      nameKey: 'items.3.name',
      roleKey: 'items.3.role',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      textKey: 'items.4.text',
      avatar: 'LT',
      nameKey: 'items.4.name',
      roleKey: 'items.4.role',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      textKey: 'items.5.text',
      avatar: 'JP',
      nameKey: 'items.5.name',
      roleKey: 'items.5.role',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* 评价网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg p-8 hover:border-gray-300 transition-colors relative"
            >
              {/* 引号图标 */}
              <div className="absolute top-6 right-6 text-gray-100">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* 星级评分 */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* 评价文字 */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{t(testimonial.textKey)}"
              </p>

              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {t(testimonial.nameKey)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t(testimonial.roleKey)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
