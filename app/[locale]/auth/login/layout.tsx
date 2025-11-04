/**
 * 登录页面布局
 * 为登录页面提供 SEO 元数据
 */

import type { Metadata } from 'next';
import { generateLocalizedMetadata, loginMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata(
    loginMetadata,
    locale as Locale,
    '/auth/login'
  );
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

