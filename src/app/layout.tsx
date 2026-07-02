import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI表情包工厂 - 你说话，AI画表情包",
  description:
    "输入一句话，AI秒速生成4种风格专属表情包。可爱风、毒舌风、摸鱼风、正经风，一键下载，直发微信群。",
  keywords: ["AI表情包", "表情包生成器", "表情包制作", "AI", "meme generator"],
  openGraph: {
    title: "AI表情包工厂 - 你说话，AI画表情包",
    description: "输入一句话，3秒生成4种风格专属表情包",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} antialiased`}>
      <body className="min-h-screen font-sans bg-bg text-text-dark">{children}</body>
    </html>
  );
}
