/**
 * 翻译使用示例组件
 * 展示如何在组件中使用各种翻译功能
 */

'use client';

import { useTranslations, useLocale } from 'next-intl';

export default function ExampleUsage() {
  // 基本翻译
  const t = useTranslations('common');
  
  // 获取当前语言
  const locale = useLocale();
  
  // 嵌套命名空间翻译
  const tAuth = useTranslations('auth.login');
  
  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">翻译使用示例</h1>
      
      {/* 示例 1: 基本翻译 */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">1. 基本翻译</h2>
        <div className="space-y-2">
          <p><strong>加载中:</strong> {t('loading')}</p>
          <p><strong>错误:</strong> {t('error')}</p>
          <p><strong>成功:</strong> {t('success')}</p>
        </div>
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">
{`const t = useTranslations('common');
<p>{t('loading')}</p>`}
        </pre>
      </section>

      {/* 示例 2: 当前语言 */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">2. 获取当前语言</h2>
        <p><strong>当前语言:</strong> {locale}</p>
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">
{`const locale = useLocale(); // '${locale}'`}
        </pre>
      </section>

      {/* 示例 3: 嵌套命名空间 */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">3. 嵌套命名空间翻译</h2>
        <div className="space-y-2">
          <p><strong>标题:</strong> {tAuth('title')}</p>
          <p><strong>邮箱:</strong> {tAuth('email')}</p>
          <p><strong>密码:</strong> {tAuth('password')}</p>
        </div>
        <pre className="mt-4 bg-gray-100 p-3 rounded text-sm">
{`const tAuth = useTranslations('auth.login');
<p>{tAuth('title')}</p>`}
        </pre>
      </section>

      {/* 示例 4: 按钮组 */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">4. 按钮示例</h2>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            {t('save')}
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            {t('delete')}
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            {t('confirm')}
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            {t('cancel')}
          </button>
        </div>
      </section>
    </div>
  );
}




