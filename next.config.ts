import type { NextConfig } from "next";

/**
 * حساب‌یار — تنظیمات بیلد
 *
 * حالت عادی (محلی/پیش‌نمایش): سرور استاندارد Next.js
 * حالت STATIC_EXPORT=1 (دیپلوی): خروجی کاملاً استاتیک برای GitHub Pages
 *
 * دامنهٔ اختصاصی (hesabyar.kdns.fr) سایت را از «ریشه» سرو می‌کند،
 * پس basePath لازم نیست؛ خروجی با مسیرهای نسبی ریشه ساخته می‌شود.
 */
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        output: "standalone" as const,
      }),
  reactStrictMode: false,
};

export default nextConfig;
