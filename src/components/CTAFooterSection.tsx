"use client";

import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";

export default function CTAFooterSection() {
  return (
    <>
      {/* Bottom CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <FadeInWrapper className="text-center">
            <h2 className="mb-6 text-[1.5rem] font-bold sm:text-[2rem]">
              你的心情，值得一个专属表情包 😎
            </h2>
            <Link
              href="/create"
              className="inline-block animate-pulse-glow rounded-xl px-8 py-4 text-center text-[1.1rem] font-bold text-white no-underline transition-transform duration-200 hover:scale-105 sm:px-10 sm:text-[1.2rem]"
              style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}
            >
              立即体验 →
            </Link>
          </FadeInWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-[1200px] text-center">
          <p className="text-[0.85rem] text-text-light">
            AI表情包工厂 · TRAE AI 创造力大赛 · 生活娱乐赛道 · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
