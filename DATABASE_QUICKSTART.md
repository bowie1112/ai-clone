# 🚀 数据库快速开始（5 分钟设置）

本指南帮助您快速配置 Supabase + Prisma 数据库。

---

## ⚡ 快速步骤

### 1️⃣ 创建 Supabase 项目（2 分钟）

1. 访问 https://supabase.com 并登录
2. 点击 "New Project"
3. 填写：
   - 项目名称
   - 数据库密码（**记住这个密码！**）
   - 选择区域（推荐：Tokyo）
4. 点击 "Create new project"
5. 等待项目初始化

### 2️⃣ 获取连接字符串（1 分钟）

1. 进入项目 → Settings → Database
2. 找到 "Connection string" 部分
3. 复制两个连接字符串：
   - **URI**（Transaction 模式）
   - **Connection pooling**（Session 模式）

### 3️⃣ 配置环境变量（1 分钟）

创建或编辑 `.env` 文件：

```env
# 替换 YOUR_PASSWORD 和 YOUR_PROJECT_REF
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true"
```

### 4️⃣ 运行迁移（1 分钟）

```bash
# 生成 Prisma Client
npx prisma generate

# 创建数据库表
npx prisma migrate dev --name init
```

### 5️⃣ 验证设置（30 秒）

```bash
# 打开 Prisma Studio 查看数据库
npx prisma studio

# 启动开发服务器
npm run dev

# 访问 Dashboard
# http://localhost:3000/zh/dashboard
```

---

## ✅ 完成！

现在您可以：
- ✅ 在 VideoGenerator 中生成视频时自动保存历史
- ✅ 在 Dashboard 中查看所有生成历史
- ✅ 使用 API 端点进行 CRUD 操作
- ✅ 使用 Prisma Studio 管理数据

---

## 📝 环境变量说明

| 变量 | 说明 | 必需 |
|------|------|------|
| `DATABASE_URL` | Transaction 模式连接（用于迁移） | ✅ 是 |
| `DIRECT_URL` | Session 模式连接（用于连接池） | ✅ 是 |

---

## 🔍 测试数据库

### 测试 1：创建视频记录

```bash
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "测试视频",
    "quality": "4k"
  }'
```

### 测试 2：查询视频列表

```bash
curl http://localhost:3000/api/videos
```

### 测试 3：使用 Prisma Studio

```bash
npx prisma studio
# 浏览器打开 http://localhost:5555
```

---

## ❓ 遇到问题？

### 连接失败

```bash
# 检查环境变量
cat .env | grep DATABASE_URL

# 测试连接
npx prisma db pull
```

### 重置数据库

```bash
# ⚠️ 会删除所有数据
npx prisma migrate reset
```

### 更新 Schema

```bash
# 修改 prisma/schema.prisma 后运行
npx prisma migrate dev --name your_change_name
```

---

## 📚 详细文档

- [完整 Supabase 设置指南](./SUPABASE_SETUP.md)
- [Prisma Schema](./prisma/schema.prisma)
- [API 路由](./app/api/videos/)
- [数据库操作函数](./lib/db/videos.ts)

---

**下一步：** [查看 SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 了解更多高级配置。









