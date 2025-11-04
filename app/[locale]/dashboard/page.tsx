/**
 * 仪表板页面
 * 展示仪表板翻译的使用示例和视频生成历史
 */

'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import VideoHistory from '@/app/components/VideoHistory';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tStats = useTranslations('dashboard.stats');
  const tQuick = useTranslations('dashboard.quickActions');
  const router = useRouter();

  // 示例数据
  const stats = [
    { label: tStats('videosCreated'), value: '24', icon: '🎬' },
    { label: tStats('storageUsed'), value: '2.4 GB', icon: '💾' },
    { label: tStats('creditsRemaining'), value: '150', icon: '⭐' },
    { label: tStats('totalViews'), value: '1.2K', icon: '👁️' },
  ];

  const handleNewVideo = () => {
    // 获取当前语言
    const locale = window.location.pathname.split('/')[1] || 'en';
    router.push(`/${locale}#generator`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('title')}
          </h1>
          <p className="text-gray-600 mt-2">
            {t('welcome', { name: 'User' })}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-3xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {tQuick('title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleNewVideo}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <svg
                className="w-5 h-5"
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
              {tQuick('newVideo')}
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              {tQuick('viewAll')}
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              {tQuick('upgrade')}
            </button>
            <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-6 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all">
              {tQuick('settings')}
            </button>
          </div>
        </div>

        {/* Recent Videos - 使用 VideoHistory 组件 */}
        <VideoHistory limit={10} />
      </div>
    </div>
  );
}

