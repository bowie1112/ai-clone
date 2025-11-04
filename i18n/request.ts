/**
 * 服务器端请求配置
 * 用于在服务器组件中获取翻译
 */

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // 等待并获取请求的语言
  let locale = await requestLocale;
  
  // 验证传入的 locale 参数是否有效
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});

