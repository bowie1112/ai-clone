/**
 * 主页英雄区域组件
 * 展示主要标题、描述和行动号召
 */

'use client';

import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
  
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-blue-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            {t('subtitle')}
          </p>

          {/* CTA Button */}
          <button className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold mb-4 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            <span className="relative z-10">{t('cta')}</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Sub CTA text */}
          <p className="text-sm text-gray-500 mb-12">
            {t('description')}
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  );
}
