"use client";

import Link from "next/link";
import { SparklesIcon, ImageIcon } from "@/components/Icons";

/* Minimal floating decorations - just 3 subtle icons */
const decorations = [
  { Icon: SparklesIcon, top: "20%", left: "10%", delay: "0s", color: "#FBBF24", opacity: 0.35 },
  { Icon: SparklesIcon, top: "15%", right: "12%", delay: "1.2s", color: "#EC4899", opacity: 0.25 },
  { Icon: SparklesIcon, bottom: "25%", left: "18%", delay: "0.6s", color: "#F59E0B", opacity: 0.3 },
];

export default function HeroSection() {
  return (
    <section className="noise-bg relative flex min-h-[calc(100svh-64px)] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-24 md:px-8">
      {/* Mobile decorative blobs */}
      <div className="pointer-events-none absolute top-[15%] -left-10 h-32 w-32 rounded-full bg-primary-light/20 blur-2xl md:hidden" />
      <div className="pointer-events-none absolute bottom-[20%] -right-8 h-24 w-24 rounded-full bg-accent-light/20 blur-2xl md:hidden" />
      <div className="pointer-events-none absolute top-[60%] left-[5%] h-20 w-20 rounded-full bg-chill-accent/15 blur-2xl md:hidden" />

      {/* Floating decorations - hidden on mobile for cleaner look */}
      {decorations.map((item, i) => {
        const { Icon } = item;
        return (
          <span
            key={i}
            className="pointer-events-none absolute hidden select-none md:block animate-float"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              animationDelay: item.delay,
            }}
          >
            <Icon
              width={24}
              height={24}
              className="opacity-35"
              style={{ color: item.color }}
            />
          </span>
        );
      })}

      {/* Content with staggered entrance */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title - display font */}
        <h1
          className="gradient-title mb-5 font-display text-[2.4rem] font-black leading-tight animate-slide-up sm:text-[3.6rem] md:text-[4.2rem]"
          style={{ animationDelay: "0.1s" }}
        >
          AI表情包工厂
        </h1>

        {/* Subtitle */}
        <p
          className="mb-2 text-[1.15rem] font-medium text-text-muted animate-slide-up sm:text-[1.4rem]"
          style={{ animationDelay: "0.25s" }}
        >
          你说话，AI画表情包
        </p>

        {/* Description */}
        <p
          className="mb-10 max-w-md text-[0.95rem] leading-relaxed text-text-light animate-slide-up sm:text-[1.05rem]"
          style={{ animationDelay: "0.4s" }}
        >
          输入一句话，3秒生成4种风格专属表情包
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col items-center gap-4 animate-slide-up sm:flex-row sm:gap-5"
          style={{ animationDelay: "0.55s" }}
        >
          {/* Primary CTA */}
          <Link
            href="/create"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-center text-[1.05rem] font-bold text-white no-underline transition-colors hover:bg-primary-dark sm:px-10 sm:text-[1.15rem]"
          >
            <SparklesIcon className="h-5 w-5" />
            开始制作
          </Link>

          {/* Secondary CTA - gallery link */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-7 py-3.5 text-center text-[1.05rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark sm:px-9 sm:text-[1.05rem]"
          >
            <ImageIcon className="h-5 w-5" />
            浏览画廊
          </Link>
        </div>
      </div>
    </section>
  );
}
