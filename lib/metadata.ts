/**
 * SEO 元数据辅助函数
 * 为不同页面生成本地化的元数据
 */

import type { Metadata } from 'next';
import { locales, type Locale } from '@/i18n/config';

interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
}

type MetadataTranslations = Record<Locale, PageMetadata>;

/**
 * 生成本地化的元数据
 * @param translations - 各语言的元数据翻译
 * @param locale - 当前语言
 * @param path - 页面路径（用于 alternates）
 */
export function generateLocalizedMetadata(
  translations: MetadataTranslations,
  locale: Locale,
  path: string = ''
): Metadata {
  const currentMeta = translations[locale] || translations.en;

  // 生成语言替代链接
  const languages: Record<string, string> = {};
  locales.forEach((loc) => {
    languages[loc] = `/${loc}${path}`;
  });

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    keywords: currentMeta.keywords,
    alternates: {
      languages,
    },
    openGraph: {
      title: currentMeta.title,
      description: currentMeta.description,
      locale: locale,
      alternateLocale: locales.filter((l) => l !== locale),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: currentMeta.title,
      description: currentMeta.description,
    },
  };
}

/**
 * 登录页面元数据
 */
export const loginMetadata: MetadataTranslations = {
  en: {
    title: 'Login - Sora 2 AI Video Generator',
    description: 'Sign in to your account to create stunning AI-generated videos',
    keywords: ['login', 'sign in', 'ai video', 'authentication'],
  },
  zh: {
    title: '登录 - Sora 2 AI 视频生成器',
    description: '登录您的账户以创作惊艳的 AI 生成视频',
    keywords: ['登录', '视频生成', 'AI视频', '认证'],
  },
  ja: {
    title: 'ログイン - Sora 2 AI ビデオジェネレーター',
    description: 'アカウントにサインインして素晴らしいAI生成動画を作成',
    keywords: ['ログイン', 'サインイン', 'AI動画', '認証'],
  },
  es: {
    title: 'Iniciar Sesión - Sora 2 Generador de Video IA',
    description: 'Inicia sesión en tu cuenta para crear videos impresionantes generados por IA',
    keywords: ['iniciar sesión', 'login', 'video ia', 'autenticación'],
  },
};

/**
 * 仪表板页面元数据
 */
export const dashboardMetadata: MetadataTranslations = {
  en: {
    title: 'Dashboard - Sora 2 AI Video Generator',
    description: 'Manage your AI-generated videos and account settings',
    keywords: ['dashboard', 'video management', 'ai video', 'account'],
  },
  zh: {
    title: '控制台 - Sora 2 AI 视频生成器',
    description: '管理您的 AI 生成视频和账户设置',
    keywords: ['控制台', '视频管理', 'AI视频', '账户'],
  },
  ja: {
    title: 'ダッシュボード - Sora 2 AI ビデオジェネレーター',
    description: 'AI生成動画とアカウント設定を管理',
    keywords: ['ダッシュボード', '動画管理', 'AI動画', 'アカウント'],
  },
  es: {
    title: 'Panel - Sora 2 Generador de Video IA',
    description: 'Administra tus videos generados por IA y configuración de cuenta',
    keywords: ['panel', 'gestión de videos', 'video ia', 'cuenta'],
  },
};




