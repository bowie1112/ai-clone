'use client';

import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Sora 2 AI Video Generator?',
      answer: 'Sora 2 AI Video Generator is an advanced AI-powered tool developed by OpenAI that creates high-quality videos from text descriptions. It uses cutting-edge technology to generate realistic videos with physics-accurate motion, synchronized audio, and cinematic quality. Simply describe what you want to see, and Sora 2 brings your ideas to life in video form.',
    },
    {
      question: 'Is it really free to use?',
      answer: 'Yes! Our Sora 2 AI Video Generator offers a free tier that allows you to create videos without any hidden costs. We believe in making AI video generation accessible to everyone. While there are premium features available for advanced users, you can start creating amazing videos right away without entering any payment information.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'Creating an account is optional but recommended. With an account, you can save your generated videos, access your creation history, and enjoy additional features like longer video generation times and higher quality outputs. However, you can try the basic features without signing up to see what Sora 2 can do.',
    },
    {
      question: 'What video quality and length can I generate?',
      answer: 'Sora 2 can generate videos in various quality levels, from standard definition to high-definition outputs. Video length depends on your subscription tier - free users can create videos up to 15 seconds, while premium users can generate videos up to 60 seconds or longer. All videos feature realistic motion, proper lighting, and physics-accurate movements.',
    },
    {
      question: 'How long does it take to generate a video?',
      answer: 'Generation time varies based on video length and complexity, but most videos are ready in 30-60 seconds. Shorter videos (5-15 seconds) typically generate faster, while longer, more complex videos may take up to 2 minutes. Our advanced AI technology ensures that the quality is worth the wait, delivering professional-grade results every time.',
    },
    {
      question: 'Can I use the generated videos commercially?',
      answer: 'Yes! Videos created with Sora 2 AI Video Generator can be used for commercial purposes. You retain full rights to use your generated videos in your business, marketing campaigns, social media, or any other commercial applications. We believe your creativity should work for you without limitations.',
    },
    {
      question: 'What makes Sora 2 different from other AI video generators?',
      answer: 'Sora 2 stands out with its physics-accurate motion simulation, synchronized audio generation, and understanding of real-world physics. Unlike other generators, Sora 2 creates videos with realistic object interactions, proper lighting and shadows, and natural movements. It also excels at understanding complex prompts and maintaining consistency throughout longer videos.',
    },
    {
      question: 'Can I edit or download the generated videos?',
      answer: 'Absolutely! Once your video is generated, you can download it in various formats (MP4, MOV, etc.) for use in your projects. While Sora 2 focuses on generation rather than editing, you can easily import the downloaded videos into any video editing software for further customization, adding text overlays, music, or combining multiple clips.',
    },
    {
      question: 'What types of prompts work best?',
      answer: 'The best prompts are detailed and specific. Include information about the scene (location, time of day, weather), subjects (people, objects, animals), actions (what\'s happening), camera movement (zoom, pan, static), and style (cinematic, documentary, animated). For example: "A cinematic shot of a golden retriever running through a sunlit meadow at sunset, camera following with smooth tracking motion" works better than just "dog running".',
    },
    {
      question: 'Is there a limit to how many videos I can generate?',
      answer: 'Free users can generate up to 10 videos per day, which is perfect for exploring and experimenting with the technology. Premium subscribers enjoy unlimited video generation, priority processing, and access to advanced features. All users can save their favorite generations and come back to them anytime.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white" id="faq">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to know about the sora 2 ai video generator
          </p>
        </div>

        {/* FAQ 列表 */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 hover:border-gray-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 pr-8">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}
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
                </div>
              </button>

              {/* 答案区域 */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pt-2">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
