/**
 * 主页英雄区域组件
 * 展示主要标题、描述和行动号召
 */

'use client';

import { useTranslations } from 'next-intl';

export default function HeroSection() {
  const t = useTranslations('hero');
  
  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ 
          minWidth: '100%', 
          minHeight: '100%',
          objectFit: 'cover'
        }}
      >
        <source src="/hero-background.mp4" type="video/mp4" />
      </video>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/40" />
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center">
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
