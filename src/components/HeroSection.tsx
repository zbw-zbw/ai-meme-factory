"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SparklesIcon, ImageIcon } from "@/components/Icons";
import { preRenderExamples } from "@/lib/meme-renderer";
import type { MemeItem } from "@/types/meme";

export default function HeroSection() {
  const [examples, setExamples] = useState<MemeItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    preRenderExamples().then(setExamples);
  }, []);

  return (
    <section className="noise-bg relative flex min-h-[calc(100svh-64px)] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-24 md:px-8">
      {/* Mobile decorative blobs */}
      <div className="pointer-events-none absolute top-[15%] -left-10 h-32 w-32 rounded-full bg-primary-light/20 blur-2xl md:hidden" />
      <div className="pointer-events-none absolute bottom-[20%] -right-8 h-24 w-24 rounded-full bg-accent-light/20 blur-2xl md:hidden" />
      <div className="pointer-events-none absolute top-[60%] left-[5%] h-20 w-20 rounded-full bg-chill-accent/15 blur-2xl md:hidden" />

      {/* Desktop decorative glows */}
      <div className="pointer-events-none absolute top-[10%] right-[5%] hidden h-48 w-48 rounded-full bg-primary/10 blur-3xl md:block" />
      <div className="pointer-events-none absolute bottom-[15%] left-[8%] hidden h-40 w-40 rounded-full bg-accent/10 blur-3xl md:block" />
      <div className="pointer-events-none absolute top-[40%] left-[3%] hidden h-32 w-32 rounded-full bg-chill-accent/10 blur-3xl md:block" />

      {/* Content with staggered entrance */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Title - display font */}
        <h1
          className="gradient-title mb-5 font-display text-[2.4rem] font-normal leading-tight animate-slide-up sm:text-[3.6rem] md:text-[5rem]"
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
          <Link
            href="/create"
            className="btn-primary inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-center text-[1.05rem] font-bold no-underline sm:px-10 sm:text-[1.15rem]"
          >
            <SparklesIcon className="h-5 w-5" />
            开始制作
          </Link>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-7 py-3.5 text-center text-[1.05rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark sm:px-9 sm:text-[1.05rem]"
          >
            <ImageIcon className="h-5 w-5" />
            浏览画廊
          </Link>
        </div>
      </div>

      {/* Skeleton placeholder while examples load (prevents CLS) */}
      {mounted && examples.length === 0 && (
        <div className="relative z-10 mt-14 w-full max-w-[900px]">
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="aspect-square animate-pulse rounded-xl bg-card-hover" />
            ))}
          </div>
        </div>
      )}

      {/* Real meme examples showcase */}
      {mounted && examples.length > 0 && (
        <div className="relative z-10 mt-14 w-full max-w-[900px] animate-slide-up" style={{ animationDelay: "0.7s" }}>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {examples.map((item, i) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{
                  animation: `bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.8 + i * 0.12}s both`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.dataUrl}
                  alt={item.caption}
                  className="aspect-square w-full object-cover"
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[0.75rem] text-text-light">
            实际生成效果展示
          </p>
        </div>
      )}
    </section>
  );
}
