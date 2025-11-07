/**
 * Next.js 中间件
 * 处理语言检测和路由重定向
 */

import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';

export default createMiddleware({
  // 支持的所有语言
  locales,
  
  // 默认语言
  defaultLocale,
  
  // 总是显示语言前缀（包括默认语言）
  localePrefix: 'always',
  
  // 语言检测策略
  localeDetection: true,
});

export const config = {
  // 匹配所有路径，除了这些：
  // - api 路由
  // - _next 静态文件
  // - _vercel Vercel 文件
  // - 所有静态文件（图片、字体等）
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};









