import type { Metadata } from "next";
import { Noto_Sans_SC, ZCOOL_KuaiLe } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";
import BackToTop from "@/components/BackToTop";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const zcoolKuaiLe = ZCOOL_KuaiLe({
  variable: "--font-zcool-kuaile",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ai-meme-factory.vercel.app"),
  title: "AI表情包工厂 - 你说话，AI画表情包",
  description:
    "输入一句话，AI秒速生成4种风格专属表情包。可爱风、毒舌风、摸鱼风、正经风，一键下载，直发微信群。",
  keywords: ["AI表情包", "表情包生成器", "表情包制作", "AI", "meme generator"],
  openGraph: {
    title: "AI表情包工厂 - 你说话，AI画表情包",
    description: "输入一句话，3秒生成4种风格专属表情包",
    type: "website",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} ${zcoolKuaiLe.variable} antialiased`}>
      <body className="min-h-screen font-sans bg-bg text-text-dark">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white focus:font-medium"
        >
          跳到主内容
        </a>
        <ToastProvider>
          {children}
          <BackToTop />
        </ToastProvider>
      </body>
    </html>
  );
}
