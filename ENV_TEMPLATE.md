# 📝 环境变量配置模板

复制此文件到 `.env` 并填写相应的值。

---

## 📋 完整的 .env 配置

```env
# ==================================
# 数据库配置 (Supabase PostgreSQL)
# ==================================

# Transaction 模式 - 用于 Prisma 迁移和大多数操作
# 格式: postgresql://postgres:[密码]@db.[项目引用].supabase.co:5432/postgres
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Session 模式 - 用于生产环境连接池（无服务器环境）
# 格式: postgresql://postgres:[密码]@db.[项目引用].supabase.co:6543/postgres?pgbouncer=true
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true"

# ==================================
# Google OAuth 配置（可选）
# ==================================

# 是否启用 Google 登录（0=禁用，1=启用）
NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED=0

# Google OAuth 客户端 ID
# 从 Google Cloud Console 获取
# GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Google OAuth 客户端密钥
# GOOGLE_CLIENT_SECRET=your-client-secret

# ==================================
# Better Auth 配置
# ==================================

# Better Auth 密钥（至少 32 个字符）
# 生成方式: openssl rand -base64 32
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long-please-change-this

# Better Auth URL（开发环境）
BETTER_AUTH_URL=http://localhost:3000

# 生产环境请改为实际域名
# BETTER_AUTH_URL=https://yourdomain.com

# ==================================
# Luma AI 配置（可选）
# ==================================

# Luma AI API 密钥
# 从 https://lumalabs.ai 获取
# LUMA_API_KEY=your-luma-api-key

# ==================================
# Dodo Payments 配置
# ==================================

# Dodo Payments API 密钥
# 从 Dodo Payments 控制台获取
DODO_PAYMENTS_API_KEY=your-dodo-api-key

# Dodo Payments Webhook 密钥
# 用于验证 webhook 签名
DODO_WEBHOOK_SECRET=your-webhook-secret

# Dodo Payments API 基础 URL
# 测试环境: https://test.dodopayments.com
# 生产环境: https://api.dodopayments.com
DODO_BASE_URL=https://api.dodopayments.com

# 是否使用测试模式
DODO_TEST_MODE=true

# 应用 URL（用于支付回调）
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==================================
# Next.js 配置
# ==================================

# 环境类型
NODE_ENV=development
# NODE_ENV=production

# 端口（可选，默认 3000）
# PORT=3000
```

---

## 🔑 如何获取各项配置

### 1. Supabase 数据库连接字符串

1. 登录 [Supabase](https://supabase.com)
2. 选择项目 → Settings → Database
3. 在 "Connection string" 部分找到：
   - **URI**: 复制到 `DATABASE_URL`
   - **Connection pooling**: 复制到 `DIRECT_URL`
4. 替换 `[YOUR-PASSWORD]` 为您的数据库密码

**示例**：
```env
DATABASE_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmn.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmn.supabase.co:6543/postgres?pgbouncer=true"
```

### 2. Google OAuth（可选）

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 创建项目或选择现有项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 凭据
5. 设置授权重定向 URI：
   - 开发：`http://localhost:3000/api/auth/callback/google`
   - 生产：`https://yourdomain.com/api/auth/callback/google`
6. 复制 Client ID 和 Client Secret

### 3. Better Auth 密钥

生成随机密钥：

```bash
# 方法 1: 使用 openssl
openssl rand -base64 32

# 方法 2: 使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法 3: 在线生成
# https://generate-secret.vercel.app/32
```

### 4. Luma AI API 密钥（可选）

1. 访问 [Luma Labs](https://lumalabs.ai)
2. 注册账户
3. 进入 API 设置
4. 生成 API 密钥

### 5. Dodo Payments 配置

1. 访问 [Dodo Payments](https://dodopayments.com)
2. 注册账户并完成认证
3. 进入控制台 → API Keys
4. 生成 API 密钥和 Webhook 密钥
5. 配置 Webhook URL：
   - 开发：`http://your-ngrok-url/api/webhooks/dodo`
   - 生产：`https://yourdomain.com/api/webhooks/dodo`
6. 在 Dodo 控制台创建产品和价格

**重要提示**：
- 开发环境需要使用 ngrok 或类似工具暴露本地服务器
- Webhook 签名验证确保支付事件的安全性
- 测试模式不会产生真实费用

---

## ⚠️ 重要提示

### 安全性

1. **永远不要提交 .env 文件到 Git**
   - 确保 `.gitignore` 包含 `.env`

2. **使用强密码**
   - 至少 16 个字符
   - 包含大小写字母、数字和符号

3. **定期更换密钥**
   - 特别是生产环境的密钥
   - Better Auth Secret 应定期更换

4. **不要在客户端使用敏感密钥**
   - 只有 `NEXT_PUBLIC_*` 开头的变量会暴露给客户端
   - 其他变量只在服务器端可用

### 开发 vs 生产

**开发环境** (`.env.local`):
```env
NODE_ENV=development
BETTER_AUTH_URL=http://localhost:3000
```

**生产环境** (Vercel/部署平台设置):
```env
NODE_ENV=production
BETTER_AUTH_URL=https://yourdomain.com
```

---

## ✅ 配置检查清单

在启动应用前，确保已配置：

- [ ] `DATABASE_URL` - Supabase 连接字符串
- [ ] `DIRECT_URL` - Supabase 连接池字符串
- [ ] `BETTER_AUTH_SECRET` - 至少 32 个字符的随机密钥
- [ ] `BETTER_AUTH_URL` - 应用 URL
- [ ] `.env` 文件已添加到 `.gitignore`

支付配置（推荐）：
- [ ] `DODO_PAYMENTS_API_KEY` - Dodo Payments API 密钥
- [ ] `DODO_WEBHOOK_SECRET` - Webhook 签名密钥
- [ ] `DODO_BASE_URL` - API 基础 URL
- [ ] `NEXT_PUBLIC_APP_URL` - 应用 URL

可选配置：
- [ ] `NEXT_PUBLIC_GOOGLE_LOGIN_ENABLED` - 如果启用 Google 登录
- [ ] `GOOGLE_CLIENT_ID` - 如果启用 Google 登录
- [ ] `GOOGLE_CLIENT_SECRET` - 如果启用 Google 登录
- [ ] `LUMA_API_KEY` - 如果使用 Luma AI

---

## 🧪 测试配置

创建 `.env` 文件后，运行以下命令测试：

```bash
# 测试数据库连接
npx prisma db pull

# 测试 Prisma 生成
npx prisma generate

# 启动开发服务器
npm run dev
```

---

## 📚 相关文档

- [Supabase 设置指南](./SUPABASE_SETUP.md)
- [数据库快速开始](./DATABASE_QUICKSTART.md)
- [项目 README](./README.md)

---

**需要帮助？** 查看 [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 的常见问题部分。









