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
      <footer className="border-t border-border-light px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-2">
          <p className="font-display text-[0.95rem] text-text-muted">
            AI表情包工厂
          </p>
          <p className="text-[0.8rem] text-text-light">
            让每一句话都有表情 · 2026
          </p>
        </div>
      </footer>
    </>
  );
}
