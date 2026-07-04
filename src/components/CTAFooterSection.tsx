"use client";

import Link from "next/link";
import FadeInWrapper from "./FadeInWrapper";
import { SparklesIcon, ArrowRightIcon } from "@/components/Icons";

export default function CTAFooterSection() {
  return (
    <>
      {/* Bottom CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <FadeInWrapper className="text-center">
            <h2 className="mb-6 font-display text-[1.5rem] font-bold sm:text-[2rem]">
              你的心情，值得一个专属表情包
            </h2>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-center text-[1.1rem] font-bold text-white no-underline transition-colors hover:bg-primary-dark sm:px-10 sm:py-4 sm:text-[1.2rem]"
            >
              <SparklesIcon className="h-5 w-5" />
              立即体验
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
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
