'use client';

import { useState } from 'react';

export default function VideoGenerator() {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('sora2');

  const handleGenerate = () => {
    // 这里添加生成视频的逻辑
    console.log('Generating video with prompt:', prompt);
  };

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

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim()}
            className="w-full bg-gray-900 text-white py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zM8 14a5 5 0 00-5 5v3h14v-3a5 5 0 00-5-5H8z"
              />
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
            </svg>
            Generate Sora 2 Video
          </button>
        </div>

        {/* Video Preview 区域 */}
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
          <div className="flex flex-col items-center justify-center py-16">
            {/* 播放图标 */}
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-6">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* 标题和描述 */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Video Preview
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              Your generated sora 2 video will appear here. Enter a prompt and click generate to start.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
