import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "我的画廊 | AI表情包工厂",
  description: "查看你生成的所有AI表情包",
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
