# Dodo Payments 快速开始指南

## ✅ 已修复的问题

原始实现尝试通过 API 创建客户和支付链接，但 Dodo Payments 使用更简单的方式：
- **直接使用产品购买链接**（无需 API 调用创建 checkout）
- **客户在支付时自动创建**
- **通过 URL 参数传递 metadata**

## 📋 快速设置步骤

### 1. 在 Dodo Payments Dashboard 创建产品

1. 登录 [Dodo Payments Dashboard](https://dashboard.dodopayments.com)
2. 进入 **Products** 页面
3. 创建以下产品：

#### 积分包产品
- **50 Credits** - $4.99
- **100 Credits** - $8.99
- **500 Credits** - $39.99
- **1000 Credits** - $69.99

#### 订阅产品（可选）
- **Basic Plan** - $9.99/月
- **Pro Plan** - $29.99/月

### 2. 获取产品 ID

创建产品后，每个产品会有一个 ID（格式：`pdt_xxxxx`）。

在 [lib/dodo/config.ts](lib/dodo/config.ts:26-64) 中，将产品 ID 替换为你的实际 ID：

```typescript
export const CREDIT_PACKAGES = [
  {
    id: 'pdt_YOUR_ACTUAL_ID_HERE', // 替换这里
    name: '50 Credits',
    credits: 50,
    price: 4.99,
    // ...
  },
  // ...
];
```

### 3. 配置环境变量

在 `.env` 文件中添加：

```env
# Dodo Payments 配置
DODO_PAYMENTS_API_KEY=your-api-key-here
DODO_WEBHOOK_SECRET=your-webhook-secret-here
DODO_TEST_MODE=true

# 应用 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 配置 Webhook

在 Dodo Dashboard 中设置 Webhook URL：

**开发环境：**
使用 ngrok 暴露本地服务器：
```bash
ngrok http 3000
```

然后在 Dodo Dashboard 设置 Webhook URL：
```
https://your-ngrok-url.ngrok.io/api/webhooks/dodo
```

**生产环境：**
```
https://yourdomain.com/api/webhooks/dodo
```

### 5. 测试支付流程

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问价格页面：
```
http://localhost:3000/pricing
```

3. 点击"Buy Now"按钮

4. 使用测试卡号完成支付：
   - 成功：`4242 4242 4242 4242`
   - 失败：`4000 0000 0000 0002`

## 🔄 工作流程

### 购买流程

```
用户点击购买按钮
    ↓
前端调用 /api/payments/create-checkout
    ↓
创建本地支付记录（status: PENDING）
    ↓
生成 Dodo Checkout URL（包含 metadata）
    ↓
重定向用户到 Dodo 支付页面
    ↓
用户完成支付
    ↓
Dodo 发送 webhook 到 /api/webhooks/dodo
    ↓
验证 webhook 签名
    ↓
更新支付记录（status: COMPLETED）
    ↓
添加积分到用户账户
    ↓
用户重定向到成功页面
```

### Checkout URL 格式

生成的 URL 格式如下：

```
https://test.checkout.dodopayments.com/buy/{productId}?
  metadata[userId]=user_123&
  metadata[paymentId]=pay_456&
  metadata[type]=credit_package&
  metadata[credits]=500&
  quantity=1
```

metadata 参数会在 webhook 事件中返回，用于关联支付。

## 🎯 前端集成示例

### 使用 PurchaseButton 组件

```tsx
import PurchaseButton from '@/app/components/payments/PurchaseButton';

<PurchaseButton
  userId={user.id}
  productId="pdt_Yx6bTyxVG2e02BeXAsb9i"  // 你的产品 ID
  productName="500 Credits"
  price={39.99}
  credits={500}
/>
```

### 使用 SubscribeButton 组件

```tsx
import SubscribeButton from '@/app/components/payments/SubscribeButton';

<SubscribeButton
  userId={user.id}
  planId="plan_pro_monthly"
  planName="Pro"
  interval="month"
  price={29.99}
/>
```

## 🔍 调试

### 查看日志

支付创建日志：
```
Created checkout URL: https://test.checkout.dodopayments.com/buy/...
```

Webhook 事件日志：
```
Received webhook event: payment.succeeded
Processing payment succeeded: pay_xxx
Added 500 credits to user user_xxx
```

### 常见问题

**Q: 点击购买后没有跳转？**
- 检查浏览器控制台是否有错误
- 确认 `NEXT_PUBLIC_APP_URL` 已设置
- 检查产品 ID 是否正确

**Q: Webhook 没有收到？**
- 确认 webhook URL 可以从外网访问（使用 ngrok）
- 检查 Dodo Dashboard 的 webhook 日志
- 确认 `DODO_WEBHOOK_SECRET` 正确

**Q: 积分没有添加？**
- 检查服务器日志中的 webhook 处理信息
- 确认 metadata 中的 `userId` 和 `paymentId` 正确
- 查看数据库中的支付记录状态

## 📊 数据库查询

### 查看支付记录

```sql
SELECT * FROM payments WHERE "userId" = 'user_xxx' ORDER BY "createdAt" DESC;
```

### 查看用户积分

```sql
SELECT * FROM user_credits WHERE "userId" = 'user_xxx';
```

### 查看积分交易历史

```sql
SELECT * FROM credit_transactions WHERE "userId" = 'user_xxx' ORDER BY "createdAt" DESC;
```

## 🎨 自定义

### 修改积分包

编辑 [lib/dodo/config.ts](lib/dodo/config.ts:26-64)：

```typescript
export const CREDIT_PACKAGES = [
  {
    id: 'pdt_xxx',           // Dodo 产品 ID
    name: '自定义名称',
    credits: 100,            // 积分数量
    price: 19.99,           // 价格
    currency: 'USD',
    description: '描述',
    popular: true,          // 是否标记为热门
  },
];
```

### 自定义 UI

所有支付组件都支持自定义样式：

```tsx
<PurchaseButton
  userId={user.id}
  productId="pdt_xxx"
  productName="500 Credits"
  price={39.99}
  credits={500}
  variant="primary"        // 'primary' | 'secondary'
  className="custom-class" // 自定义 CSS 类
/>
```

## 🚀 部署到生产环境

1. **更新环境变量：**
```env
DODO_TEST_MODE=false
DODO_BASE_URL=https://api.dodopayments.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

2. **配置生产环境 Webhook：**
```
https://yourdomain.com/api/webhooks/dodo
```

3. **测试完整流程：**
- 测试购买
- 验证 webhook 接收
- 确认积分添加
- 检查支付历史

## 📚 相关文档

- [完整集成文档](./DODO_PAYMENTS_INTEGRATION.md)
- [环境变量配置](./ENV_TEMPLATE.md)
- [Dodo Payments 官方文档](https://docs.dodopayments.com)

---

**需要帮助？** 查看服务器日志和 Dodo Dashboard 的 webhook 日志进行调试。
