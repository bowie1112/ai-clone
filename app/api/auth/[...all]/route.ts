/**
 * Better Auth Next.js 路由处理器
 * 暴露 /api/auth/* 端点（如 /get-session、/sign-in、/sign-out 等）
 */

import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);








