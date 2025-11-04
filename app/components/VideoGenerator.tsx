'use client';

import { useEffect, useRef, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { checkGuestLimit } from '@/lib/guest-limit/client-check';
import { getClientIdentity } from '@/lib/guest-limit/fingerprint';
import { GuestLimitModal } from '@/components/GuestLimitModal';

export default function VideoGenerator() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sora2');
  const [videoUrl, setVideoUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');
  const [resultUrls, setResultUrls] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: session } = authClient.useSession();
  const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED === '1';

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const pollStatus = async (id: string, startTime = Date.now()) => {
    try {
      const res = await fetch(`/api/luma/status?taskId=${encodeURIComponent(id)}`, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '状态查询失败');

      const s = data.status;
      // successFlag: 0 generating, 1 success, 2 create failed, 3 generate failed, 4 callback failed
      if (s?.successFlag === 0) {
        setStatusText('生成中，请稍候...');
        if (Date.now() - startTime > 15 * 60 * 1000) throw new Error('生成超时');
        pollTimerRef.current = setTimeout(() => pollStatus(id, startTime), 10000);
        return;
      }
      if (s?.successFlag === 1 || s?.successFlag === 4) {
        setStatusText('生成完成');
        const urls: string[] = s?.response?.resultUrls || [];
        setResultUrls(urls.length ? urls : null);
        setIsGenerating(false);
        // 游客成功生成后，在客户端记录使用（本地 & 服务器）
        if (!session?.user && id) {
          try {
            const { recordGuestUsage } = await import('@/lib/guest-limit/client-check');
            await recordGuestUsage(id);
          } catch (e) {
            console.error('记录游客使用失败:', e);
          }
        }
        return;
      }
      const msg = s?.errorMessage || '生成失败';
      throw new Error(msg);
    } catch (e: any) {
      setIsGenerating(false);
      setError(e?.message || '生成失败');
    }
  };

  const startPollingByTaskId = async (id: string) => {
    try {
      if (!id) return;
      setError(null);
      setResultUrls(null);
      setIsGenerating(true);
      setTaskId(id);
      setStatusText('开始根据任务 ID 查询状态...');
      await pollStatus(id);
    } catch (e: any) {
      setIsGenerating(false);
      setError(e?.message || '查询失败');
    }
  };

  // 默认不恢复历史任务，避免进入网站就显示上一次的结果
  // 如需恢复，在 URL 添加 ?resume=1&taskId=xxx 才会自动恢复
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const shouldResume = params.get('resume') === '1';
      if (!shouldResume) return;
      const id = params.get('taskId') || (typeof window !== 'undefined' ? localStorage.getItem('lumaLastTaskId') : null) || '';
      if (id && !isGenerating && !resultUrls) {
        startPollingByTaskId(id);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerate = async () => {
    try {
      setError(null);
      setResultUrls(null);
      
      // 如果未登录，检查游客限制
      if (!session?.user) {
        const checkResult = await checkGuestLimit();
        if (!checkResult.allowed) {
          setShowLimitModal(true);
          return;
        }
      }
      
      setIsGenerating(true);
      setStatusText('创建任务中...');

      if (!videoUrl.trim()) {
        throw new Error('请输入可访问的视频 URL（用于修改）');
      }
      
      // 获取客户端识别信息（游客需要）
      let identity = null;
      if (!session?.user) {
        identity = await getClientIdentity();
      }

      // 调用 Luma API 创建任务
      const res = await fetch('/api/luma/modify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), videoUrl: videoUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || '创建任务失败');
      const id = data.taskId as string;
      setTaskId(id);
      try { if (typeof window !== 'undefined') localStorage.setItem('lumaLastTaskId', id); } catch {}

      // 保存到数据库
      try {
        const locale = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] : 'en';
        const videoResponse = await fetch('/api/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: prompt.trim(),
            title: prompt.trim().slice(0, 100),
            quality: selectedModel === 'sora2' ? '4k' : 'hd',
            locale,
            lumaId: id,
            userId: session?.user?.id,
            ...(identity || {}), // 游客时附加 fingerprint 和 userAgent
          }),
        });
        
        const videoData = await videoResponse.json();
        
        // 处理游客限制错误
        if (!videoResponse.ok && videoData.code === 'GUEST_LIMIT_EXCEEDED') {
          setShowLimitModal(true);
          setIsGenerating(false);
          return;
        }
      } catch (dbError) {
        console.error('保存到数据库失败:', dbError);
        // 不阻塞主流程
      }

      setStatusText('任务已创建，开始轮询状态...');
      await pollStatus(id);
    } catch (e: any) {
      setIsGenerating(false);
      setError(e?.message || '生成失败');
    }
  };

  // 任务轮询将自动进行，界面不展示 taskId

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="generator">
      <div className="max-w-6xl mx-auto">
        {/* 视频生成表单卡片 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 mb-8">
          {/* 标题 */}
          <div className="flex items-center gap-3 mb-8">
            <svg
              className="w-8 h-8 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zM8 14a5 5 0 00-5 5v3h14v-3a5 5 0 00-5-5H8z"
              />
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            </svg>
            <h2 className="text-3xl font-bold text-gray-900">
              Create Your Sora 2 Video
            </h2>
          </div>

          {/* AI Model 选择器 */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3 text-center">
              AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 cursor-pointer"
            >
              <option value="sora2">Sora 2 (10 credits)</option>
              <option value="sora1">Sora 1 (5 credits)</option>
            </select>
            <p className="text-sm text-gray-500 text-center mt-2">
              Higher quality, more credits
            </p>
          </div>

          {/* Text to Video / Image to Video 标签页 */}
          <div className="flex gap-2 mb-8 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'text'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Text to Video
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'image'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Image to Video
            </button>
          </div>

          {/* Video Description */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Video Description
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the complete video scene you want to create..."
              className="w-full h-40 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Be specific about scenes, actions, style, and mood for best results
              </p>
              <span className="text-sm text-gray-400">
                {prompt.length} / 2000
              </span>
            </div>
          </div>

          {/* Input Video URL (Luma Modify 需要) */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Input Video URL
            </label>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/input-video.mp4"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
            <p className="text-sm text-gray-500 mt-2">请输入一个公网可访问的视频链接</p>
          </div>

          {/* Generate Button - 对所有用户可用 */}
          <div className="space-y-3">
            {!session?.user && (
              <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>免费试用：未登录用户可免费生成 1 次视频</span>
              </div>
            )}
            
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || !videoUrl.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              {isGenerating ? '生成中...' : session?.user ? '生成视频' : '免费生成视频'}
            </button>
            
            {!session?.user && googleEnabled && (
              <button
                onClick={async () => {
                  await authClient.signIn.social({ provider: 'google', callbackURL: typeof window !== 'undefined' ? window.location.href : '/' });
                }}
                className="w-full bg-white text-gray-700 py-3 rounded-full font-medium hover:bg-gray-50 transition-all border border-gray-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                登录获取更多次数
              </button>
            )}
          </div>

          {statusText && (
            <p className="mt-4 text-sm text-gray-600">{statusText}</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}

          {/* 隐藏 taskId 与手动查询入口，保持极简体验 */}
        </div>
        
        {/* 游客限制弹窗 */}
        <GuestLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
        />

        {/* 仅在生成完成后展示预览与链接 */}
        {resultUrls && resultUrls.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-full max-w-3xl">
                <video
                  className="w-full rounded-xl shadow"
                  controls
                  src={resultUrls[0]}
                />
                <div className="mt-3 text-sm text-gray-600">
                  结果链接：
                  <ul className="list-disc pl-5">
                    {resultUrls.map((u, i) => (
                      <li key={i} className="break-all">
                        <a className="text-blue-600 underline" href={u} target="_blank" rel="noreferrer">{u}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
