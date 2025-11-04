import { betterAuth } from "better-auth";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

const socialProviders: Record<string, unknown> = {};
if (googleClientId && googleClientSecret) {
  // 仅在两者都存在时注册 Google 提供商，避免运行时报错
  // Better Auth 会在开发模式下缺省为内存存储
  (socialProviders as any).google = {
    clientId: googleClientId,
    clientSecret: googleClientSecret,
  };
}



export const auth = betterAuth({
  socialProviders: socialProviders as any,
});


