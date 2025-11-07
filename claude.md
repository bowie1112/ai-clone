# Claude 对话规则

## 语言设置

**默认使用中文进行对话**

本项目在与 Claude AI 助手交互时,请使用中文作为主要沟通语言。

## 对话规则

### 1. 语言要求
- 所有对话、解释、说明均使用**简体中文**
- 代码注释可使用中文或英文,优先使用中文
- 技术术语可保留英文原文,但需附带中文解释

### 2. 代码规范
- 变量名、函数名、类名等使用英文(符合编程规范)
- 注释使用中文,清晰说明代码逻辑
- 文档字符串(docstring)使用中文

### 3. 文档编写
- 项目文档使用中文编写
- README、说明文档等使用中文
- 技术文档优先使用中文,必要时英文术语加中文注解

### 4. 交流方式
- 问题描述使用中文
- 错误报告使用中文说明
- 解决方案使用中文解释

## 示例

### 好的做法 ✓

```typescript
// 获取用户订单历史
async function getUserOrders(userId: string) {
  // 查询数据库中的订单记录
  const orders = await prisma.order.findMany({
    where: { userId }
  });
  return orders;
}
```

### 不推荐的做法 ✗

```typescript
// Get user order history
async function getUserOrders(userId: string) {
  // Query order records from database
  const orders = await prisma.order.findMany({
    where: { userId }
  });
  return orders;
}
```

## 项目背景

本项目是一个支持多语言的 Next.js 应用,包含:
- 国际化 (i18n) 支持:中文、英文、日文、西班牙文
- Supabase/PostgreSQL 数据库集成
- Dodo Payments 支付集成
- 视频生成历史记录功能

## 注意事项

1. **用户界面**:面向用户的界面文字通过 i18n 系统管理,支持多语言
2. **开发文档**:开发相关的文档和说明使用中文
3. **Git 提交**:commit message 可使用中文或英文
4. **代码审查**:代码审查意见使用中文

---

**最后更新**: 2025-11-05
