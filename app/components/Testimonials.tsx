export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: "The sora 2 ai platform has revolutionized our content creation process. What used to take days with traditional video production now takes minutes. The physics-accurate video quality is incredible!",
      avatar: 'SC',
      name: 'Sarah Chen',
      role: 'Marketing Director at TechStart Inc.',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      text: "As a content creator, the sora 2 video generator has been a game-changer. The synchronized audio feature is so realistic, my audience can't tell the difference from real footage.",
      avatar: 'MR',
      name: 'Michael Rodriguez',
      role: 'Content Creator at YouTube',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      text: "We use OpenAI's sora2 to create educational videos for our online courses. The AI understands complex topics and visualizes them perfectly with realistic motion.",
      avatar: 'EW',
      name: 'Emily Watson',
      role: 'Education Specialist at EduTech Solutions',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      text: "The creative possibilities with sora 2 ai are endless. It understands artistic concepts and brings them to life with physics-accurate motion in ways I never imagined possible.",
      avatar: 'DK',
      name: 'David Kim',
      role: 'Creative Director at Design Studio X',
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      text: "I never thought I could afford professional video marketing. The sora 2 video generator makes it possible for small businesses like mine to compete with the big players.",
      avatar: 'LT',
      name: 'Lisa Thompson',
      role: "Small Business Owner at Thompson's Bakery",
      color: 'bg-emerald-500',
    },
    {
      rating: 5,
      text: "The synchronized speech and sound effects capabilities of sora2 are phenomenal. We've created music videos with realistic audio that look like they had million-dollar budgets.",
      avatar: 'JP',
      name: 'James Park',
      role: 'Music Producer at Harmony Records',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Loved by Creators Worldwide
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied users creating amazing sora 2 video content with
            OpenAI's advanced AI technology
          </p>
        </div>

        {/* 评价网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* 引号图标 */}
              <div className="absolute top-6 right-6 text-gray-200">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* 星级评分 */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* 评价文字 */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
