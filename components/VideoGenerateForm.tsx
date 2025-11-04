/**
 * 视频生成表单组件
 * 集成游客限制功能的完整示例
 */

"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { GuestLimitBanner } from './GuestLimitBanner';
import { GuestLimitModal } from './GuestLimitModal';
import { checkGuestLimit } from '@/lib/guest-limit/client-check';
import { getClientIdentity } from '@/lib/guest-limit/fingerprint';

interface VideoGenerateFormProps {
  isLoggedIn: boolean;
  onVideoCreated?: (video: any) => void;
}

export function VideoGenerateForm({ isLoggedIn, onVideoCreated }: VideoGenerateFormProps) {
  const t = useTranslations('generator');
  const tGuest = useTranslations('guestLimit');

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!prompt.trim()) {
      setError(t('errors.promptRequired'));
      return;
    }

    setLoading(true);

    try {
      // 如果是游客，先检查限制
      if (!isLoggedIn) {
        const checkResult = await checkGuestLimit();

        if (!checkResult.allowed) {
          // 显示限制弹窗
          setShowLimitModal(true);
          setLoading(false);
          return;
        }
      }

      // 获取客户端识别信息（游客需要）
      let identity = null;
      if (!isLoggedIn) {
        identity = await getClientIdentity();
      }

      // 调用视频生成 API
      const response = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...(identity || {}), // 游客时附加 fingerprint 和 userAgent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // 处理游客限制错误
        if (data.code === 'GUEST_LIMIT_EXCEEDED') {
          setShowLimitModal(true);
          setLoading(false);
          return;
        }

        throw new Error(data.error || 'Failed to create video');
      }

      // 成功
      setPrompt('');
      onVideoCreated?.(data);
    } catch (err) {
      console.error('Error generating video:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 游客限制横幅 */}
      <GuestLimitBanner isLoggedIn={isLoggedIn} />

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
            {t('inputLabel')}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t('inputPlaceholder')}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading}
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* 提交按钮 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {!isLoggedIn && (
              <span>{tGuest('formHint')}</span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t('generating') : t('generateButton')}
          </button>
        </div>
      </form>

      {/* 游客限制弹窗 */}
      <GuestLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
      />
    </div>
  );
}
