/**
 * 视频生成历史组件
 * 显示用户的视频生成历史记录
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface Video {
  id: string;
  prompt: string;
  title?: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  videoUrl?: string;
  thumbnailUrl?: string;
  quality?: string;
  createdAt: string;
  completedAt?: string;
}

interface VideoHistoryProps {
  userId?: string;
  limit?: number;
}

export default function VideoHistory({ userId, limit = 10 }: VideoHistoryProps) {
  const t = useTranslations('dashboard.recentVideos');
  const tStatus = useTranslations('dashboard.recentVideos.status');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [userId, limit]);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        take: limit.toString(),
      });
      
      if (userId) {
        params.append('userId', userId);
      }

      const response = await fetch(`/api/videos?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err instanceof Error ? err.message : 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Video['status']) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Video['status']) => {
    switch (status) {
      case 'COMPLETED':
        return tStatus('completed');
      case 'PROCESSING':
        return tStatus('processing');
      case 'PENDING':
      case 'FAILED':
      case 'CANCELLED':
      default:
        return tStatus('failed');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins} 分钟前`;
    if (diffHours < 24) return `${diffHours} 小时前`;
    if (diffDays < 7) return `${diffDays} 天前`;
    
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('title')}</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('title')}</h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchVideos}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('title')}</h2>
        <p className="text-gray-600 text-center py-8">{t('empty')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
        <button
          onClick={fetchVideos}
          className="text-sm text-purple-600 hover:text-purple-700 font-medium"
        >
          刷新
        </button>
      </div>

      <div className="space-y-4">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
          >
            {/* 缩略图或占位符 */}
            <div className="flex-shrink-0 w-24 h-16 bg-gray-200 rounded-lg overflow-hidden">
              {video.thumbnailUrl ? (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title || 'Video thumbnail'}
                  className="w-full h-full object-cover"
                />
              ) : video.videoUrl && video.status === 'COMPLETED' ? (
                <video
                  src={video.videoUrl}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                {video.title || video.prompt.slice(0, 60)}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {video.prompt}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                    video.status
                  )}`}
                >
                  {getStatusText(video.status)}
                </span>
                {video.quality && (
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                    {video.quality.toUpperCase()}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  {formatDate(video.createdAt)}
                </span>
              </div>
            </div>

            {/* 操作按钮 */}
            {video.videoUrl && video.status === 'COMPLETED' && (
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="查看视频"
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
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}




