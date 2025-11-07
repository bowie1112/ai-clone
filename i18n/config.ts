/**
 * i18n 配置文件
 * 定义支持的语言和默认语言设置
 */

export type Locale = 'en' | 'zh' | 'ja' | 'es';

export const locales: Locale[] = ['en', 'zh', 'ja', 'es'];

export const defaultLocale: Locale = 'en';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  es: 'Español',
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  es: '🇪🇸',
};









