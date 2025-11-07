'use client';

import { useTranslations } from 'next-intl';

export default function VideoShowcase() {
  const t = useTranslations('showcase');
  
  const videos = [
    {
      categoryKey: 'videos.marketing.category',
      duration: '15 sec',
      thumbnailKey: 'videos.marketing.thumbnail',
      promptKey: 'videos.marketing.prompt',
    },
    {
      categoryKey: 'videos.documentary.category',
      duration: '20 sec',
      thumbnailKey: 'videos.documentary.thumbnail',
      promptKey: 'videos.documentary.prompt',
    },
    {
      categoryKey: 'videos.education.category',
      duration: '25 sec',
      thumbnailKey: 'videos.education.thumbnail',
      promptKey: 'videos.education.prompt',
    },
    {
      categoryKey: 'videos.fashion.category',
      duration: '18 sec',
      thumbnailKey: 'videos.fashion.thumbnail',
      promptKey: 'videos.fashion.prompt',
    },
    {
      categoryKey: 'videos.tutorial.category',
      duration: '30 sec',
      thumbnailKey: 'videos.tutorial.thumbnail',
      promptKey: 'videos.tutorial.prompt',
    },
    {
      categoryKey: 'videos.entertainment.category',
      duration: '22 sec',
      thumbnailKey: 'videos.entertainment.thumbnail',
      promptKey: 'videos.entertainment.prompt',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="examples">
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

        {/* 视频网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer border border-gray-700 hover:border-gray-600 transition-colors"
            >
              {/* 占位背景 - 替换为Sora官网素材 */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">{t(video.thumbnailKey)}</p>
                  <p className="text-xs mt-1 px-4">{t('placeholder')}</p>
                </div>
              </div>

              {/* 类别标签 */}
              <div className="absolute top-3 left-3 z-10">
                <span className="px-2 py-1 bg-white text-gray-900 text-xs font-medium rounded">
                  {t(video.categoryKey)}
                </span>
              </div>

              {/* 时长标签 */}
              <div className="absolute top-3 right-3 z-10">
                <span className="flex items-center gap-1 px-2 py-1 bg-white text-gray-900 text-xs font-medium rounded">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {video.duration}
                </span>
              </div>

              {/* 播放按钮覆层 */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* 提示词显示（悬停时） */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs line-clamp-2">
                  {t(video.promptKey)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {t('cta.description')}
          </p>
          <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            {t('cta.button')}
          </button>
        </div>
      </div>
    </section>
  );
}
