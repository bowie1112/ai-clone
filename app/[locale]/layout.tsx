/**
 * 带语言支持的根布局组件
 * 为每个语言提供翻译上下文和元数据
 */

import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/config';
import "../globals.css";

// 生成静态参数以支持所有语言的静态生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 动态生成元数据
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  // 根据语言返回不同的元数据
  const titles: Record<string, string> = {
    en: 'Sora 2 AI Video Generator - Create Stunning Videos with AI',
    zh: 'Sora 2 AI 视频生成器 - 用 AI 创作惊艳视频',
    ja: 'Sora 2 AI ビデオジェネレーター - AIで素晴らしい動画を作成',
    es: 'Sora 2 Generador de Video IA - Crea Videos Impresionantes con IA',
  };

  const descriptions: Record<string, string> = {
    en: "Experience OpenAI's latest Sora 2 technology - physics-accurate motion simulation, synchronized audio generation, and realistic scene rendering. Create stunning videos from text descriptions.",
    zh: '体验 OpenAI 最新的 Sora 2 技术 - 物理精确的运动模拟、同步音频生成、逼真的场景渲染。只需输入文字描述，即可生成令人惊叹的高质量视频。',
    ja: 'OpenAIの最新Sora 2技術を体験 - 物理的に正確なモーションシミュレーション、同期されたオーディオ生成、リアルなシーンレンダリング。テキスト説明から素晴らしい動画を作成。',
    es: 'Experimenta la última tecnología Sora 2 de OpenAI - simulación de movimiento físicamente precisa, generación de audio sincronizado y renderizado de escenas realistas. Crea videos impresionantes a partir de descripciones de texto.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    alternates: {
      languages: {
        'en': '/en',
        'zh': '/zh',
        'ja': '/ja',
        'es': '/es',
      }
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      locale: locale,
      alternateLocale: locales.filter(l => l !== locale),
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // 等待并获取语言参数
  const { locale } = await params;
  
  // 验证语言参数
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // 获取当前语言的翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

