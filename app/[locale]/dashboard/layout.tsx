/**
 * 仪表板页面布局
 * 为仪表板页面提供 SEO 元数据
 */

import type { Metadata } from 'next';
import { generateLocalizedMetadata, dashboardMetadata } from '@/lib/metadata';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params;
  return generateLocalizedMetadata(
    dashboardMetadata,
    locale as Locale,
    '/dashboard'
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

