import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// 在配置中导出 i18n 插件配置
const withNextIntl = require('next-intl/plugin')(
  './i18n/request.ts'
);

export default withNextIntl(nextConfig);
