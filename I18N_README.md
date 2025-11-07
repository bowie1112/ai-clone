# Next.js 国际化 (i18n) 实现文档

本项目使用 `next-intl` 实现完整的国际化支持，包括英语、中文、日语和西班牙语。

## 📁 项目结构

```
├── i18n/
│   ├── config.ts          # i18n 配置（支持的语言、默认语言）
│   └── request.ts         # 服务器端请求配置
├── messages/
│   ├── en.json           # 英文翻译
│   ├── zh.json           # 中文翻译
│   ├── ja.json           # 日文翻译
│   └── es.json           # 西班牙文翻译
├── app/
│   ├── [locale]/         # 语言路由目录
│   │   ├── layout.tsx    # 带 i18n 的根布局
│   │   ├── page.tsx      # 主页
│   │   ├── auth/         # 认证页面示例
│   │   └── dashboard/    # 仪表板示例
│   └── components/
│       └── LanguageSwitcher.tsx  # 语言切换器组件
├── lib/
│   └── metadata.ts       # SEO 元数据辅助函数
├── middleware.ts         # 语言检测和路由中间件
└── global.d.ts          # TypeScript 类型定义
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install next-intl
```

### 2. 运行项目

```bash
npm run dev
```

### 3. 访问不同语言版本

- 英文: http://localhost:3000/en
- 中文: http://localhost:3000/zh
- 日文: http://localhost:3000/ja
- 西班牙文: http://localhost:3000/es

## 💡 使用方法

### 在客户端组件中使用翻译

```tsx
'use client';

import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 在服务器组件中使用翻译

```tsx
import { useTranslations } from 'next-intl';

export default function MyServerComponent() {
  const t = useTranslations('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
```

### 使用带参数的翻译

```tsx
const t = useTranslations('dashboard');

// 翻译文件中: "welcome": "欢迎回来，{name}！"
<p>{t('welcome', { name: 'John' })}</p>
```

### 获取当前语言

```tsx
'use client';

import { useLocale } from 'next-intl';

export default function MyComponent() {
  const locale = useLocale(); // 'en' | 'zh' | 'ja' | 'es'
  
  return <div>当前语言: {locale}</div>;
}
```

## 🎨 语言切换器组件

语言切换器已集成在导航栏中，用户可以通过下拉菜单切换语言。

```tsx
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

// 在任何客户端组件中使用
<LanguageSwitcher />
```

## 📝 添加新的翻译

### 1. 在翻译文件中添加键值

在 `messages/en.json` 中：
```json
{
  "myFeature": {
    "title": "My New Feature",
    "description": "This is a new feature"
  }
}
```

### 2. 为所有语言添加翻译

在 `messages/zh.json`、`messages/ja.json`、`messages/es.json` 中添加相应翻译。

### 3. 在组件中使用

```tsx
const t = useTranslations('myFeature');

<h1>{t('title')}</h1>
<p>{t('description')}</p>
```

## 🔍 SEO 优化

### 自动生成的 SEO 元数据

每个页面都会自动生成：
- 多语言 `<html lang>` 属性
- 语言替代链接（`hreflang`）
- Open Graph 元数据
- Twitter Card 元数据

### 为新页面添加元数据

1. 在 `lib/metadata.ts` 中定义翻译：

```typescript
export const myPageMetadata: MetadataTranslations = {
  en: {
    title: 'My Page - Sora 2 AI',
    description: 'Page description',
    keywords: ['keyword1', 'keyword2'],
  },
  zh: {
    title: '我的页面 - Sora 2 AI',
    description: '页面描述',
    keywords: ['关键词1', '关键词2'],
  },
  // ... ja 和 es
};
```

2. 在页面布局中使用：

```typescript
import { generateLocalizedMetadata, myPageMetadata } from '@/lib/metadata';

export async function generateMetadata({ params: { locale } }) {
  return generateLocalizedMetadata(
    myPageMetadata,
    locale as Locale,
    '/my-page'
  );
}
```

## 🌐 支持的语言

| 语言代码 | 语言名称 | 显示名称 |
|---------|---------|---------|
| `en` | English | 🇺🇸 English |
| `zh` | Chinese | 🇨🇳 中文 |
| `ja` | Japanese | 🇯🇵 日本語 |
| `es` | Spanish | 🇪🇸 Español |

## 🔧 配置

### 添加新语言

1. 在 `i18n/config.ts` 中添加语言：

```typescript
export type Locale = 'en' | 'zh' | 'ja' | 'es' | 'fr'; // 添加 'fr'

export const locales: Locale[] = ['en', 'zh', 'ja', 'es', 'fr'];

export const localeNames: Record<Locale, string> = {
  // ...
  fr: 'Français',
};

export const localeFlags: Record<Locale, string> = {
  // ...
  fr: '🇫🇷',
};
```

2. 创建 `messages/fr.json` 翻译文件

3. 重启开发服务器

### 修改默认语言

在 `i18n/config.ts` 中：

```typescript
export const defaultLocale: Locale = 'zh'; // 改为中文
```

## 📱 路由结构

- `/en` - 英文首页
- `/zh` - 中文首页
- `/ja` - 日文首页
- `/es` - 西班牙文首页
- `/[locale]/auth/login` - 登录页面（所有语言）
- `/[locale]/dashboard` - 仪表板（所有语言）

## 🎯 最佳实践

1. **翻译文件结构化**：使用命名空间组织翻译（如 `common`、`auth`、`dashboard`）

2. **保持一致性**：确保所有语言文件具有相同的键结构

3. **使用 TypeScript**：类型安全确保翻译键的正确性

4. **SEO 友好**：始终为新页面添加本地化元数据

5. **测试所有语言**：确保每种语言的 UI 正常显示

## 🐛 常见问题

### 问题：翻译键未找到

**解决方案**：检查翻译文件中是否存在该键，确保命名空间正确。

### 问题：语言切换后页面未更新

**解决方案**：确保组件使用 `'use client'` 指令，并正确导入 `useTranslations`。

### 问题：TypeScript 类型错误

**解决方案**：确保 `global.d.ts` 文件存在，并且引用了正确的翻译文件。

## 📚 更多资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js 国际化指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

## 🎉 完成！

现在您的 Next.js 应用已完全支持国际化。用户可以轻松切换语言，所有内容都会自动翻译，SEO 也得到了优化。









