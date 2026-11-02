import type { Metadata, Viewport } from "next";
import { Italiana, Vazirmatn } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
});

const italiana = Italiana({
  variable: "--font-italiana",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "حساب‌یار | دفتر دخل و خرج",
  description:
    "دفترچه دخل و خرج شخصی، ساده و شفاف: ثبت سریع درآمد و هزینه، نمودار ترکیب خرج‌ها، تاریخ شمسی و حالت روز و شب — بدون ثبت‌نام، با ذخیره‌سازی محلی.",
  keywords: [
    "حسابداری شخصی",
    "مدیریت هزینه",
    "دفتر دخل و خرج",
    "درآمد",
    "حساب‌یار",
  ],
  applicationName: "حساب‌یار",
  authors: [{ name: "pingpixel92" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a07" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${italiana.variable}`}
    >
      <body className="antialiased bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" richColors closeButton dir="rtl" />
        </ThemeProvider>
      </body>
    </html>
  );
}
