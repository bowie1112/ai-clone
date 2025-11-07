# Dodo Payments 集成文档

本文档详细说明了 AI 视频生成网站与 Dodo Payments 的集成实现。

## 目录

- [功能概览](#功能概览)
- [架构设计](#架构设计)
- [数据库模型](#数据库模型)
- [API 端点](#api-端点)
- [前端组件](#前端组件)
- [Webhook 处理](#webhook-处理)
- [使用指南](#使用指南)
- [测试指南](#测试指南)

---

## 功能概览

### 支持的支付类型

1. **一次性积分包购买**
   - 100 积分 - $9.99
   - 500 积分 - $39.99 (节省 20%)
   - 1000 积分 - $69.99 (节省 30%)
   - 5000 积分 - $299.99 (节省 40%)

2. **月度/年度订阅**
   - Basic Plan - $19.99/月 (100 积分/月)
   - Pro Plan - $49.99/月 (500 积分/月)
   - Enterprise Plan - 定制定价

### 核心功能

- ✅ 安全的 checkout 创建
- ✅ Webhook 事件处理
- ✅ 自动积分添加
- ✅ 订阅管理
- ✅ 退款处理
- ✅ 支付历史记录
- ✅ 多语言支持 (英文/中文/日文/西班牙文)

---

## 架构设计

### 系统架构图

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   用户界面   │ ──────> │  Next.js API │ ──────> │ Dodo API    │
│ (组件)      │         │  (路由)      │         │             │
└─────────────┘         └──────────────┘         └─────────────┘
                               │
                               ↓
                        ┌──────────────┐
                        │  PostgreSQL   │
                        │  (Supabase)   │
                        └──────────────┘
                               ↑
                               │
┌─────────────┐         ┌──────────────┐
│ Dodo        │ ──────> │  Webhook     │
│ Payments    │         │  Handler     │
└─────────────┘         └──────────────┘
```

### 数据流

1. **购买流程**
   ```
   用户点击购买 → 创建 checkout → 重定向到 Dodo →
   用户支付 → Webhook 通知 → 更新数据库 → 添加积分
   ```

2. **订阅流程**
   ```
   用户订阅 → 创建订阅 → 定期计费 →
   Webhook 通知 → 续订积分 → 更新订阅状态
   ```

---

## 数据库模型

### Payment (支付记录)

```prisma
model Payment {
  id              String        @id @default(cuid())
  userId          String?
  dodoPaymentId   String?       @unique
  dodoCustomerId  String?
  dodoSessionId   String?       @unique
  type            PaymentType   // CREDIT_PACKAGE | SUBSCRIPTION
  status          PaymentStatus // PENDING | COMPLETED | FAILED
  amount          Float
  currency        String
  credits         Int?
  productId       String?
  productName     String?
  description     String?
  metadata        Json?
  createdAt       DateTime
  updatedAt       DateTime
  completedAt     DateTime?
}
```

### Subscription (订阅)

```prisma
model Subscription {
  id                  String             @id @default(cuid())
  userId              String             @unique
  dodoSubscriptionId  String             @unique
  dodoCustomerId      String
  dodoProductId       String
  status              SubscriptionStatus // ACTIVE | CANCELLED
  planName            String
  planType            String
  monthlyCredits      Int
  amount              Float
  currency            String
  interval            String             // month | year
  currentPeriodStart  DateTime
  currentPeriodEnd    DateTime
  cancelAtPeriodEnd   Boolean
  createdAt           DateTime
  updatedAt           DateTime
}
```

### UserCredit (用户积分)

```prisma
model UserCredit {
  id              String    @id @default(cuid())
  userId          String    @unique
  balance         Int       @default(0)
  totalEarned     Int       @default(0)
  totalSpent      Int       @default(0)
  createdAt       DateTime
  updatedAt       DateTime
  transactions    CreditTransaction[]
}
```

### CreditTransaction (积分交易)

```prisma
model CreditTransaction {
  id              String                @id @default(cuid())
  userId          String
  type            CreditTransactionType // PURCHASE | SUBSCRIPTION | VIDEO_GENERATION
  amount          Int                   // 正数=增加，负数=扣除
  balanceBefore   Int
  balanceAfter    Int
  paymentId       String?
  videoId         String?
  description     String?
  metadata        Json?
  createdAt       DateTime
}
```

---

## API 端点

### POST /api/payments/create-checkout

创建支付 checkout session。

**请求体：**
```json
{
  "userId": "user_123",
  "type": "credit_package",  // 或 "subscription"
  "productId": "credits_500",
  "interval": "month"  // 仅订阅需要
}
```

**响应：**
```json
{
  "url": "https://checkout.dodopayments.com/...",
  "sessionId": "cs_123",
  "paymentId": "pay_123"
}
```

### POST /api/webhooks/dodo

处理 Dodo Payments webhook 事件。

**支持的事件：**
- `payment.succeeded` - 支付成功
- `payment.failed` - 支付失败
- `subscription.created` - 订阅创建
- `subscription.updated` - 订阅更新
- `subscription.deleted` - 订阅取消
- `refund.created` - 退款创建

**安全验证：**
使用 HMAC SHA256 验证 webhook 签名。

### GET /api/payments/history

获取用户支付历史。

**查询参数：**
- `userId` - 用户 ID
- `limit` - 返回数量 (默认 20)
- `offset` - 偏移量 (默认 0)

**响应：**
```json
{
  "payments": [...],
  "total": 100,
  "hasMore": true
}
```

### GET /api/payments/subscription

获取用户订阅信息。

**查询参数：**
- `userId` - 用户 ID

**响应：**
```json
{
  "subscription": {
    "id": "sub_123",
    "planName": "Pro",
    "status": "ACTIVE",
    "currentPeriodEnd": "2025-12-05T00:00:00Z"
  }
}
```

### DELETE /api/payments/subscription

取消用户订阅。

**查询参数：**
- `userId` - 用户 ID
- `cancelAtPeriodEnd` - 是否在周期结束时取消

### GET /api/payments/credits

获取用户积分信息。

**查询参数：**
- `userId` - 用户 ID
- `includeTransactions` - 是否包含交易历史

**响应：**
```json
{
  "credits": {
    "balance": 500,
    "totalEarned": 1000,
    "totalSpent": 500
  },
  "transactions": {...}
}
```

---

## 前端组件

### PurchaseButton

用于一次性积分包购买。

```tsx
<PurchaseButton
  userId={user.id}
  productId="credits_500"
  productName="500 Credits"
  price={39.99}
  credits={500}
/>
```

### SubscribeButton

用于订阅套餐。

```tsx
<SubscribeButton
  userId={user.id}
  planId="plan_pro_monthly"
  planName="Pro"
  interval="month"
  price={49.99}
/>
```

### PricingCard

显示定价方案卡片。

```tsx
<PricingCard
  userId={user?.id}
  planId="plan_pro_monthly"
  planName="Pro"
  planType="pro"
  price={49.99}
  yearlyPrice={499.99}
  interval="month"
  credits={500}
  features={[...]}
  popular={true}
/>
```

### PaymentHistory

显示支付历史记录。

```tsx
<PaymentHistory
  userId={user.id}
  limit={20}
/>
```

---

## Webhook 处理

### 事件处理流程

1. **验证签名**
   ```typescript
   const signature = headers.get('x-dodo-signature');
   const isValid = verifyWebhookSignature(payload, signature, secret);
   ```

2. **解析事件**
   ```typescript
   const event = JSON.parse(payload);
   const eventType = event.type;
   ```

3. **处理事件**
   - 支付成功 → 更新支付状态 → 添加积分
   - 订阅创建 → 创建订阅记录 → 添加积分
   - 订阅更新 → 更新订阅状态
   - 订阅取消 → 标记为已取消
   - 退款创建 → 创建退款记录 → 返还积分

### Webhook 安全

- ✅ HMAC SHA256 签名验证
- ✅ 时间戳验证 (防重放攻击)
- ✅ IP 白名单 (可选)
- ✅ HTTPS 强制

---

## 使用指南

### 1. 环境配置

在 `.env` 文件中添加：

```env
DODO_PAYMENTS_API_KEY=your-api-key
DODO_WEBHOOK_SECRET=your-webhook-secret
DODO_BASE_URL=https://api.dodopayments.com
DODO_TEST_MODE=true
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 数据库迁移

```bash
npx prisma migrate dev
npx prisma generate
```

### 3. 配置 Webhook

在 Dodo Payments 控制台设置 webhook URL：
- 开发：使用 ngrok 暴露本地服务器
- 生产：`https://yourdomain.com/api/webhooks/dodo`

### 4. 创建产品

在 Dodo Payments 控制台创建产品和价格，确保 `productId` 与配置文件匹配。

### 5. 测试支付

使用测试卡号：
- 成功：`4242 4242 4242 4242`
- 失败：`4000 0000 0000 0002`

---

## 测试指南

### 单元测试

```bash
# 测试积分系统
npm test lib/dodo/credits.test.ts

# 测试 webhook 处理
npm test app/api/webhooks/dodo/route.test.ts
```

### 集成测试

1. **测试购买流程**
   - 创建 checkout
   - 完成支付
   - 验证积分添加
   - 检查支付历史

2. **测试订阅流程**
   - 创建订阅
   - 验证积分添加
   - 测试续订
   - 测试取消

3. **测试 Webhook**
   - 使用 Dodo 测试工具发送事件
   - 验证数据库更新
   - 检查积分变化

### 常见问题

**Q: Webhook 未收到事件？**
- 检查 webhook URL 是否可访问
- 验证签名密钥是否正确
- 查看 Dodo 控制台的 webhook 日志

**Q: 积分未添加？**
- 检查 webhook 处理日志
- 验证支付状态
- 确认用户 ID 正确

**Q: 支付失败？**
- 检查 API 密钥
- 验证产品 ID
- 查看错误日志

---

## 文件结构

```
├── lib/dodo/
│   ├── config.ts          # 配置和常量
│   ├── client.ts          # Dodo API 客户端
│   ├── customer.ts        # 客户管理
│   └── credits.ts         # 积分管理
├── app/api/
│   ├── payments/
│   │   ├── create-checkout/route.ts
│   │   ├── history/route.ts
│   │   ├── subscription/route.ts
│   │   └── credits/route.ts
│   └── webhooks/
│       └── dodo/route.ts
├── app/components/payments/
│   ├── PurchaseButton.tsx
│   ├── SubscribeButton.tsx
│   ├── PricingCard.tsx
│   └── PaymentHistory.tsx
├── app/[locale]/payment/
│   ├── success/page.tsx
│   └── cancel/page.tsx
└── prisma/
    └── schema.prisma       # 数据库模型
```

---

## 相关资源

- [Dodo Payments 文档](https://docs.dodopayments.com)
- [项目 README](./README.md)
- [环境变量配置](./ENV_TEMPLATE.md)
- [数据库设置](./SUPABASE_SETUP.md)

---

## 支持

如有问题或需要帮助，请：
1. 查看本文档和 Dodo Payments 官方文档
2. 检查服务器日志
3. 联系技术支持团队
