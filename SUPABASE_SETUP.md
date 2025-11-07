# 🗄️ Supabase + Prisma 设置指南

本指南将帮助您配置 Supabase PostgreSQL 数据库，并使用 Prisma 进行数据管理。

---

## 📋 目录

1. [创建 Supabase 项目](#1-创建-supabase-项目)
2. [获取数据库连接字符串](#2-获取数据库连接字符串)
3. [配置环境变量](#3-配置环境变量)
4. [运行数据库迁移](#4-运行数据库迁移)
5. [验证设置](#5-验证设置)
6. [常见问题](#6-常见问题)

---

## 1. 创建 Supabase 项目

### 步骤 1.1：注册 Supabase 账户

1. 访问 [Supabase 官网](https://supabase.com)
2. 点击 "Start your project" 注册账户
3. 使用 GitHub、Google 或邮箱注册

### 步骤 1.2：创建新项目

1. 登录后，点击 "New Project"
2. 填写项目信息：
   - **Name**: 项目名称（例如：`sora-video-generator`）
   - **Database Password**: 设置一个强密码（**请妥善保存！**）
   - **Region**: 选择离您最近的区域（例如：`Northeast Asia (Tokyo)`）
   - **Pricing Plan**: 选择 Free 或 Pro

3. 点击 "Create new project"
4. 等待项目初始化（约 1-2 分钟）

---

## 2. 获取数据库连接字符串

### 步骤 2.1：进入项目设置

1. 在 Supabase 控制台，选择您刚创建的项目
2. 点击左侧菜单的 ⚙️ **Settings**
3. 选择 **Database**

### 步骤 2.2：复制连接字符串

在 "Connection string" 部分，您会看到多种连接方式：

#### **Transaction 模式（用于 Prisma 迁移）**
```
Connection string
URI: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### **Session 模式（用于生产环境连接池）**
```
Connection pooling
URI: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true
```

**重要提示：**
- `[YOUR-PASSWORD]` 需要替换为您在创建项目时设置的数据库密码
- `[PROJECT-REF]` 是您的项目引用ID（自动显示在连接字符串中）

---

## 3. 配置环境变量

### 步骤 3.1：创建 .env 文件

在项目根目录创建 `.env` 文件（如果还没有）：

```bash
touch .env
```

### 步骤 3.2：添加数据库连接字符串

将以下内容添加到 `.env` 文件中，**替换为您的实际连接字符串**：

```env
# Supabase 数据库连接
# Transaction 模式（用于 Prisma 迁移和大多数操作）
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres"

# Session 模式（用于无服务器环境，通过连接池）
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:6543/postgres?pgbouncer=true"
```

**示例**（假设密码是 `MySecurePass123`，项目引用是 `abcdefghijklmn`）：

```env
DATABASE_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmn.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:MySecurePass123@db.abcdefghijklmn.supabase.co:6543/postgres?pgbouncer=true"
```

### 步骤 3.3：确保 .env 已添加到 .gitignore

确认 `.gitignore` 文件包含 `.env`：

```gitignore
# 环境变量
.env
.env.local
.env.*.local
```

---

## 4. 运行数据库迁移

### 步骤 4.1：生成 Prisma Client

```bash
npx prisma generate
```

这会生成 Prisma Client，让您可以在代码中使用数据库模型。

### 步骤 4.2：创建并应用迁移

**开发环境**（推荐）：

```bash
npx prisma migrate dev --name init
```

这个命令会：
1. 创建迁移文件
2. 应用迁移到数据库
3. 生成 Prisma Client

**生产环境**：

```bash
npx prisma migrate deploy
```

### 步骤 4.3：查看数据库

在 Supabase 控制台：
1. 点击左侧菜单的 **Table Editor**
2. 您应该看到新创建的表：
   - `users`
   - `videos`

---

## 5. 验证设置

### 步骤 5.1：使用 Prisma Studio

运行 Prisma Studio 来可视化和管理数据库：

```bash
npx prisma studio
```

浏览器会自动打开 `http://localhost:5555`，您可以：
- 查看所有表
- 添加、编辑、删除记录
- 测试查询

### 步骤 5.2：测试 API 端点

启动开发服务器：

```bash
npm run dev
```

测试视频 API：

```bash
# 创建视频记录
curl -X POST http://localhost:3000/api/videos \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A beautiful sunset over mountains",
    "quality": "4k",
    "locale": "en"
  }'

# 获取视频列表
curl http://localhost:3000/api/videos
```

### 步骤 5.3：访问 Dashboard

1. 打开 http://localhost:3000/zh/dashboard
2. 您应该看到空的视频历史
3. 点击 "创建新视频" 生成视频
4. 刷新页面，视频应该出现在历史记录中

---

## 6. 常见问题

### ❓ 问题 1：连接超时

**错误信息**：
```
Error: P1001: Can't reach database server
```

**解决方案**：
1. 检查网络连接
2. 确认 Supabase 项目状态正常
3. 验证数据库密码正确
4. 检查防火墙设置

### ❓ 问题 2：密码包含特殊字符

如果您的密码包含特殊字符（如 `@`, `#`, `$` 等），需要进行 URL 编码：

**特殊字符编码表**：
```
@  -> %40
#  -> %23
$  -> %24
&  -> %26
+  -> %2B
=  -> %3D
/  -> %2F
:  -> %3A
```

**示例**：
```
原始密码: MyPass@123#
编码后: MyPass%40123%23
```

### ❓ 问题 3：迁移失败

**错误信息**：
```
Error: Schema engine error:
ERROR: relation "videos" already exists
```

**解决方案**：

```bash
# 重置数据库（⚠️ 会删除所有数据）
npx prisma migrate reset

# 或者手动删除迁移历史
npx prisma migrate resolve --rolled-back "迁移名称"
```

### ❓ 问题 4：Prisma Client 未更新

**解决方案**：

```bash
# 删除 node_modules 和重新安装
rm -rf node_modules
npm install

# 重新生成 Prisma Client
npx prisma generate
```

### ❓ 问题 5：生产环境部署

**Vercel 部署**：

1. 在 Vercel 项目设置中添加环境变量：
   - `DATABASE_URL`
   - `DIRECT_URL`

2. 在 `package.json` 添加 postinstall 脚本：
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

3. 部署时自动运行迁移：
```bash
npx prisma migrate deploy
```

---

## 📊 数据库 Schema 说明

### Users 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| email | String | 邮箱（唯一） |
| name | String? | 用户名 |
| avatar | String? | 头像 URL |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |

### Videos 表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键（CUID） |
| userId | String? | 用户 ID（外键） |
| prompt | String | 视频描述提示词 |
| title | String? | 视频标题 |
| status | Enum | 状态（PENDING/PROCESSING/COMPLETED/FAILED/CANCELLED） |
| quality | String? | 质量（standard/hd/4k） |
| videoUrl | String? | 视频 URL |
| thumbnailUrl | String? | 缩略图 URL |
| lumaId | String? | Luma API 任务 ID |
| locale | String | 语言代码 |
| createdAt | DateTime | 创建时间 |
| updatedAt | DateTime | 更新时间 |
| completedAt | DateTime? | 完成时间 |

---

## 🔒 安全最佳实践

1. **永远不要提交 .env 文件到 Git**
2. **使用强密码**（至少 16 个字符，包含大小写字母、数字和符号）
3. **定期更换数据库密码**
4. **使用 Row Level Security (RLS)**（如果需要）
5. **限制数据库访问权限**

---

## 📚 更多资源

- [Supabase 官方文档](https://supabase.com/docs)
- [Prisma 官方文档](https://www.prisma.io/docs)
- [Prisma + Supabase 指南](https://www.prisma.io/docs/guides/database/supabase)
- [本项目 Prisma Schema](./prisma/schema.prisma)
- [API 路由文档](./app/api/videos/)

---

## ✅ 设置完成检查清单

- [ ] 创建 Supabase 项目
- [ ] 获取数据库连接字符串
- [ ] 配置 `.env` 文件
- [ ] 运行 `npx prisma generate`
- [ ] 运行 `npx prisma migrate dev`
- [ ] 验证表已创建（Table Editor）
- [ ] 测试 API 端点
- [ ] 访问 Dashboard 查看视频历史
- [ ] 生成测试视频
- [ ] 确认数据正确保存

---

**🎉 恭喜！您已成功设置 Supabase + Prisma！**

现在您可以开始使用数据库记录视频生成历史了。









