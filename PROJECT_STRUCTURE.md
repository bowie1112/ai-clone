# 📁 项目结构

## 完整的国际化项目结构

```
demo3/
│
├── 📁 i18n/                          # i18n 配置目录
│   ├── config.ts                     # 语言配置（支持的语言、默认语言）
│   └── request.ts                    # 服务器端请求配置
│
├── 📁 messages/                      # 翻译文件目录
│   ├── en.json                       # 英文翻译 (~180+ 键)
│   ├── zh.json                       # 中文翻译 (~180+ 键)
│   ├── ja.json                       # 日文翻译 (~180+ 键)
│   └── es.json                       # 西班牙文翻译 (~180+ 键)
│
├── 📁 app/
│   ├── 📁 [locale]/                  # 动态语言路由
│   │   ├── layout.tsx                # ✨ 根布局（带 i18n 和 SEO）
│   │   ├── page.tsx                  # 主页
│   │   │
│   │   ├── 📁 auth/
│   │   │   └── 📁 login/
│   │   │       ├── layout.tsx        # 登录页元数据
│   │   │       └── page.tsx          # ✨ 登录页面示例
│   │   │
│   │   ├── 📁 dashboard/
│   │   │   ├── layout.tsx            # 仪表板元数据
│   │   │   └── page.tsx              # ✨ 仪表板示例
│   │   │
│   │   └── 📁 examples/
│   │       └── page.tsx              # ✨ 翻译使用示例
│   │
│   ├── 📁 api/                       # API 路由
│   │   ├── luma/
│   │   │   ├── callback/
│   │   │   ├── modify/
│   │   │   └── status/
│   │   └── ...
│   │
│   └── 📁 components/                # React 组件
│       ├── LanguageSwitcher.tsx      # ✨ 语言切换器组件
│       ├── Navbar.tsx                # ✨ 导航栏（已更新使用翻译）
│       ├── HeroSection.tsx           # ✨ 英雄区域（已更新使用翻译）
│       ├── ExampleUsage.tsx          # ✨ 翻译使用示例组件
│       ├── Features.tsx              # 功能组件
│       ├── VideoGenerator.tsx        # 视频生成器
│       ├── UseCases.tsx              # 使用场景
│       ├── VideoShowcase.tsx         # 视频展示
│       ├── Testimonials.tsx          # 用户评价
│       ├── FAQ.tsx                   # 常见问题
│       ├── CTASection.tsx            # 行动号召
│       └── Footer.tsx                # 页脚
│
├── 📁 lib/                           # 工具库
│   ├── auth-client.ts                # 认证客户端
│   ├── auth.ts                       # 认证配置
│   └── metadata.ts                   # ✨ SEO 元数据辅助函数
│
├── 📁 public/                        # 静态资源
│   └── ...
│
├── middleware.ts                     # ✨ 语言检测中间件
├── global.d.ts                       # ✨ TypeScript 全局类型定义
├── next.config.ts                    # ✨ Next.js 配置（含 i18n 插件）
├── tsconfig.json                     # TypeScript 配置
├── package.json                      # 项目依赖
│
└── 📖 文档/
    ├── I18N_README.md               # ✨ 完整的国际化文档
    ├── QUICKSTART.md                # ✨ 快速开始指南
    ├── IMPLEMENTATION_NOTES.md      # ✨ 实施说明
    └── PROJECT_STRUCTURE.md         # ✨ 本文件

✨ = 国际化相关的新文件或更新的文件
```

## 📂 关键目录说明

### 1. `/i18n` - 国际化配置
包含核心配置文件，定义支持的语言和默认设置。

### 2. `/messages` - 翻译资源
每个语言一个 JSON 文件，包含所有翻译键值对。

### 3. `/app/[locale]` - 语言路由
使用 Next.js 动态路由实现多语言 URL（`/en`, `/zh`, `/ja`, `/es`）。

### 4. `/app/components` - UI 组件
所有 React 组件，部分已集成翻译功能。

### 5. `/lib` - 工具函数
包含 SEO 元数据生成器和其他辅助函数。

## 🗂️ 翻译文件结构

```json
messages/[lang].json
├── common          // 通用文本（按钮、操作等）
├── nav             // 导航菜单
├── hero            // 英雄区域
├── features        // 功能特性
├── generator       // 视频生成器
├── useCases        // 使用场景
├── testimonials    // 用户评价
├── faq             // 常见问题
├── cta             // 行动号召
├── footer          // 页脚
├── auth            // 认证
│   ├── login       // 登录
│   ├── signup      // 注册
│   └── errors      // 错误消息
└── dashboard       // 仪表板
    ├── stats       // 统计信息
    ├── recentVideos // 最近视频
    ├── quickActions // 快速操作
    └── settings    // 设置
```

## 🔄 请求流程

```
用户访问 URL
    ↓
middleware.ts (语言检测)
    ↓
重定向到 /[locale]/...
    ↓
app/[locale]/layout.tsx (加载翻译)
    ↓
渲染页面内容
```

## 🎯 主要特性位置

| 特性 | 文件位置 |
|-----|---------|
| 语言配置 | `i18n/config.ts` |
| 中间件 | `middleware.ts` |
| 语言切换器 | `app/components/LanguageSwitcher.tsx` |
| 根布局 | `app/[locale]/layout.tsx` |
| SEO 辅助 | `lib/metadata.ts` |
| 翻译示例 | `app/[locale]/examples/page.tsx` |

## 📖 文档导航

- **新手**: 阅读 `QUICKSTART.md`
- **开发**: 参考 `I18N_README.md`
- **架构**: 查看 `IMPLEMENTATION_NOTES.md`
- **结构**: 本文件 `PROJECT_STRUCTURE.md`

## 🚀 快速访问

### 开发服务器
```bash
npm run dev
```

### 主要 URL
- 主页: `/[locale]`
- 登录: `/[locale]/auth/login`
- 仪表板: `/[locale]/dashboard`
- 示例: `/[locale]/examples`

### 支持的语言
- `/en` - English 🇺🇸
- `/zh` - 中文 🇨🇳
- `/ja` - 日本語 🇯🇵
- `/es` - Español 🇪🇸




