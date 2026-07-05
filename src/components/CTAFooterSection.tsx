"use client";

import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";
import { SparklesIcon } from "@/components/Icons";

export default function CTAFooterSection() {
  return (
    <>
      {/* Bottom CTA */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6">
        {/* Decorative glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-[800px] text-center">
          <FadeInWrapper>
            <h2 className="font-display text-[2rem] font-normal text-text-dark sm:text-[2.5rem]">
              准备好做你的专属表情包了吗？
            </h2>
            <p className="mt-4 text-[1rem] text-text-muted">
              无需注册，打开即用，你的表情包你做主
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
              <Link
                href="/create"
                className="btn-primary inline-flex items-center gap-2 rounded-xl px-10 py-4 text-[1.1rem] font-bold no-underline"
              >
                <SparklesIcon className="h-5 w-5" />
                立即制作
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-8 py-4 text-[1.05rem] font-medium text-text-muted no-underline transition-colors hover:border-primary hover:text-text-dark"
              >
                浏览画廊
              </Link>
            </div>
          </FadeInWrapper>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light bg-bg-warm/30">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Brand */}
            <div className="text-center sm:text-left">
              <h3 className="font-display text-[1.2rem] font-bold gradient-logo">
                AI表情包工厂
              </h3>
              <p className="mt-1 text-[0.8rem] text-text-muted">
                让每一句话都有表情
              </p>
            </div>
            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 text-[0.85rem]">
              <Link href="/create" className="text-text-muted no-underline transition-colors hover:text-text-dark">
                制作表情包
              </Link>
              <Link href="/gallery" className="text-text-muted no-underline transition-colors hover:text-text-dark">
                我的画廊
              </Link>
              <a
                href="https://github.com/zbw-zbw/ai-meme-factory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted no-underline transition-colors hover:text-text-dark"
              >
                GitHub
              </a>
            </nav>
          </div>
          <div className="mt-8 border-t border-border-light pt-6 text-center">
            <p className="text-[0.75rem] text-text-light">
              © {new Date().getFullYear()} AI表情包工厂 · Made with ❤️
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
