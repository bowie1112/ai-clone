# 游客生成限制功能文档

## 功能概述

此功能实现了对未登录用户（游客）的视频生成限制，允许他们免费生成一次视频，之后需要登录才能继续使用。

## 限制策略

系统使用多重验证策略来防止滥用：

1. **IP 地址追踪** - 记录用户的真实 IP 地址
2. **浏览器指纹** - 使用 FingerprintJS 生成唯一的设备标识
3. **Cookie 标记** - 在浏览器中存储使用记录（有效期 1 年）
4. **LocalStorage** - 额外的本地存储验证

## 技术架构

### 数据库设计

新增 `guest_usage` 表：

```sql
CREATE TABLE "guest_usage" (
    "id" UUID PRIMARY KEY,
    "ipAddress" INET NOT NULL,          -- IP 地址
    "fingerprint" TEXT NOT NULL,        -- 浏览器指纹
    "userAgent" TEXT,                   -- 用户代理
    "videoId" UUID NOT NULL,            -- 关联的视频 ID
    "usedAt" TIMESTAMPTZ(6) DEFAULT NOW(), -- 使用时间
    "country" TEXT,                     -- 国家（可选）
    "city" TEXT                         -- 城市（可选）
);

-- 索引
CREATE INDEX ON "guest_usage"("ipAddress");
CREATE INDEX ON "guest_usage"("fingerprint");
CREATE INDEX ON "guest_usage"("ipAddress", "fingerprint");
```

### 文件结构

```
lib/guest-limit/
├── fingerprint.ts         # 浏览器指纹检测
├── storage.ts            # 本地存储管理
└── client-check.ts       # 客户端检查逻辑

app/api/guest/
├── check/route.ts        # 检查游客限制 API
└── record/route.ts       # 记录游客使用 API

components/
├── GuestLimitBanner.tsx  # 提示横幅组件
├── GuestLimitModal.tsx   # 限制弹窗组件
└── VideoGenerateForm.tsx # 示例表单组件

messages/
├── zh.json              # 中文翻译
├── en.json              # 英文翻译
├── ja.json              # 日文翻译
└── es.json              # 西班牙文翻译
```

## 使用方法

### 1. 运行数据库迁移

```bash
# 确保数据库连接正常，然后运行迁移
npx prisma migrate deploy
```

### 2. 在表单组件中集成

```tsx
import { VideoGenerateForm } from '@/components/VideoGenerateForm';

export default function Page() {
  const isLoggedIn = false; // 从会话中获取登录状态

  return (
    <VideoGenerateForm
      isLoggedIn={isLoggedIn}
      onVideoCreated={(video) => {
        console.log('Video created:', video);
      }}
    />
  );
}
```

### 3. API 调用示例

**检查游客限制：**

```typescript
import { checkGuestLimit } from '@/lib/guest-limit/client-check';

const result = await checkGuestLimit();
if (!result.allowed) {
  console.log('已达限制:', result.reason);
}
```

**创建视频（自动处理游客限制）：**

```typescript
import { getClientIdentity } from '@/lib/guest-limit/fingerprint';

const identity = await getClientIdentity();

const response = await fetch('/api/videos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: '描述...',
    ...identity, // 游客时附加 fingerprint 和 userAgent
  }),
});
```

## API 端点

### POST /api/guest/check

检查游客是否可以生成视频。

**请求体：**
```json
{
  "fingerprint": "abc123...",
  "userAgent": "Mozilla/5.0..."
}
```

**响应：**
```json
{
  "allowed": true,
  "remainingAttempts": 1
}
```

或

```json
{
  "allowed": false,
  "reason": "already_used",
  "remainingAttempts": 0,
  "usedAt": "2024-11-04T10:30:00Z"
}
```

### POST /api/guest/record

记录游客使用情况（通常在视频创建成功后自动调用）。

**请求体：**
```json
{
  "fingerprint": "abc123...",
  "userAgent": "Mozilla/5.0...",
  "videoId": "uuid-here"
}
```

**响应：**
```json
{
  "success": true,
  "id": "usage-uuid"
}
```

### POST /api/videos（已修改）

创建视频 API 已集成游客限制检查。

**游客用户请求：**
```json
{
  "prompt": "描述...",
  "fingerprint": "abc123...",
  "userAgent": "Mozilla/5.0..."
}
```

**错误响应（限制超出）：**
```json
{
  "error": "Guest limit exceeded",
  "message": "You have already used your free generation. Please sign in to continue.",
  "code": "GUEST_LIMIT_EXCEEDED"
}
```

## 组件使用

### GuestLimitBanner

显示游客状态的横幅提示。

```tsx
import { GuestLimitBanner } from '@/components/GuestLimitBanner';

<GuestLimitBanner isLoggedIn={false} />
```

### GuestLimitModal

当游客达到限制时显示的弹窗。

```tsx
import { GuestLimitModal } from '@/components/GuestLimitModal';

const [showModal, setShowModal] = useState(false);

<GuestLimitModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
/>
```

## 测试场景

### 场景 1：首次访问

1. 访问网站（未登录）
2. 填写表单生成视频
3. ✅ 成功生成
4. 本地存储、Cookie 和数据库记录被创建

### 场景 2：第二次访问（相同浏览器）

1. 刷新页面或重新访问
2. 横幅显示"已达使用上限"
3. 尝试生成视频
4. ❌ 显示限制弹窗，引导用户登录

### 场景 3：清除 Cookie 后访问

1. 清除浏览器 Cookie 和 LocalStorage
2. 刷新页面
3. 横幅显示"免费试用可用"（因为本地检查通过）
4. 尝试生成视频
5. ❌ 服务器检查发现 IP/指纹已使用，拒绝请求

### 场景 4：登录用户

1. 用户登录
2. ✅ 不受游客限制影响
3. 可以无限制生成视频

## 安全考虑

1. **服务器端验证** - 所有限制检查都在服务器端进行，客户端检查仅用于提升用户体验
2. **多重追踪** - 使用 IP、指纹、Cookie 和 LocalStorage 多重验证，难以绕过
3. **友好降级** - 如果指纹获取失败或服务器错误，系统会优雅降级而不是完全阻止
4. **隐私保护** - 仅存储必要的追踪信息，不收集敏感数据

## 配置选项

### 修改限制次数

在 [lib/guest-limit/client-check.ts](lib/guest-limit/client-check.ts:12) 中修改 `remainingAttempts` 的值。

### 修改 Cookie 有效期

在 [lib/guest-limit/storage.ts](lib/guest-limit/storage.ts:11) 中修改 `COOKIE_EXPIRES_DAYS` 常量。

### 添加地理位置服务

在 [app/api/guest/record/route.ts](app/api/guest/record/route.ts:30) 中集成地理位置 API（如 MaxMind GeoIP）。

## 故障排除

### 问题：类型错误 "guestUsage does not exist"

**解决方案：**
```bash
npx prisma generate
```

### 问题：数据库迁移失败

**解决方案：**
```bash
# 检查数据库连接
npx prisma db push

# 或手动运行迁移 SQL
# 文件位置: prisma/migrations/20251104141627_add_guest_usage/migration.sql
```

### 问题：指纹检测不工作

**解决方案：**
- 确保在客户端组件中使用（标记 "use client"）
- 检查 FingerprintJS 库是否正确加载
- 查看浏览器控制台错误信息

## 性能优化

1. **客户端快速检查** - 使用 `quickCheckLocal()` 先检查本地存储，避免不必要的 API 调用
2. **数据库索引** - IP 和指纹字段都有索引，查询性能优化
3. **错误友好降级** - 出错时允许继续而不是阻止用户

## 未来增强

1. **Rate Limiting** - 添加请求频率限制防止暴力攻击
2. **高级地理位置** - 集成完整的地理位置服务
3. **管理后台** - 创建管理界面查看和管理游客使用记录
4. **分析统计** - 收集转化率数据（游客到注册用户的转化）
5. **A/B 测试** - 测试不同的限制策略对转化率的影响

## 许可证

此功能作为项目的一部分，遵循项目整体许可证。
