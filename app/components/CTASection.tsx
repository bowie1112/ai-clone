export default function CTASection() {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 animate-gradient" />

      {/* 装饰性元素 */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* 标题 */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
          准备用 Sora 2 AI 创作惊艳视频？
        </h2>

        {/* 副标题 */}
        <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
          不要错过内容创作的未来。立即开始，几分钟内就能看到你的创意变为现实。
        </p>

        {/* CTA 按钮 */}
        <button className="group relative bg-white text-purple-600 px-10 py-5 rounded-full text-lg font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-2xl">
          <span className="relative z-10">立即开始创作</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        {/* 额外信息 */}
        <p className="mt-6 text-white/80 text-sm">
          无需信用卡 • 免费开始 • 随时取消
        </p>
      </div>
    </section>
  );
}
