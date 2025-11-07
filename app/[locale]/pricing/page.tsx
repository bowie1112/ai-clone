import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import PricingClient from './PricingClient';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

interface PricingPageProps {
  params: {
    locale: string;
  };
}

/**
 * Generate metadata for Pricing page
 */
export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'pricing' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    keywords: t('meta.keywords'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('meta.title'),
      description: t('meta.description'),
    },
  };
}

/**
 * Pricing Page
 * 定价页面 - 展示所有订阅套餐和积分包
 */
export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <Navbar />
      
      {/* 主要内容 */}
      <main className="relative pt-20">
        <PricingClient locale={locale} />
      </main>
      
      {/* 页脚 */}
      <Footer />
    </div>
  );
}
