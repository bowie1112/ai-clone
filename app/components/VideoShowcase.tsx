export default function VideoShowcase() {
  const videos = [
    {
      category: 'Marketing',
      duration: '15 sec',
      thumbnail: 'City night scene with person',
      prompt: 'A professional marketing video showcasing a product in an urban setting at night',
    },
    {
      category: 'Documentary',
      duration: '20 sec',
      thumbnail: 'Documentary scene',
      prompt: 'A cinematic documentary-style shot capturing authentic human emotion and storytelling',
    },
    {
      category: 'Education',
      duration: '25 sec',
      thumbnail: 'Educational content',
      prompt: 'An engaging educational video demonstrating complex concepts in a clear, visual way',
    },
    {
      category: 'Fashion',
      duration: '18 sec',
      thumbnail: 'Fashion photography',
      prompt: 'A stylish fashion video with elegant movements and professional lighting',
    },
    {
      category: 'Tutorial',
      duration: '30 sec',
      thumbnail: 'Tutorial scene',
      prompt: 'A step-by-step tutorial video with clear demonstrations and professional quality',
    },
    {
      category: 'Entertainment',
      duration: '22 sec',
      thumbnail: 'Entertainment scene',
      prompt: 'A fun and engaging entertainment video with dynamic action and vibrant visuals',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="examples">
      <div className="max-w-7xl mx-auto">
        {/* 顶部标签 */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Video Showcase
          </span>
        </div>

        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            See What's Possible with Sora 2 Video Generator
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore amazing sora 2 ai videos created by our community using simple text prompts
            with physics-accurate motion
          </p>
        </div>

        {/* 视频网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {videos.map((video, index) => (
            <div
              key={index}
              className="group relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
            >
              {/* 占位背景 - 替换为Sora官网素材 */}
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-900">
                <div className="text-center text-gray-400">
                  <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">{video.thumbnail}</p>
                  <p className="text-xs mt-1 px-4">替换为Sora官网素材</p>
                </div>
              </div>

              {/* 类别标签 */}
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  {video.category}
                </span>
              </div>

              {/* 时长标签 */}
              <div className="absolute top-4 right-4 z-10">
                <span className="flex items-center gap-1 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors duration-300">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>

              {/* 提示词显示（悬停时） */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm line-clamp-2">
                  {video.prompt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 底部 CTA */}
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to create your own amazing sora 2 video content?
          </p>
          <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg">
            Start Creating with Sora 2 AI
          </button>
        </div>
      </div>
    </section>
  );
}
