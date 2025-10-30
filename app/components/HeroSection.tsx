'use client';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 via-blue-50 to-white -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            用 <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Sora 2 AI</span> 创作惊艳视频
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            体验 OpenAI 最新的 Sora 2 技术 - 物理精确的运动模拟、同步音频生成、逼真的场景渲染。只需输入文字描述，即可生成令人惊叹的高质量视频。
          </p>

          {/* CTA Button */}
          <button className="group relative bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-full text-lg font-semibold mb-4 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
            <span className="relative z-10">创建你的 Sora 2 视频</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>

          {/* Sub CTA text */}
          <p className="text-sm text-gray-500 mb-12">
            更高质量，更多积分 - 立即体验
          </p>

          {/* Best Practices Tips */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              提示词最佳实践
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">清晰描述场景：</strong>包含环境、光线、时间等细节
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">指定动作细节：</strong>描述物体或人物的具体运动方式
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">添加风格元素：</strong>电影感、卡通风格、写实等艺术方向
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-900">描述氛围情绪：</strong>快乐、紧张、宁静等情感基调
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </section>
  );
}
