# Dodo Payments 集成总结

## ✅ 已完成的工作

### 1. 数据库设计 ✅
- [x] Payment 表 - 支付记录
- [x] Subscription 表 - 订阅管理
- [x] Refund 表 - 退款记录
- [x] UserCredit 表 - 用户积分
- [x] CreditTransaction 表 - 积分交易历史
- [x] 数据库迁移已执行

### 2. 后端 API ✅
- [x] `POST /api/payments/create-checkout` - 创建支付链接
- [x] `POST /api/webhooks/dodo` - Webhook 事件处理
- [x] `GET /api/payments/history` - 支付历史
- [x] `GET /api/payments/subscription` - 订阅查询
- [x] `DELETE /api/payments/subscription` - 取消订阅
- [x] `GET /api/payments/credits` - 积分查询

### 3. 核心功能库 ✅
- [x] [lib/dodo/config.ts](lib/dodo/config.ts) - 配置管理
- [x] [lib/dodo/client.ts](lib/dodo/client.ts) - API 客户端（保留供未来使用）
- [x] [lib/dodo/customer.ts](lib/dodo/customer.ts) - 客户管理
- [x] [lib/dodo/credits.ts](lib/dodo/credits.ts) - 积分管理

### 4. 前端组件 ✅
- [x] PurchaseButton - 积分购买按钮
- [x] SubscribeButton - 订阅按钮
- [x] PricingCard - 定价卡片
- [x] PaymentHistory - 支付历史列表

### 5. 支付页面 ✅
- [x] `/payment/success` - 支付成功页
- [x] `/payment/cancel` - 支付取消页

### 6. 多语言支持 ✅
- [x] 英文翻译
- [x] 中文翻译
- [x] 所有支付相关文本

### 7. 文档 ✅
- [x] [DODO_PAYMENTS_INTEGRATION.md](DODO_PAYMENTS_INTEGRATION.md) - 完整技术文档
- [x] [DODO_QUICK_START.md](DODO_QUICK_START.md) - 快速开始指南
- [x] [ENV_TEMPLATE.md](ENV_TEMPLATE.md) - 环境变量配置

## 🔧 实现方式

### 简化的架构

**我们使用了简化的实现方式：**

1. **直接使用 Dodo 产品链接**
   - 不需要 API 调用创建 checkout
   - URL 格式：`https://checkout.dodopayments.com/buy/{productId}`
   - 通过 URL 参数传递 metadata

2. **客户自动创建**
   - 用户支付时 Dodo 自动创建客户
   - 无需手动调用客户创建 API

3. **Webhook 驱动**
   - 所有支付状态更新通过 webhook
   - 自动处理积分添加、订阅管理

### URL 生成示例

```typescript
// 构建 Checkout URL
const checkoutUrl = new URL(
  `https://test.checkout.dodopayments.com/buy/${productId}`
);

// 添加 metadata - 会在 webhook 中返回
checkoutUrl.searchParams.set('metadata[userId]', userId);
checkoutUrl.searchParams.set('metadata[paymentId]', paymentId);
checkoutUrl.searchParams.set('metadata[credits]', '500');
checkoutUrl.searchParams.set('quantity', '1');

// 生成的 URL:
// https://test.checkout.dodopayments.com/buy/pdt_xxx?metadata[userId]=user_123&...
```

## 📝 下一步操作

### 1. 在 Dodo Dashboard 创建产品

登录 [Dodo Payments Dashboard](https://dashboard.dodopayments.com) 并创建产品：

**积分包示例：**
- 50 Credits - $4.99
- 100 Credits - $8.99
- 500 Credits - $39.99
- 1000 Credits - $69.99

**获取产品 ID** 后，更新 [lib/dodo/config.ts](lib/dodo/config.ts:26-64)：

```typescript
export const CREDIT_PACKAGES = [
  {
    id: 'pdt_YOUR_ACTUAL_ID', // ← 替换这里
    name: '50 Credits',
    credits: 50,
    price: 4.99,
    // ...
  },
];
```

### 2. 配置环境变量

在 `.env` 文件中：

```env
# Dodo Payments
DODO_PAYMENTS_API_KEY=your-api-key
DODO_WEBHOOK_SECRET=your-webhook-secret
DODO_TEST_MODE=true

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. 设置 Webhook

**开发环境：**
```bash
# 1. 使用 ngrok 暴露本地服务器
ngrok http 3000

# 2. 在 Dodo Dashboard 设置 Webhook URL
https://your-ngrok-url.ngrok.io/api/webhooks/dodo
```

**生产环境：**
```
https://yourdomain.com/api/webhooks/dodo
```

### 4. 测试

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:3000/pricing
# 点击购买按钮测试流程
```

**测试卡号：**
- 成功：`4242 4242 4242 4242`
- 失败：`4000 0000 0000 0002`

## 🎯 核心功能

### 支持的支付类型

**1. 一次性积分包**
```typescript
// 配置在 lib/dodo/config.ts
CREDIT_PACKAGES = [
  { id: 'pdt_xxx', credits: 50, price: 4.99 },
  { id: 'pdt_xxx', credits: 500, price: 39.99 },
  // ...
];
```

**2. 月度/年度订阅**
```typescript
SUBSCRIPTION_PLANS = [
  { id: 'plan_basic', credits: 100, price: 9.99, interval: 'month' },
  { id: 'plan_pro', credits: 500, price: 29.99, interval: 'month' },
  // ...
];
```

### Webhook 事件处理

支持的事件：
- `payment.succeeded` → 更新支付状态 + 添加积分
- `payment.failed` → 更新支付状态为失败
- `subscription.created` → 创建订阅 + 添加积分
- `subscription.updated` → 更新订阅信息
- `subscription.deleted` → 取消订阅
- `refund.created` → 处理退款 + 返还积分

### 积分系统

**自动积分管理：**
```typescript
// 购买时添加
await addCredits({
  userId,
  amount: 500,
  type: 'PURCHASE',
  paymentId,
});

// 生成视频时扣除
await deductCredits({
  userId,
  amount: 10,
  type: 'VIDEO_GENERATION',
  videoId,
});
```

## 🔍 调试技巧

### 查看日志

**支付创建：**
```
Created checkout URL: https://test.checkout.dodopayments.com/buy/...
```

**Webhook 接收：**
```
Received webhook event: payment.succeeded
Processing payment succeeded: pay_xxx
Added 500 credits to user user_xxx
```

### 数据库查询

```sql
-- 查看支付记录
SELECT * FROM payments WHERE "userId" = 'user_xxx' ORDER BY "createdAt" DESC;

-- 查看积分余额
SELECT * FROM user_credits WHERE "userId" = 'user_xxx';

-- 查看积分交易
SELECT * FROM credit_transactions WHERE "userId" = 'user_xxx' ORDER BY "createdAt" DESC;
```

## ⚠️ 常见问题

### Q: 点击购买后报错 "Failed to create checkout session"？

**原因：** 产品 ID 不匹配或数据库连接问题

**解决：**
1. 检查 `lib/dodo/config.ts` 中的产品 ID
2. 确认数据库连接正常
3. 查看服务器日志了解详细错误

### Q: Webhook 没有收到？

**原因：** URL 无法访问或签名验证失败

**解决：**
1. 确认 webhook URL 可以从外网访问（使用 ngrok）
2. 检查 `DODO_WEBHOOK_SECRET` 是否正确
3. 查看 Dodo Dashboard 的 webhook 日志

### Q: 积分没有添加？

**原因：** Webhook 处理失败或 metadata 缺失

**解决：**
1. 查看服务器日志中的 webhook 处理信息
2. 确认 webhook 事件包含正确的 metadata
3. 检查数据库中的支付记录状态

## 📊 项目文件结构

```
├── lib/dodo/
│   ├── config.ts          # 配置和产品定义
│   ├── client.ts          # API 客户端（保留）
│   ├── customer.ts        # 客户管理
│   └── credits.ts         # 积分管理
│
├── app/api/
│   ├── payments/
│   │   ├── create-checkout/route.ts  # 创建支付链接
│   │   ├── history/route.ts          # 支付历史
│   │   ├── subscription/route.ts     # 订阅管理
│   │   └── credits/route.ts          # 积分查询
│   └── webhooks/
│       └── dodo/route.ts              # Webhook 处理
│
├── app/components/payments/
│   ├── PurchaseButton.tsx    # 购买按钮
│   ├── SubscribeButton.tsx   # 订阅按钮
│   ├── PricingCard.tsx       # 定价卡片
│   └── PaymentHistory.tsx    # 支付历史
│
├── app/[locale]/payment/
│   ├── success/page.tsx      # 成功页
│   └── cancel/page.tsx       # 取消页
│
├── prisma/
│   └── schema.prisma         # 数据库模型
│
└── 文档/
    ├── DODO_PAYMENTS_INTEGRATION.md  # 完整技术文档
    ├── DODO_QUICK_START.md          # 快速开始
    └── ENV_TEMPLATE.md              # 环境配置
```

## 🚀 生产部署

### 1. 更新环境变量

```env
DODO_TEST_MODE=false
DODO_BASE_URL=https://api.dodopayments.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. 配置生产 Webhook

```
https://yourdomain.com/api/webhooks/dodo
```

### 3. 测试完整流程

- [ ] 测试购买流程
- [ ] 验证 webhook 接收
- [ ] 确认积分正确添加
- [ ] 检查支付历史显示
- [ ] 测试订阅管理
- [ ] 验证退款流程

## 📚 相关资源

- **文档：**
  - [完整技术文档](./DODO_PAYMENTS_INTEGRATION.md)
  - [快速开始指南](./DODO_QUICK_START.md)
  - [环境变量配置](./ENV_TEMPLATE.md)

- **外部链接：**
  - [Dodo Payments 官方文档](https://docs.dodopayments.com)
  - [Dodo Dashboard](https://dashboard.dodopayments.com)

---

**集成完成！** 🎉

现在你可以开始配置产品和测试支付流程了。如有问题，请查看日志和文档。
