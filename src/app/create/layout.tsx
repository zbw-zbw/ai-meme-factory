import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "生成表情包 | AI表情包工厂",
  description: "输入一句话，AI为你生成可爱/毒舌/摸鱼/正经四种风格的专属表情包",
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
