/**
 * 主页英雄区域组件
 * 展示主要标题、描述和行动号召
 */

'use client';

import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
  
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Video Background - 直接绝对定位，无需额外容器 */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover scale-120"
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />

      {/* Bottom Gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl w-full text-center">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
            {t('subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button className="bg-white text-gray-900 px-6 py-3 rounded-lg text-base font-medium hover:bg-gray-100 transition-colors shadow-lg">
              {t('cta')}
            </button>
            <button className="border-2 border-white/80 text-white px-6 py-3 rounded-lg text-base font-medium hover:bg-white/10 transition-colors backdrop-blur-sm">
              {t('learnMore')}
            </button>
          </div>

          {/* Sub CTA text */}
          <p className="text-sm text-white/80 drop-shadow">
            {t('description')}
          </p>
        </div>
      </div>
    </section>
  );
}
