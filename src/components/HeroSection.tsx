"use client";

import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";
import {
  SparklesIcon,
  HeartIcon,
  FireIcon,
  FishIcon,
  BriefcaseIcon,
} from "@/components/Icons";

const floatingIcons = [
  { Icon: HeartIcon, top: "18%", left: "8%", delay: "0s", size: 32, color: "#FB7185" },
  { Icon: FireIcon, top: "12%", right: "10%", delay: "0.5s", size: 28, color: "#F43F5E" },
  { Icon: BriefcaseIcon, bottom: "25%", left: "12%", delay: "1s", size: 24, color: "#475569" },
  { Icon: FishIcon, top: "22%", right: "15%", delay: "1.5s", size: 28, color: "#06B6D4" },
  { Icon: SparklesIcon, bottom: "30%", right: "8%", delay: "0.8s", size: 24, color: "#FBBF24" },
  { Icon: HeartIcon, bottom: "20%", left: "20%", delay: "1.2s", size: 28, color: "#EC4899" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden px-8 pb-16 pt-28 text-center md:px-6 md:pb-20 md:pt-32">
      {/* Floating SVG decorations */}
      {floatingIcons.map((item, i) => {
        const { Icon } = item;
        return (
          <span
            key={i}
            className="pointer-events-none absolute hidden select-none sm:block"
            style={{
              ...(item.top ? { top: item.top } : {}),
              ...(item.bottom ? { bottom: item.bottom } : {}),
              ...(item.left ? { left: item.left } : {}),
              ...(item.right ? { right: item.right } : {}),
              animation: `float-emoji 3s ease-in-out ${item.delay} infinite`,
            }}
          >
            <Icon
              width={item.size}
              height={item.size}
              style={{ color: item.color, opacity: 0.5 }}
            />
          </span>
        );
      })}

      {/* Mobile: show only 3 icons */}
      {floatingIcons.slice(0, 3).map((item, i) => {
        const { Icon } = item;
        return (
          <span
            key={`mobile-${i}`}
            className="pointer-events-none absolute select-none sm:hidden"
            style={{
              ...(item.top ? { top: item.top } : {}),
              ...(item.bottom ? { bottom: item.bottom } : {}),
              ...(item.left ? { left: item.left } : {}),
              ...(item.right ? { right: item.right } : {}),
              animation: `float-emoji 3s ease-in-out ${item.delay} infinite`,
            }}
          >
            <Icon
              width={item.size * 0.8}
              height={item.size * 0.8}
              style={{ color: item.color, opacity: 0.5 }}
            />
          </span>
        );
      })}

      <FadeInWrapper>
        {/* Main title */}
        <h1 className="gradient-title mb-4 text-[2.2rem] font-black leading-tight sm:text-[3.5rem]">
          AI表情包工厂
        </h1>

        {/* Subtitle */}
        <p className="mb-2 text-[1.2rem] font-medium text-text-muted sm:text-[1.5rem]">
          你说话，AI画表情包
        </p>

        {/* Description */}
        <p className="mb-8 text-[0.95rem] text-text-light sm:text-[1.1rem]">
          输入一句话，3秒生成4种风格专属表情包
        </p>

        {/* CTA button */}
        <Link
          href="/create"
          className="inline-flex items-center gap-2 animate-pulse-glow rounded-xl px-8 py-4 text-center text-[1.1rem] font-bold text-white transition-transform duration-200 hover:scale-105 no-underline sm:px-10 sm:text-[1.2rem]"
          style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
        >
          <SparklesIcon className="h-5 w-5" />
          开始制作
        </Link>
      </FadeInWrapper>
    </section>
  );
}
