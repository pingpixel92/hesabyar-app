import type { NextConfig } from "next";

/**
 * حساب‌یار — تنظیمات بیلد
 *
 * حالت عادی (محلی/پیش‌نمایش): سرور استاندارد Next.js
 * حالت STATIC_EXPORT=1 (دیپلوی): خروجی کاملاً استاتیک برای GitHub Pages
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const REPO_NAME = "hesabyar-app";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        basePath: `/${REPO_NAME}`,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
  reactStrictMode: false,
};

export default nextConfig;
