/**
 * 主页组件
 * 展示所有主要部分的登录页面
 */

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import VideoGenerator from '../components/VideoGenerator';
import Features from '../components/Features';
import UseCases from '../components/UseCases';
import VideoShowcase from '../components/VideoShowcase';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <Features />
        <VideoGenerator />
        <UseCases />
        <VideoShowcase />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}




